import type {
	Badge,
	GameMode,
	LevelId,
	ModeProgress,
	Progress,
	StreakState
} from '$lib/types/progress';
import { isMastered, nextLevel, LEVELS } from './levels';

const GAME_MODES: GameMode[] = ['readClock', 'matchClock', 'setClock', 'howLongUntil'];

function emptyMastery(level: LevelId) {
	return { level, correctInARow: 0, totalCorrect: 0, totalAttempts: 0, masteredAt: null };
}

export function createInitialProgress(): Progress {
	const modes = {} as Progress['modes'];
	for (const mode of GAME_MODES) {
		const masteryByLevel = {} as ModeProgress['masteryByLevel'];
		for (const level of LEVELS) {
			masteryByLevel[level] = emptyMastery(level);
		}
		modes[mode] = { mode, currentLevel: LEVELS[0], masteryByLevel };
	}
	return {
		schemaVersion: 1,
		totalStars: 0,
		streak: { currentStreakDays: 0, longestStreakDays: 0, lastPlayedDate: null },
		modes,
		badges: []
	};
}

export interface BadgeDefinition {
	id: string;
	name: string;
	description: string;
	icon: string;
	isEarned(progress: Progress): boolean;
}

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
	{
		id: 'first-star',
		name: 'First Star',
		description: 'Earn your first star',
		icon: 'star',
		isEarned: (p) => p.totalStars >= 1
	},
	{
		id: 'ten-stars',
		name: 'Star Collector',
		description: 'Earn 10 stars',
		icon: 'star',
		isEarned: (p) => p.totalStars >= 10
	},
	{
		id: 'fifty-stars',
		name: 'Star Champion',
		description: 'Earn 50 stars',
		icon: 'star',
		isEarned: (p) => p.totalStars >= 50
	},
	{
		id: 'streak-3',
		name: 'On a Roll',
		description: 'Play 3 days in a row',
		icon: 'streak',
		isEarned: (p) => p.streak.longestStreakDays >= 3
	},
	{
		id: 'streak-7',
		name: 'Week Streak',
		description: 'Play 7 days in a row',
		icon: 'streak',
		isEarned: (p) => p.streak.longestStreakDays >= 7
	},
	{
		id: 'read-clock-quarter-hour',
		name: 'Quarter Hour Master',
		description: 'Master quarter hours in Read the Clock',
		icon: 'clock',
		isEarned: (p) => p.modes.readClock.masteryByLevel.quarterHour.masteredAt !== null
	},
	{
		id: 'set-clock-any-minute',
		name: 'Clock Setter',
		description: 'Master any minute in Set the Clock',
		icon: 'clock',
		isEarned: (p) => p.modes.setClock.masteryByLevel.anyMinute.masteredAt !== null
	},
	{
		id: 'all-modes-half-hour',
		name: 'Half Hour Hero',
		description: 'Master half hours in every game',
		icon: 'trophy',
		isEarned: (p) =>
			GAME_MODES.every((mode) => p.modes[mode]?.masteryByLevel?.halfHour?.masteredAt !== null)
	}
];

export function evaluateBadges(
	progress: Progress,
	now: string = new Date().toISOString()
): Badge[] {
	const earnedIds = new Set(progress.badges.map((b) => b.id));
	const newlyEarned: Badge[] = [];
	for (const def of BADGE_DEFINITIONS) {
		if (!earnedIds.has(def.id) && def.isEarned(progress)) {
			newlyEarned.push({
				id: def.id,
				name: def.name,
				description: def.description,
				icon: def.icon,
				earnedAt: now
			});
		}
	}
	return newlyEarned;
}

export function updateStreak(streak: StreakState, todayIso: string): StreakState {
	if (streak.lastPlayedDate === todayIso) return streak;

	const yesterday = new Date(todayIso);
	yesterday.setDate(yesterday.getDate() - 1);
	const yesterdayIso = yesterday.toISOString().slice(0, 10);

	const currentStreakDays =
		streak.lastPlayedDate === yesterdayIso ? streak.currentStreakDays + 1 : 1;

	return {
		currentStreakDays,
		longestStreakDays: Math.max(streak.longestStreakDays, currentStreakDays),
		lastPlayedDate: todayIso
	};
}

export function recordAttempt(
	progress: Progress,
	mode: GameMode,
	level: LevelId,
	correct: boolean,
	now: string = new Date().toISOString()
): Progress {
	const modeProgress = progress.modes[mode];
	const mastery = modeProgress.masteryByLevel[level];

	const updatedMastery = {
		...mastery,
		correctInARow: correct ? mastery.correctInARow + 1 : 0,
		totalCorrect: mastery.totalCorrect + (correct ? 1 : 0),
		totalAttempts: mastery.totalAttempts + 1
	};

	const justMastered =
		updatedMastery.masteredAt === null &&
		isMastered(updatedMastery.correctInARow, updatedMastery.totalAttempts);
	if (justMastered) updatedMastery.masteredAt = now;

	const updatedModeProgress: ModeProgress = {
		...modeProgress,
		currentLevel: justMastered ? nextLevel(level) : modeProgress.currentLevel,
		masteryByLevel: { ...modeProgress.masteryByLevel, [level]: updatedMastery }
	};

	const todayIso = now.slice(0, 10);
	const streak = correct ? updateStreak(progress.streak, todayIso) : progress.streak;

	const updatedProgress: Progress = {
		...progress,
		totalStars: progress.totalStars + (correct ? 1 : 0),
		streak,
		modes: { ...progress.modes, [mode]: updatedModeProgress }
	};

	const newlyEarned = evaluateBadges(updatedProgress, now);
	if (newlyEarned.length === 0) return updatedProgress;

	return { ...updatedProgress, badges: [...updatedProgress.badges, ...newlyEarned] };
}
