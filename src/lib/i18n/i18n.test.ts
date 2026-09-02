import { describe, it, expect } from 'vitest';
import {
	SUPPORTED_LOCALES,
	DEFAULT_LOCALE,
	LOCALE_META,
	matchBrowserLocale,
	isSupportedLocale,
	type Locale,
	type Translations,
	type SpeechPhrasing
} from './locales';
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

/** Every leaf key in an object, as dotted paths, sorted. */
function leafKeys(obj: unknown, prefix = ''): string[] {
	if (obj === null || typeof obj !== 'object') return [prefix];
	return Object.entries(obj as Record<string, unknown>)
		.flatMap(([k, v]) => leafKeys(v, prefix ? `${prefix}.${k}` : k))
		.sort();
}

/** Every hour/minute combination shown on a 12-hour face. */
const ALL_TIMES = Array.from({ length: 12 }, (_, h) =>
	Array.from({ length: 60 }, (_, m) => ({ hour: h === 0 ? 12 : h, minute: m }))
).flat();

describe('locale registry', () => {
	it('ships translations and speech for every supported locale', () => {
		for (const loc of SUPPORTED_LOCALES) {
			expect(TRANSLATIONS[loc], `translations for ${loc}`).toBeDefined();
			expect(SPEECH[loc], `speech for ${loc}`).toBeDefined();
			expect(LOCALE_META[loc], `metadata for ${loc}`).toBeDefined();
		}
	});

	it('gives every locale a self-consistent metadata entry', () => {
		for (const loc of SUPPORTED_LOCALES) {
			const meta = LOCALE_META[loc];
			expect(meta.id).toBe(loc);
			expect(meta.name.length).toBeGreaterThan(0);
			expect(meta.region.length).toBeGreaterThan(0);
		}
	});

	it('tags speech with the locale it belongs to', () => {
		for (const loc of SUPPORTED_LOCALES) {
			expect(SPEECH[loc].speechLangTag).toBe(loc);
		}
	});

	it('includes the default locale in the supported set', () => {
		expect(isSupportedLocale(DEFAULT_LOCALE)).toBe(true);
	});
});

describe('translation completeness', () => {
	const expected = leafKeys(enCA);

	for (const loc of SUPPORTED_LOCALES) {
		it(`${loc} has exactly the same keys as en-CA`, () => {
			expect(leafKeys(TRANSLATIONS[loc])).toEqual(expected);
		});

		it(`${loc} has no empty strings`, () => {
			const empties = leafKeys(TRANSLATIONS[loc]).filter((path) => {
				const value = path
					.split('.')
					.reduce<unknown>(
						(acc, part) => (acc as Record<string, unknown>)?.[part],
						TRANSLATIONS[loc]
					);
				return typeof value !== 'string' || value.trim() === '';
			});
			expect(empties).toEqual([]);
		});
	}
});

describe('speakTimePhrase', () => {
	for (const loc of SUPPORTED_LOCALES) {
		it(`${loc} produces a phrase for all 720 clock times`, () => {
			for (const time of ALL_TIMES) {
				const phrase = SPEECH[loc].speakTimePhrase(time);
				expect(phrase, `${loc} at ${time.hour}:${time.minute}`).toBeTruthy();
				// A gap in a number-word table surfaces as "undefined" inside the phrase.
				expect(phrase).not.toContain('undefined');
			}
		});
	}

	it('speaks Mandarin hours and minutes idiomatically', () => {
		const say = zhCNSpeech.speakTimePhrase;
		// Two o'clock is 两点, never 二点.
		expect(say({ hour: 2, minute: 0 })).toBe('两点整');
		expect(say({ hour: 12, minute: 0 })).toBe('十二点整');
		// Minutes below ten take a spoken 零.
		expect(say({ hour: 3, minute: 5 })).toBe('三点零五分');
		expect(say({ hour: 3, minute: 15 })).toBe('三点十五分');
		expect(say({ hour: 3, minute: 30 })).toBe('三点三十分');
		expect(say({ hour: 10, minute: 59 })).toBe('十点五十九分');
	});

	it('speaks Gujarati hours with the right verb form', () => {
		const say = guINSpeech.speakTimePhrase;
		// One o'clock takes the singular વાગ્યો, other hours the plural વાગ્યા.
		expect(say({ hour: 1, minute: 0 })).toBe('એક વાગ્યો');
		expect(say({ hour: 3, minute: 0 })).toBe('ત્રણ વાગ્યા');
		expect(say({ hour: 12, minute: 0 })).toBe('બાર વાગ્યા');
		expect(say({ hour: 3, minute: 15 })).toBe('ત્રણ વાગીને પંદર મિનિટ');
	});
});

describe('matchBrowserLocale', () => {
	it.each([
		['zh', 'zh-CN'],
		['zh-CN', 'zh-CN'],
		['zh-Hans', 'zh-CN'],
		['zh-TW', 'zh-CN'],
		['gu', 'gu-IN'],
		['gu-IN', 'gu-IN'],
		['en-US', 'en-CA'],
		['fr-FR', 'fr-FR'],
		['fr-BE', 'fr-CA']
	])('maps %s to %s', (input, expected) => {
		expect(matchBrowserLocale(input)).toBe(expected);
	});

	it('falls back to the default for unknown and missing tags', () => {
		expect(matchBrowserLocale('de-DE')).toBe(DEFAULT_LOCALE);
		expect(matchBrowserLocale(undefined)).toBe(DEFAULT_LOCALE);
	});
});
