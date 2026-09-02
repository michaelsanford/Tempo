import { derived } from 'svelte/store';
import { settingsStore } from '$lib/stores/settingsStore';
import { enCA } from './translations/en-CA';
import { frCA } from './translations/fr-CA';
import { frFR } from './translations/fr-FR';
import { zhCN } from './translations/zh-CN';
import { guIN } from './translations/gu-IN';
import { enCASpeech } from './speech/en-CA';
import { frCASpeech } from './speech/fr-CA';
import { frFRSpeech } from './speech/fr-FR';
import { zhCNSpeech } from './speech/zh-CN';
import { guINSpeech } from './speech/gu-IN';
import type { Locale, Translations, SpeechPhrasing } from './locales';

export {
	SUPPORTED_LOCALES,
	DEFAULT_LOCALE,
	LOCALE_META,
	matchBrowserLocale,
	isSupportedLocale
} from './locales';
export type { Locale, LocaleMeta, Translations, SpeechPhrasing } from './locales';

const TRANSLATIONS: Record<Locale, Translations> = {
	'en-CA': enCA,
	'fr-CA': frCA,
	'fr-FR': frFR,
	'zh-CN': zhCN,
	'gu-IN': guIN
};

const SPEECH: Record<Locale, SpeechPhrasing> = {
	'en-CA': enCASpeech,
	'fr-CA': frCASpeech,
	'fr-FR': frFRSpeech,
	'zh-CN': zhCNSpeech,
	'gu-IN': guINSpeech
};

export const locale = derived(settingsStore, ($settings) => $settings.locale);

export const translations = derived(
	locale,
	($locale) => TRANSLATIONS[$locale] ?? TRANSLATIONS['en-CA']
);

export const speechPhrasing = derived(locale, ($locale) => SPEECH[$locale] ?? SPEECH['en-CA']);

function lookup(obj: unknown, path: string): string {
	const value = path.split('.').reduce<unknown>((acc, part) => {
		if (acc && typeof acc === 'object' && part in acc) {
			return (acc as Record<string, unknown>)[part];
		}
		return undefined;
	}, obj);
	return typeof value === 'string' ? value : path;
}

/** Derived translator function store: `$t('nav.home')`. Dotted-path lookup, e.g. `'nav.home'`. */
export const t = derived(translations, ($translations) => {
	return (key: string): string => lookup($translations, key);
});
