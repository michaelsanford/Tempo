import { describe, it, expect } from 'vitest';
import {
	angleFromPointer,
	angularDistance,
	dragHand,
	dragHourHand,
	dragMinuteHand,
	hour12FromAngle,
	minuteFromAngle,
	pickHand,
	HOUR_HAND_LENGTH
} from './dragHandle';
import { angleForTime } from '$lib/logic/time';

describe('angleFromPointer', () => {
	it('maps straight up to 0 degrees and goes clockwise', () => {
		expect(angleFromPointer(0, -10)).toBe(0);
		expect(angleFromPointer(10, 0)).toBe(90);
		expect(angleFromPointer(0, 10)).toBe(180);
		expect(angleFromPointer(-10, 0)).toBe(270);
	});
});

describe('angularDistance', () => {
	it('takes the shorter way around the circle', () => {
		expect(angularDistance(10, 350)).toBe(20);
		expect(angularDistance(350, 10)).toBe(20);
		expect(angularDistance(0, 180)).toBe(180);
	});
});

describe('pickHand', () => {
	// The bug this guards: at whole-hour granularity the minute hand cannot move, so a
	// grab must never be routed to it or the clock appears frozen.
	it('always picks the hour hand when the minute step is a whole hour', () => {
		const time = { hour: 0, minute: 0 };
		for (const angle of [0, 45, 90, 180, 270, 359]) {
			for (const radius of [5, 20, 30, 45]) {
				expect(pickHand(time, angle, radius, 60)).toBe('hour');
			}
		}
	});

	it('picks the minute hand out past the hour hand’s reach', () => {
		const time = { hour: 3, minute: 0 };
		// Straight up is where neither hand points; radius decides.
		expect(pickHand(time, 0, 45, 5)).toBe('minute');
	});

	it('picks the hand whose angle is closest when both are in reach', () => {
		const time = { hour: 3, minute: 0 }; // hour hand ~90deg, minute hand at 0deg
		const { hourAngle, minuteAngle } = angleForTime(time);
		expect(hourAngle).toBe(90);
		expect(minuteAngle).toBe(0);
		expect(pickHand(time, 88, 20, 5)).toBe('hour');
		expect(pickHand(time, 2, 20, 5)).toBe('minute');
	});

	it('breaks an overlap tie by distance from the centre', () => {
		// At 12:00 both hands point straight up, so angle alone cannot separate them.
		const time = { hour: 12, minute: 0 };
		expect(pickHand(time, 0, HOUR_HAND_LENGTH * 0.5, 5)).toBe('hour');
		expect(pickHand(time, 0, HOUR_HAND_LENGTH * 0.9, 5)).toBe('minute');
	});
});

describe('minuteFromAngle', () => {
	it('snaps to the level step', () => {
		expect(minuteFromAngle(0, 15)).toBe(0);
		expect(minuteFromAngle(90, 15)).toBe(15);
		expect(minuteFromAngle(180, 15)).toBe(30);
		expect(minuteFromAngle(100, 15)).toBe(15);
	});

	it('collapses to zero at a whole-hour step, which is why the hour hand must own the drag', () => {
		expect(minuteFromAngle(90, 60)).toBe(0);
		expect(minuteFromAngle(180, 60)).toBe(0);
	});
});

describe('hour12FromAngle', () => {
	it('rounds to the nearest hour position without minute offset', () => {
		expect(hour12FromAngle(0)).toBe(0);
		expect(hour12FromAngle(90)).toBe(3);
		expect(hour12FromAngle(359)).toBe(0);
	});

	it('accounts for minute progression when minute is passed', () => {
		// At 3:30, hour hand is at 105 degrees (90 + 15)
		expect(hour12FromAngle(105, 30)).toBe(3);
		// At 8:45, hour hand is at 262.5 degrees (240 + 22.5)
		expect(hour12FromAngle(262.5, 45)).toBe(8);
		// At 12:30, hour hand is at 15 degrees (0 + 15)
		expect(hour12FromAngle(15, 30)).toBe(0);
		// At 11:30, hour hand is at 345 degrees (330 + 15)
		expect(hour12FromAngle(345, 30)).toBe(11);
	});
});

describe('dragHourHand', () => {
	it('keeps the current half of the day', () => {
		expect(dragHourHand({ hour: 15, minute: 20 }, 10)).toEqual({ hour: 12, minute: 20 });
		expect(dragHourHand({ hour: 3, minute: 20 }, 10)).toEqual({ hour: 0, minute: 20 });
	});

	it('zeroes the minutes at a whole-hour step', () => {
		expect(dragHourHand({ hour: 3, minute: 40 }, 90, 60)).toEqual({ hour: 3, minute: 0 });
	});

	it('leaves the minutes alone at finer steps and accounts for minute position', () => {
		// At 3:40, hour hand angle is 3 * 30 + 40 * 0.5 = 110 deg
		expect(dragHourHand({ hour: 3, minute: 40 }, 110, 5)).toEqual({ hour: 3, minute: 40 });
		// Dragging to 6:30 position (180 + 15 = 195 deg)
		expect(dragHourHand({ hour: 3, minute: 30 }, 195, 5)).toEqual({ hour: 6, minute: 30 });
	});
});

describe('dragMinuteHand', () => {
	it('rolls the hour forward when sweeping past 12', () => {
		expect(dragMinuteHand({ hour: 3, minute: 55 }, 30, 5)).toEqual({ hour: 4, minute: 5 });
	});

	it('rolls the hour back when sweeping backwards past 12', () => {
		expect(dragMinuteHand({ hour: 3, minute: 5 }, 330, 5)).toEqual({ hour: 2, minute: 55 });
	});

	it('rolls the hour forward at half-hour step when moving from 30 to 0', () => {
		expect(dragMinuteHand({ hour: 3, minute: 30 }, 0, 30)).toEqual({ hour: 4, minute: 0 });
	});
});

describe('dragHand', () => {
	it('dispatches to the right hand', () => {
		expect(dragHand('hour', { hour: 3, minute: 30 }, 195, 5)).toEqual({ hour: 6, minute: 30 });
		expect(dragHand('minute', { hour: 3, minute: 30 }, 180, 5)).toEqual({ hour: 3, minute: 30 });
	});
});
