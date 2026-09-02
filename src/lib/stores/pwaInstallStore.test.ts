import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { get } from 'svelte/store';
import {
	isInstalled,
	canInstallPrompt,
	isIos,
	isStandalone,
	initPwa,
	promptInstall,
	checkIsStandalone,
	checkIsIos,
	checkIsInstalled,
	initFullscreenOnGesture,
	_resetPwaStoreForTesting
} from './pwaInstallStore';

describe('pwaInstallStore', () => {
	let listeners: Record<string, ((event: unknown) => void)[]> = {};

	const mockNavigator = {
		userAgent: '',
		platform: '',
		maxTouchPoints: 0,
		standalone: false
	};

	const mockWindow = {
		matchMedia: vi.fn(),
		navigator: mockNavigator,
		addEventListener: vi.fn((event: string, cb: (event: unknown) => void) => {
			if (!listeners[event]) listeners[event] = [];
			listeners[event].push(cb);
		}),
		removeEventListener: vi.fn((event: string, cb: (event: unknown) => void) => {
			if (listeners[event]) {
				listeners[event] = listeners[event].filter((fn) => fn !== cb);
			}
		}),
		dispatchEvent: vi.fn((event: { type: string }) => {
			const list = listeners[event.type] || [];
			for (const fn of list) {
				fn(event);
			}
			return true;
		})
	};

	beforeEach(() => {
		listeners = {};
		mockNavigator.userAgent = '';
		mockNavigator.platform = '';
		mockNavigator.maxTouchPoints = 0;
		mockNavigator.standalone = false;
		mockWindow.matchMedia = vi.fn().mockImplementation(() => ({
			matches: false,
			media: '',
			addEventListener: vi.fn()
		}));

		_resetPwaStoreForTesting();
		vi.restoreAllMocks();

		Object.defineProperty(globalThis, 'window', {
			value: mockWindow,
			configurable: true,
			writable: true
		});
	});

	afterEach(() => {
		delete (globalThis as Record<string, unknown>).window;
	});

	it('detects standalone mode from matchMedia display-mode: standalone', () => {
		mockWindow.matchMedia = vi.fn().mockImplementation((query: string) => ({
			matches: query === '(display-mode: standalone)',
			media: query,
			addEventListener: vi.fn()
		}));

		expect(checkIsStandalone()).toBe(true);
	});

	it('detects standalone mode from navigator.standalone on iOS', () => {
		mockNavigator.standalone = true;
		expect(checkIsStandalone()).toBe(true);
	});

	it('detects iOS from iPhone user agent', () => {
		mockNavigator.userAgent =
			'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Mobile/15E148 Safari/604.1';
		mockNavigator.platform = 'iPhone';

		expect(checkIsIos()).toBe(true);
		initPwa();
		expect(get(isIos)).toBe(true);
	});

	it('detects iOS from iPadOS with MacIntel and touch points', () => {
		mockNavigator.userAgent =
			'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15';
		mockNavigator.platform = 'MacIntel';
		mockNavigator.maxTouchPoints = 5;

		expect(checkIsIos()).toBe(true);
		initPwa();
		expect(get(isIos)).toBe(true);
	});

	it('handles beforeinstallprompt event and triggers native install prompt', async () => {
		initPwa();
		expect(get(canInstallPrompt)).toBe(false);

		const preventDefault = vi.fn();
		const prompt = vi.fn().mockResolvedValue(undefined);
		const userChoice = Promise.resolve({ outcome: 'accepted' as const, platform: 'web' });

		const mockEvent = {
			type: 'beforeinstallprompt',
			preventDefault,
			prompt,
			userChoice
		};

		mockWindow.dispatchEvent(mockEvent as unknown as { type: string });

		expect(preventDefault).toHaveBeenCalled();
		expect(get(canInstallPrompt)).toBe(true);

		const result = await promptInstall();
		expect(prompt).toHaveBeenCalled();
		expect(result).toBe('accepted');
		expect(get(isInstalled)).toBe(true);
		expect(get(canInstallPrompt)).toBe(false);
	});

	it('handles dismissed install prompt', async () => {
		initPwa();

		const mockEvent = {
			type: 'beforeinstallprompt',
			preventDefault: vi.fn(),
			prompt: vi.fn().mockResolvedValue(undefined),
			userChoice: Promise.resolve({ outcome: 'dismissed' as const, platform: 'web' })
		};

		mockWindow.dispatchEvent(mockEvent as unknown as { type: string });
		expect(get(canInstallPrompt)).toBe(true);

		const result = await promptInstall();
		expect(result).toBe('dismissed');
		expect(get(isInstalled)).toBe(false);
		expect(get(canInstallPrompt)).toBe(false);
	});

	it('returns manual if no deferredPrompt is available', async () => {
		initPwa();
		const result = await promptInstall();
		expect(result).toBe('manual');
	});

	it('returns already-installed if app is already running in standalone mode', async () => {
		mockWindow.matchMedia = vi.fn().mockImplementation((query: string) => ({
			matches: query === '(display-mode: standalone)',
			media: query,
			addEventListener: vi.fn()
		}));

		initPwa();
		const result = await promptInstall();
		expect(result).toBe('already-installed');
		expect(get(isInstalled)).toBe(true);
	});

	it('updates isInstalled when appinstalled event fires', () => {
		initPwa();
		expect(get(isInstalled)).toBe(false);

		mockWindow.dispatchEvent({ type: 'appinstalled' });
		expect(get(isInstalled)).toBe(true);
		expect(get(isStandalone)).toBe(true);
	});
	describe('initFullscreenOnGesture', () => {
		type DocListener = { cb: (event: unknown) => void; once: boolean };
		let docListeners: Record<string, DocListener[]> = {};
		let requestFullscreen: ReturnType<typeof vi.fn>;
		let mockDocument: {
			fullscreenElement: unknown;
			documentElement: { requestFullscreen: ReturnType<typeof vi.fn> };
			addEventListener: ReturnType<typeof vi.fn>;
			removeEventListener: ReturnType<typeof vi.fn>;
		};

		/** Fire every handler registered for an event, honouring `{ once: true }`. */
		const fireOnDocument = (type: string) => {
			const current = docListeners[type] ?? [];
			docListeners[type] = current.filter((l) => !l.once);
			for (const l of current) l.cb({ type });
		};

		/** Make matchMedia report the app as running in standalone display mode. */
		const runAsStandalone = () => {
			mockWindow.matchMedia = vi.fn().mockImplementation((query: string) => ({
				matches: query === '(display-mode: standalone)',
				media: query,
				addEventListener: vi.fn()
			}));
		};

		beforeEach(() => {
			docListeners = {};
			requestFullscreen = vi.fn().mockResolvedValue(undefined);
			mockDocument = {
				fullscreenElement: null,
				documentElement: { requestFullscreen },
				addEventListener: vi.fn(
					(event: string, cb: (event: unknown) => void, options?: { once?: boolean }) => {
						if (!docListeners[event]) docListeners[event] = [];
						docListeners[event].push({ cb, once: options?.once === true });
					}
				),
				removeEventListener: vi.fn()
			};
			Object.defineProperty(globalThis, 'document', {
				value: mockDocument,
				configurable: true,
				writable: true
			});
		});

		afterEach(() => {
			delete (globalThis as Record<string, unknown>).document;
		});

		it('does not arm a gesture listener in a plain browser tab', () => {
			initFullscreenOnGesture();

			expect(docListeners['pointerdown']).toBeUndefined();
			expect(requestFullscreen).not.toHaveBeenCalled();
		});

		it('requests fullscreen on the first pointerdown when installed', () => {
			runAsStandalone();
			initFullscreenOnGesture();

			expect(docListeners['pointerdown']).toHaveLength(1);
			fireOnDocument('pointerdown');
			expect(requestFullscreen).toHaveBeenCalledTimes(1);
		});

		it('does not request fullscreen when an element is already fullscreen', () => {
			runAsStandalone();
			mockDocument.fullscreenElement = {};
			initFullscreenOnGesture();

			expect(docListeners['pointerdown']).toBeUndefined();
			expect(requestFullscreen).not.toHaveBeenCalled();
		});

		it('re-arms after the user leaves fullscreen', () => {
			runAsStandalone();
			initFullscreenOnGesture();
			fireOnDocument('pointerdown');
			expect(requestFullscreen).toHaveBeenCalledTimes(1);

			// Simulate the Android back gesture dropping out of fullscreen.
			mockDocument.fullscreenElement = null;
			fireOnDocument('fullscreenchange');
			fireOnDocument('pointerdown');

			expect(requestFullscreen).toHaveBeenCalledTimes(2);
		});

		it('does not throw when requestFullscreen returns undefined', () => {
			runAsStandalone();
			// Legacy prefixed WebKit returns undefined rather than a Promise.
			requestFullscreen.mockReturnValue(undefined);
			initFullscreenOnGesture();

			expect(() => fireOnDocument('pointerdown')).not.toThrow();
			expect(requestFullscreen).toHaveBeenCalledTimes(1);
		});

		it('is inert when called twice', () => {
			runAsStandalone();
			initFullscreenOnGesture();
			initFullscreenOnGesture();

			expect(docListeners['pointerdown']).toHaveLength(1);
		});

		it('does not treat an active Fullscreen API request as installed', () => {
			mockWindow.matchMedia = vi.fn().mockImplementation((query: string) => ({
				matches: query === '(display-mode: fullscreen)',
				media: query,
				addEventListener: vi.fn()
			}));
			mockDocument.fullscreenElement = {};

			expect(checkIsInstalled()).toBe(false);
		});
	});
});
