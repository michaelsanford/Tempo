import type { LevelId } from './progress';
import type { Locale } from '$lib/i18n/locales';

export type ParentGateType = 'holdButton' | 'mathChallenge';
export type ThemeMode = 'dark' | 'light';

export interface Settings {
	schemaVersion: 1;
	narrationEnabled: boolean;
	soundEffectsEnabled: boolean;
	difficultyOverride: LevelId | 'auto';
	parentGateType: ParentGateType;
	locale: Locale;
	theme: ThemeMode;
}
