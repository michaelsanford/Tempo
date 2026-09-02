export type GameMode = 'readClock' | 'matchClock' | 'setClock' | 'howLongUntil';

export type LevelId = 'wholeHour' | 'halfHour' | 'quarterHour' | 'fiveMinute' | 'anyMinute';

export interface LevelMastery {
	level: LevelId;
	correctInARow: number;
	totalCorrect: number;
	totalAttempts: number;
	/** ISO timestamp once the mastery threshold is hit, else null */
	masteredAt: string | null;
}

export interface ModeProgress {
	mode: GameMode;
	currentLevel: LevelId;
	masteryByLevel: Record<LevelId, LevelMastery>;
}

export interface StreakState {
	currentStreakDays: number;
	longestStreakDays: number;
	/** ISO date (YYYY-MM-DD) of the last day played, or null before first play */
	lastPlayedDate: string | null;
}

export interface Badge {
	id: string;
	name: string;
	description: string;
	icon: string;
	earnedAt: string | null;
}

export interface Progress {
	schemaVersion: 1;
	totalStars: number;
	streak: StreakState;
	modes: Record<GameMode, ModeProgress>;
	badges: Badge[];
}
