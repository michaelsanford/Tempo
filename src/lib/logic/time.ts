import type { Time } from '$lib/types/time';

export function timesEqual(a: Time, b: Time): boolean {
	return a.hour === b.hour && a.minute === b.minute;
}

/** Zero-padded 24h "HH:MM", 00-23. Always this format regardless of locale. */
export function formatTime(time: Time): string {
	const hh = String(time.hour).padStart(2, '0');
	const mm = String(time.minute).padStart(2, '0');
	return `${hh}:${mm}`;
}

/**
 * Analogue clock hand angles in degrees (0 = 12 o'clock position, clockwise).
 *
 * The hour hand uses `hour % 12` deliberately: a conventional analogue face has only
 * 12 hour positions, so 15:30 renders identically to 3:30. This is correct behavior,
 * not a bug — do not "fix" it to span 0-23.
 */
export function angleForTime(time: Time): { hourAngle: number; minuteAngle: number } {
	const hour12 = time.hour % 12;
	const minuteAngle = time.minute * 6;
	const hourAngle = hour12 * 30 + time.minute * 0.5;
	return { hourAngle, minuteAngle };
}

export function snapToStep(minute: number, step: number): number {
	return Math.round(minute / step) * step;
}

export function normalizeTime(hour: number, minute: number): Time {
	const totalMinutes = (((hour * 60 + minute) % (24 * 60)) + 24 * 60) % (24 * 60);
	return { hour: Math.floor(totalMinutes / 60), minute: totalMinutes % 60 };
}
