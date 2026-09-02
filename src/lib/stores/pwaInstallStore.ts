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
	_isInstalled.set(standalone);
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

export async function promptInstall(): Promise<InstallPromptOutcome> {
	if (checkIsStandalone()) {
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
	_isInstalled.set(false);
	_canInstallPrompt.set(false);
	_isIos.set(false);
	_isStandalone.set(false);
}
