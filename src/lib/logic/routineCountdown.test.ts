import { describe, it, expect } from 'vitest';
import { isOverdue, msRemaining, nextOccurrence } from './routineCountdown';
import type { RoutineEvent } from '$lib/types/routine';

function makeEvent(overrides: Partial<RoutineEvent> = {}): RoutineEvent {
	return {
		id: '1',
		label: 'Leave for school',
		leaveBy: { hour: 8, minute: 0 },
		activeDays: [1, 2, 3, 4, 5],
		enabled: true,
		createdAt: '2026-01-01T00:00:00.000Z',
		...overrides
	};
}

describe('nextOccurrence', () => {
	it('returns null for a disabled event', () => {
		const event = makeEvent({ enabled: false });
		expect(nextOccurrence(event, new Date('2026-01-05T07:00:00'))).toBeNull();
	});

	it('returns null when there are no active days', () => {
		const event = makeEvent({ activeDays: [] });
		expect(nextOccurrence(event, new Date('2026-01-05T07:00:00'))).toBeNull();
	});

	it('returns today if the leave time has not passed and today is active', () => {
		// 2026-01-05 is a Monday
		const event = makeEvent();
		const now = new Date('2026-01-05T07:00:00');
		const next = nextOccurrence(event, now);
		expect(next?.toDateString()).toBe(now.toDateString());
		expect(next?.getHours()).toBe(8);
	});

	it('skips to the next active day if today has already passed', () => {
		const event = makeEvent();
		const now = new Date('2026-01-05T09:00:00'); // Monday, past 8am
		const next = nextOccurrence(event, now);
		expect(next?.getDay()).toBe(2); // Tuesday
	});

	it('skips inactive days entirely', () => {
		const event = makeEvent({ activeDays: [1] }); // Monday only
		const now = new Date('2026-01-05T09:00:00'); // Monday, past 8am
		const next = nextOccurrence(event, now);
		expect(next?.getDay()).toBe(1); // next Monday
		expect(next && next.getTime() > now.getTime()).toBe(true);
	});
});

describe('msRemaining / isOverdue', () => {
	it('is positive before the deadline and overdue after', () => {
		const now = new Date('2026-01-05T07:59:00');
		const target = new Date('2026-01-05T08:00:00');
		expect(msRemaining(target, now)).toBe(60_000);
		expect(isOverdue(target, now)).toBe(false);
		expect(isOverdue(target, new Date('2026-01-05T08:00:01'))).toBe(true);
	});
});
