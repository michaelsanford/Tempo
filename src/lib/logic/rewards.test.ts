import { describe, it, expect } from 'vitest';
import { createInitialProgress, evaluateBadges, recordAttempt, updateStreak } from './rewards';
import { MASTERY_MIN_ATTEMPTS, MASTERY_STREAK } from './levels';

describe('recordAttempt', () => {
	it('increments stars and mastery on a correct answer', () => {
		const progress = createInitialProgress();
		const updated = recordAttempt(
			progress,
			'readClock',
			'wholeHour',
			true,
			'2026-01-01T10:00:00.000Z'
		);
		expect(updated.totalStars).toBe(1);
		expect(updated.modes.readClock.masteryByLevel.wholeHour.correctInARow).toBe(1);
	});

	it('resets the streak-in-a-row on a wrong answer without demoting the level', () => {
		let progress = createInitialProgress();
		progress = recordAttempt(progress, 'readClock', 'wholeHour', true, '2026-01-01T10:00:00.000Z');
		progress = recordAttempt(progress, 'readClock', 'wholeHour', false, '2026-01-01T10:01:00.000Z');
		expect(progress.modes.readClock.masteryByLevel.wholeHour.correctInARow).toBe(0);
		expect(progress.modes.readClock.currentLevel).toBe('wholeHour');
		expect(progress.totalStars).toBe(1);
	});

	it('advances the level after reaching the mastery streak and minimum attempts', () => {
		let progress = createInitialProgress();
		const extraAttempts = MASTERY_MIN_ATTEMPTS - MASTERY_STREAK;
		for (let i = 0; i < extraAttempts; i++) {
			progress = recordAttempt(
				progress,
				'setClock',
				'wholeHour',
				false,
				'2026-01-01T09:00:00.000Z'
			);
		}
		for (let i = 0; i < MASTERY_STREAK; i++) {
			progress = recordAttempt(progress, 'setClock', 'wholeHour', true, '2026-01-01T09:30:00.000Z');
		}
		expect(progress.modes.setClock.currentLevel).toBe('halfHour');
		expect(progress.modes.setClock.masteryByLevel.wholeHour.masteredAt).not.toBeNull();
	});

	it('keeps each game mode progressing independently', () => {
		let progress = createInitialProgress();
		progress = recordAttempt(progress, 'readClock', 'wholeHour', true, '2026-01-01T10:00:00.000Z');
		expect(progress.modes.setClock.masteryByLevel.wholeHour.correctInARow).toBe(0);
	});
});

describe('updateStreak', () => {
	it('starts a streak at 1 on first play', () => {
		const streak = { currentStreakDays: 0, longestStreakDays: 0, lastPlayedDate: null };
		const updated = updateStreak(streak, '2026-01-01');
		expect(updated.currentStreakDays).toBe(1);
	});

	it('increments on a consecutive day', () => {
		const streak = { currentStreakDays: 1, longestStreakDays: 1, lastPlayedDate: '2026-01-01' };
		const updated = updateStreak(streak, '2026-01-02');
		expect(updated.currentStreakDays).toBe(2);
		expect(updated.longestStreakDays).toBe(2);
	});

	it('resets on a gap day', () => {
		const streak = { currentStreakDays: 5, longestStreakDays: 5, lastPlayedDate: '2026-01-01' };
		const updated = updateStreak(streak, '2026-01-05');
		expect(updated.currentStreakDays).toBe(1);
		expect(updated.longestStreakDays).toBe(5);
	});

	it('is a no-op for the same day', () => {
		const streak = { currentStreakDays: 2, longestStreakDays: 2, lastPlayedDate: '2026-01-01' };
		const updated = updateStreak(streak, '2026-01-01');
		expect(updated).toEqual(streak);
	});
});

describe('evaluateBadges', () => {
	it('awards the first-star badge once a star is earned', () => {
		const progress = createInitialProgress();
		progress.totalStars = 1;
		const newlyEarned = evaluateBadges(progress);
		expect(newlyEarned.map((b) => b.id)).toContain('first-star');
	});

	it('does not re-award an already-earned badge', () => {
		const progress = createInitialProgress();
		progress.totalStars = 1;
		progress.badges = [
			{ id: 'first-star', name: '', description: '', icon: '', earnedAt: '2026-01-01' }
		];
		const newlyEarned = evaluateBadges(progress);
		expect(newlyEarned.map((b) => b.id)).not.toContain('first-star');
	});
});
