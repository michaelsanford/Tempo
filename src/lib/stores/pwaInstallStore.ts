import { writable, type Readable } from 'svelte/store';
import { browser } from '$app/environment';

export type InstallPromptOutcome = 'accepted' | 'dismissed' | 'manual' | 'already-installed';

interface BeforeInstallPromptEvent extends Event {
	readonly platforms: string[];
	readonly userChoice: Promise<{
		outcome: 'accepted' | 'dismissed';
		platform: string;
	}>;
	prompt(): Promise<void>;
}

/** Vendor-prefixed fullscreen entry point still shipped by older WebKit builds. */
interface FullscreenCapableElement extends HTMLElement {
	webkitRequestFullscreen?: () => Promise<void> | undefined;
}

const _isInstalled = writable<boolean>(false);
const _canInstallPrompt = writable<boolean>(false);
const _isIos = writable<boolean>(false);
const _isStandalone = writable<boolean>(false);

export const isInstalled: Readable<boolean> = { subscribe: _isInstalled.subscribe };
export const canInstallPrompt: Readable<boolean> = { subscribe: _canInstallPrompt.subscribe };
export const isIos: Readable<boolean> = { subscribe: _isIos.subscribe };
export const isStandalone: Readable<boolean> = { subscribe: _isStandalone.subscribe };

let deferredPrompt: BeforeInstallPromptEvent | null = null;
let initialized = false;
let fullscreenInitialized = false;

export function checkIsStandalone(): boolean {
	if (!browser && typeof window === 'undefined') return false;
	try {
		const nav = window.navigator as unknown as { standalone?: boolean };
		const navStandalone = nav?.standalone === true;
		const mqlStandalone = window.matchMedia?.('(display-mode: standalone)')?.matches ?? false;
		const mqlFullscreen = window.matchMedia?.('(display-mode: fullscreen)')?.matches ?? false;
		return navStandalone || mqlStandalone || mqlFullscreen;
	} catch {
		return false;
	}
}

/**
 * Whether the app is running as an installed PWA.
 *
 * Deliberately narrower than `checkIsStandalone()`: entering full-screen through the
 * Fullscreen API (or F11 in a desktop tab) also matches `(display-mode: fullscreen)`,
 * which would otherwise make a plain browser tab look installed and hide the install UI.
 * When an element is currently full-screen, the fullscreen display-mode is ignored.
 */
export function checkIsInstalled(): boolean {
	if (!browser && typeof window === 'undefined') return false;
	try {
		const nav = window.navigator as unknown as { standalone?: boolean };
		if (nav?.standalone === true) return true;
		if (window.matchMedia?.('(display-mode: standalone)')?.matches) return true;
		if (window.matchMedia?.('(display-mode: minimal-ui)')?.matches) return true;

		// Only trust fullscreen as an "installed" signal when it is the launch display mode
		// rather than an active Fullscreen API request.
		const elementIsFullscreen =
			typeof document !== 'undefined' && document.fullscreenElement != null;
		return (
			!elementIsFullscreen && (window.matchMedia?.('(display-mode: fullscreen)')?.matches ?? false)
		);
	} catch {
		return false;
	}
}

export function checkIsIos(): boolean {
	if (!browser && typeof window === 'undefined') return false;
	try {
		const ua = window.navigator?.userAgent || '';
		const isAppleDevice = /iPad|iPhone|iPod/.test(ua);
		// Touch points check for modern iPadOS which reports as Macintosh
		const isIpadOs =
			window.navigator?.platform === 'MacIntel' && (window.navigator?.maxTouchPoints ?? 0) > 1;
		return isAppleDevice || isIpadOs;
	} catch {
		return false;
	}
}

export function initPwa(): void {
	if (initialized || (!browser && typeof window === 'undefined')) return;
	initialized = true;

	const standalone = checkIsStandalone();
	_isStandalone.set(standalone);
	_isInstalled.set(checkIsInstalled());
	_isIos.set(checkIsIos());

	window.addEventListener('beforeinstallprompt', (e: Event) => {
		e.preventDefault();
		deferredPrompt = e as BeforeInstallPromptEvent;
		_canInstallPrompt.set(true);
	});

	window.addEventListener('appinstalled', () => {
		deferredPrompt = null;
		_canInstallPrompt.set(false);
		_isInstalled.set(true);
		_isStandalone.set(true);
	});

	if (window.matchMedia) {
		const mql = window.matchMedia('(display-mode: standalone)');
		mql.addEventListener?.('change', (e) => {
			if (e.matches) {
				_isInstalled.set(true);
				_isStandalone.set(true);
				_canInstallPrompt.set(false);
			}
		});
	}
}

/**
 * Take the installed app truly full-screen (hiding the Android status and navigation
 * bars) on the first user gesture.
 *
 * The manifest's `display_override` already asks for this at launch, but not every
 * browser honours it; this is the fallback. The Fullscreen API requires a user gesture,
 * so the request is deferred to the first pointer event. It is gated on the app running
 * as an installed PWA so that a normal browser tab is never taken full-screen, and it
 * re-arms when the user leaves full-screen (e.g. the Android back gesture).
 */
export function initFullscreenOnGesture(): void {
	if (fullscreenInitialized || (!browser && typeof window === 'undefined')) return;
	if (typeof document === 'undefined') return;
	fullscreenInitialized = true;

	const request = () => {
		try {
			// Re-check on the gesture itself: the app may have been installed mid-session.
			if (!checkIsStandalone()) return;
			const el = document.documentElement as FullscreenCapableElement;
			const req = el.requestFullscreen ?? el.webkitRequestFullscreen;
			if (!req) return;
			// Prefixed WebKit implementations return undefined rather than a Promise.
			const result = req.call(el);
			if (result && typeof result.catch === 'function') {
				result.catch(() => {});
			}
		} catch {
			/* the user agent refused the request; nothing useful to do */
		}
	};

	const arm = () => {
		if (!checkIsStandalone()) return;
		if (document.fullscreenElement) return;
		document.addEventListener('pointerdown', request, { once: true });
	};

	arm();

	document.addEventListener('fullscreenchange', () => {
		if (!document.fullscreenElement) arm();
	});
}

export async function promptInstall(): Promise<InstallPromptOutcome> {
	if (checkIsInstalled()) {
		_isInstalled.set(true);
		return 'already-installed';
	}

	if (deferredPrompt) {
		try {
			await deferredPrompt.prompt();
			const { outcome } = await deferredPrompt.userChoice;
			deferredPrompt = null;
			_canInstallPrompt.set(false);
			if (outcome === 'accepted') {
				_isInstalled.set(true);
			}
			return outcome;
		} catch {
			return 'manual';
		}
	}

	return 'manual';
}

/** Helper used in unit tests to reset store and internal state */
export function _resetPwaStoreForTesting(): void {
	deferredPrompt = null;
	initialized = false;
	fullscreenInitialized = false;
	_isInstalled.set(false);
	_canInstallPrompt.set(false);
	_isIos.set(false);
	_isStandalone.set(false);
}
