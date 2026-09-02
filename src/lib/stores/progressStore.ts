import { persistedStore } from './persist';
import { createInitialProgress } from '$lib/logic/rewards';
import type { Progress, GameMode } from '$lib/types/progress';

const GAME_MODES: GameMode[] = ['readClock', 'matchClock', 'setClock', 'howLongUntil'];

function migrateProgress(raw: unknown): Progress {
	const initial = createInitialProgress();
	if (!raw || typeof raw !== 'object') return initial;
	const p = raw as Partial<Progress>;
	const modes = { ...initial.modes, ...(p.modes ?? {}) };
	for (const mode of GAME_MODES) {
		if (!modes[mode]) {
			modes[mode] = initial.modes[mode];
		}
	}
	return {
		schemaVersion: 1,
		totalStars: typeof p.totalStars === 'number' ? p.totalStars : 0,
		streak: p.streak ?? initial.streak,
		modes,
		badges: Array.isArray(p.badges) ? p.badges : []
	};
}

export const progressStore = persistedStore<Progress>(
	'clock.progress.v1',
	createInitialProgress(),
	migrateProgress
);

export function resetProgress(): void {
	progressStore.set(createInitialProgress());
}
