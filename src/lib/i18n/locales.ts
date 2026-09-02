import type { Time } from '$lib/types/time';

export const SUPPORTED_LOCALES = ['en-CA', 'fr-CA', 'fr-FR'] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en-CA';

export interface LocaleMeta {
	id: Locale;
	name: string;
	region: string;
	flagType: 'canada' | 'quebec' | 'france';
}

export const LOCALE_META: Record<Locale, LocaleMeta> = {
	'en-CA': { id: 'en-CA', name: 'English', region: 'Canada', flagType: 'canada' },
	'fr-CA': { id: 'fr-CA', name: 'Français', region: 'Québec', flagType: 'quebec' },
	'fr-FR': { id: 'fr-FR', name: 'Français', region: 'France', flagType: 'france' }
};

export function isSupportedLocale(value: string): value is Locale {
	return (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

/** Best-effort match of a browser language tag (e.g. "fr-FR", "fr-CA", "fr", "en-CA", "en-US") to a supported locale. */
export function matchBrowserLocale(browserLocale: string | undefined): Locale {
	if (!browserLocale) return DEFAULT_LOCALE;
	if (isSupportedLocale(browserLocale)) return browserLocale;
	const lower = browserLocale.toLowerCase();
	if (lower === 'fr-fr' || lower.startsWith('fr-fr')) return 'fr-FR';
	if (lower.startsWith('fr')) return 'fr-CA';
	if (lower.startsWith('en')) return 'en-CA';
	return DEFAULT_LOCALE;
}

export interface Translations {
	appName: string;
	nav: {
		home: string;
		readClock: string;
		matchClock: string;
		setClock: string;
		howLongUntil: string;
		explore: string;
		leaveBy: string;
		progress: string;
		settings: string;
	};
	game: {
		correct: string;
		tryAgain: string;
		submit: string;
		next: string;
		levelUp: string;
		pickTheClock: string;
		setTheClock: string;
		howManyMinutesUntil: string;
	};
	explore: {
		title: string;
		speakButton: string;
		nowButton: string;
		hourBack: string;
		hourForward: string;
	};
	leaveBy: {
		title: string;
		noEvents: string;
		timeToGo: string;
		overdueMessage: string;
	};
	progress: {
		title: string;
		totalStars: string;
		currentStreak: string;
		longestStreak: string;
		badgesEarned: string;
		level: string;
	};
	settings: {
		title: string;
		holdToEnter: string;
		narration: string;
		soundEffects: string;
		difficultyOverride: string;
		difficultyAuto: string;
		theme: string;
		themeDark: string;
		themeLight: string;
		language: string;
		routines: string;
		addRoutine: string;
		resetProgress: string;
		resetConfirm: string;
		routineLabel: string;
		routineLeaveBy: string;
		routineDays: string;
		save: string;
		cancel: string;
		delete: string;
	};
	levels: Record<import('$lib/types/progress').LevelId, string>;
	days: Record<import('$lib/types/routine').Weekday, string>;
}

export interface SpeechPhrasing {
	/** Speak a time using familiar 12h clock words, no AM/PM (e.g. "three thirty"). */
	speakTimePhrase(time: Time): string;
	speakFeedback(correct: boolean): string;
	speechLangTag: string;
}
