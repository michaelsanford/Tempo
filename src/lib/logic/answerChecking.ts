import type { Time } from '$lib/types/time';
import { timesEqual } from './time';

export function isTimeAnswerCorrect(selected: Time, target: Time): boolean {
	return timesEqual(selected, target);
}

export function isDurationAnswerCorrect(selectedMinutes: number, actualMinutes: number): boolean {
	return selectedMinutes === actualMinutes;
}
