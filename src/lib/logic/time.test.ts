import { describe, it, expect } from 'vitest';
import { angleForTime, formatTime, normalizeTime, snapToStep, timesEqual } from './time';

describe('formatTime', () => {
	it('zero-pads hours and minutes', () => {
		expect(formatTime({ hour: 3, minute: 5 })).toBe('03:05');
		expect(formatTime({ hour: 15, minute: 30 })).toBe('15:30');
		expect(formatTime({ hour: 0, minute: 0 })).toBe('00:00');
		expect(formatTime({ hour: 23, minute: 59 })).toBe('23:59');
	});
});

describe('angleForTime', () => {
	it('renders 24h-equivalent times identically on the analogue face', () => {
		expect(angleForTime({ hour: 15, minute: 30 })).toEqual(angleForTime({ hour: 3, minute: 30 }));
		expect(angleForTime({ hour: 0, minute: 0 })).toEqual(angleForTime({ hour: 12, minute: 0 }));
	});

	it('computes minute hand angle at 6 degrees per minute', () => {
		expect(angleForTime({ hour: 0, minute: 15 }).minuteAngle).toBe(90);
		expect(angleForTime({ hour: 0, minute: 30 }).minuteAngle).toBe(180);
	});

	it('moves the hour hand proportionally with the minute', () => {
		expect(angleForTime({ hour: 3, minute: 0 }).hourAngle).toBe(90);
		expect(angleForTime({ hour: 3, minute: 30 }).hourAngle).toBe(105);
	});
});

describe('snapToStep', () => {
	it('snaps to the nearest step', () => {
		expect(snapToStep(7, 5)).toBe(5);
		expect(snapToStep(8, 5)).toBe(10);
		expect(snapToStep(22, 15)).toBe(15);
	});
});

describe('normalizeTime', () => {
	it('wraps minutes and hours past midnight', () => {
		expect(normalizeTime(23, 90)).toEqual({ hour: 0, minute: 30 });
		expect(normalizeTime(-1, 0)).toEqual({ hour: 23, minute: 0 });
		expect(normalizeTime(25, 0)).toEqual({ hour: 1, minute: 0 });
	});
});

describe('timesEqual', () => {
	it('compares hour and minute', () => {
		expect(timesEqual({ hour: 3, minute: 30 }, { hour: 3, minute: 30 })).toBe(true);
		expect(timesEqual({ hour: 3, minute: 30 }, { hour: 3, minute: 31 })).toBe(false);
	});
});
