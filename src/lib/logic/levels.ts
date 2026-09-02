import type { LevelId } from '$lib/types/progress';

export const LEVELS: LevelId[] = [
	'wholeHour',
	'halfHour',
	'quarterHour',
	'fiveMinute',
	'anyMinute'
];

export const LEVEL_CONSTRAINTS: Record<LevelId, { minuteStep: number }> = {
	wholeHour: { minuteStep: 60 },
	halfHour: { minuteStep: 30 },
	quarterHour: { minuteStep: 15 },
	fiveMinute: { minuteStep: 5 },
	anyMinute: { minuteStep: 1 }
};

/** Consecutive correct answers required, with a minimum attempt count, before auto-advancing. */
export const MASTERY_STREAK = 8;
export const MASTERY_MIN_ATTEMPTS = 10;

export function nextLevel(level: LevelId): LevelId {
	const index = LEVELS.indexOf(level);
	return index >= 0 && index < LEVELS.length - 1 ? LEVELS[index + 1] : level;
}

export function isMastered(correctInARow: number, totalAttempts: number): boolean {
	return correctInARow >= MASTERY_STREAK && totalAttempts >= MASTERY_MIN_ATTEMPTS;
}

export function effectiveLevel(currentLevel: LevelId, override: LevelId | 'auto'): LevelId {
	return override === 'auto' ? currentLevel : override;
}
