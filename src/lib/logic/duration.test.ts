import { describe, it, expect } from 'vitest';
import { addMinutes, formatDuration, minutesBetween } from './duration';

describe('minutesBetween', () => {
	it('computes a same-day difference', () => {
		expect(minutesBetween({ hour: 3, minute: 0 }, { hour: 3, minute: 45 })).toBe(45);
	});

	it('wraps forward across midnight', () => {
		expect(minutesBetween({ hour: 23, minute: 30 }, { hour: 0, minute: 15 })).toBe(45);
	});

	it('returns 0 for equal times', () => {
		expect(minutesBetween({ hour: 5, minute: 0 }, { hour: 5, minute: 0 })).toBe(0);
	});
});

describe('addMinutes', () => {
	it('rolls over past midnight', () => {
		expect(addMinutes({ hour: 23, minute: 45 }, 30)).toEqual({ hour: 0, minute: 15 });
	});

	it('rolls backward before midnight with negative minutes', () => {
		expect(addMinutes({ hour: 0, minute: 15 }, -30)).toEqual({ hour: 23, minute: 45 });
	});
});

describe('formatDuration', () => {
	it('formats minutes only', () => {
		expect(formatDuration(45)).toBe('45 min');
	});

	it('formats whole hours', () => {
		expect(formatDuration(120)).toBe('2 h');
	});

	it('formats hours and minutes', () => {
		expect(formatDuration(75)).toBe('1 h 15 min');
	});
});
