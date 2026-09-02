import type { Time } from '$lib/types/time';
import { normalizeTime } from './time';

function toMinutes(time: Time): number {
	return time.hour * 60 + time.minute;
}

/** Minutes from `a` to `b`, wrapping forward past midnight if `b` is earlier in the day than `a`. */
export function minutesBetween(a: Time, b: Time): number {
	const diff = toMinutes(b) - toMinutes(a);
	return ((diff % (24 * 60)) + 24 * 60) % (24 * 60);
}

export function addMinutes(time: Time, minutes: number): Time {
	return normalizeTime(time.hour, time.minute + minutes);
}

export function formatDuration(totalMinutes: number): string {
	const hours = Math.floor(totalMinutes / 60);
	const minutes = totalMinutes % 60;
	if (hours === 0) return `${minutes} min`;
	if (minutes === 0) return `${hours} h`;
	return `${hours} h ${minutes} min`;
}
