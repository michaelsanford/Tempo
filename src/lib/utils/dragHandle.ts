import type { Time } from '$lib/types/time';
import { snapToStep, normalizeTime, angleForTime } from '$lib/logic/time';

/** Hand lengths in the clock SVG's 0-100 viewBox units (the face radius is 48). */
export const HOUR_HAND_LENGTH = 26;
export const MINUTE_HAND_LENGTH = 38;

/** How far past the hour hand's tip a grab must be before it can only mean the minute hand. */
const HOUR_REACH_MARGIN = 6;
/** Angular gap below which two hands count as "equally close" and radius breaks the tie. */
const ANGLE_TIE_DEGREES = 8;

export type HandName = 'hour' | 'minute';

/** Clockwise degrees from the 12 o'clock position, given a pointer offset from the clock center. */
export function angleFromPointer(dx: number, dy: number): number {
	const radians = Math.atan2(dx, -dy);
	const degrees = (radians * 180) / Math.PI;
	return (degrees + 360) % 360;
}

/** Smallest absolute difference between two headings, in degrees (0-180). */
export function angularDistance(a: number, b: number): number {
	const diff = (((a - b) % 360) + 360) % 360;
	return Math.min(diff, 360 - diff);
}

/**
 * Decide which hand a grab was aimed at, from the pointer's angle and its distance from the
 * clock centre (both in viewBox units). Doing this in one place — rather than relying on
 * per-hand hit areas — means overlapping hands stay independently grabbable regardless of
 * SVG paint order.
 */
export function pickHand(
	current: Time,
	pointerAngleDeg: number,
	pointerRadius: number,
	minuteStep: number
): HandName {
	// At whole-hour granularity the minute hand has nowhere to go, so every grab is the hour hand.
	if (minuteStep >= 60) return 'hour';

	const { hourAngle, minuteAngle } = angleForTime(current);
	const hourDistance = angularDistance(pointerAngleDeg, hourAngle);
	const minuteDistance = angularDistance(pointerAngleDeg, minuteAngle);

	// Out past the short hour hand's reach, only the minute hand is plausibly the target.
	if (pointerRadius > HOUR_HAND_LENGTH + HOUR_REACH_MARGIN) return 'minute';

	// Hands overlap (or nearly): a grab close to the centre is more likely aimed at the
	// shorter hour hand, one further out at the minute hand passing over it.
	if (Math.abs(hourDistance - minuteDistance) < ANGLE_TIE_DEGREES) {
		return pointerRadius <= HOUR_HAND_LENGTH * 0.75 ? 'hour' : 'minute';
	}

	return hourDistance < minuteDistance ? 'hour' : 'minute';
}

export function minuteFromAngle(angleDeg: number, minuteStep: number): number {
	const rawMinute = (angleDeg / 360) * 60;
	return snapToStep(rawMinute, minuteStep) % 60;
}

/** 0-11 hour-of-half-day from the hour hand's continuous angle, accounting for minute progression. */
export function hour12FromAngle(angleDeg: number, minute = 0): number {
	const minuteOffset = (minute % 60) * 0.5;
	const adjustedAngle = (((angleDeg - minuteOffset) % 360) + 360) % 360;
	return Math.round(adjustedAngle / 30) % 12;
}

/**
 * Drag the minute hand, coupling the hour hand like a real clock: crossing back past
 * the 12 position rolls the hour forward/backward, preserving which half of the day
 * (0-11 vs 12-23) the current hour is in.
 */
export function dragMinuteHand(current: Time, pointerAngleDeg: number, minuteStep: number): Time {
	const newMinute = minuteFromAngle(pointerAngleDeg, minuteStep);
	const wrappedForward =
		minuteStep === 30
			? current.minute === 30 && newMinute === 0
			: current.minute >= 45 && newMinute <= 15;
	const wrappedBackward = minuteStep === 30 ? false : current.minute <= 15 && newMinute >= 45;
	const hourDelta = wrappedForward ? 1 : wrappedBackward ? -1 : 0;
	return normalizeTime(current.hour + hourDelta, newMinute);
}

/**
 * Drag the hour hand directly, keeping it within the current half of the day
 * (AM/PM-equivalent block). At whole-hour granularity the minute hand follows to :00,
 * since the level only ever asks for times on the hour.
 */
export function dragHourHand(current: Time, pointerAngleDeg: number, minuteStep = 1): Time {
	const minute = minuteStep >= 60 ? 0 : current.minute;
	const newHour12 = hour12FromAngle(pointerAngleDeg, minute);
	const halfDayBase = Math.floor(current.hour / 12) * 12;
	return { hour: halfDayBase + (newHour12 % 12), minute };
}

/** Apply a drag of `hand` to `current`, given the pointer's angle. */
export function dragHand(
	hand: HandName,
	current: Time,
	pointerAngleDeg: number,
	minuteStep: number
): Time {
	return hand === 'minute'
		? dragMinuteHand(current, pointerAngleDeg, minuteStep)
		: dragHourHand(current, pointerAngleDeg, minuteStep);
}
