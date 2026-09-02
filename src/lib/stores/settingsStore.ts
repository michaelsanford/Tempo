import { browser } from '$app/environment';
import { persistedStore } from './persist';
import { DEFAULT_LOCALE, matchBrowserLocale } from '$lib/i18n/locales';
import type { Settings } from '$lib/types/settings';

function defaultSettings(): Settings {
	return {
		schemaVersion: 1,
		narrationEnabled: true,
		soundEffectsEnabled: true,
		difficultyOverride: 'auto',
		parentGateType: 'holdButton',
		locale: browser ? matchBrowserLocale(navigator.language) : DEFAULT_LOCALE,
		theme: 'dark'
	};
}

export const settingsStore = persistedStore<Settings>('clock.settings.v1', defaultSettings());
