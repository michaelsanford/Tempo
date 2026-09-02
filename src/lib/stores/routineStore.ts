import { persistedStore } from './persist';
import type { RoutineEvent } from '$lib/types/routine';

export const routineStore = persistedStore<RoutineEvent[]>('clock.routines.v1', []);

export function addRoutine(event: RoutineEvent): void {
	routineStore.update((events) => [...events, event]);
}

export function updateRoutine(id: string, patch: Partial<RoutineEvent>): void {
	routineStore.update((events) => events.map((e) => (e.id === id ? { ...e, ...patch } : e)));
}

export function deleteRoutine(id: string): void {
	routineStore.update((events) => events.filter((e) => e.id !== id));
}

export function createRoutineId(): string {
	return crypto.randomUUID();
}
