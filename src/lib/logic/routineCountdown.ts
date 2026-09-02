import type { RoutineEvent } from '$lib/types/routine';

/** Next datetime (today or a future active day) matching the event's leaveBy time, or null if disabled/no active days. */
export function nextOccurrence(event: RoutineEvent, now: Date): Date | null {
	if (!event.enabled || event.activeDays.length === 0) return null;

	for (let dayOffset = 0; dayOffset <= 7; dayOffset++) {
		const candidate = new Date(now);
		candidate.setDate(candidate.getDate() + dayOffset);
		candidate.setHours(event.leaveBy.hour, event.leaveBy.minute, 0, 0);

		if (dayOffset === 0 && candidate.getTime() <= now.getTime()) continue;
		if (!event.activeDays.includes(candidate.getDay() as RoutineEvent['activeDays'][number]))
			continue;

		return candidate;
	}
	return null;
}

export function msRemaining(next: Date, now: Date): number {
	return next.getTime() - now.getTime();
}

export function isOverdue(next: Date, now: Date): boolean {
	return msRemaining(next, now) <= 0;
}
