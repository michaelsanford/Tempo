import type { Time } from '$lib/types/time';
import type { LevelId } from '$lib/types/progress';
import { LEVEL_CONSTRAINTS } from './levels';
import { addMinutes, minutesBetween } from './duration';
import { timesEqual } from './time';
import { defaultRandom, pick, randomInt, shuffle, type RandomSource } from './randomSeed';

export type ReadClockDirection = 'analogToDigital' | 'digitalToAnalog';

export interface ReadClockQuestion {
	direction: ReadClockDirection;
	targetTime: Time;
	choices: Time[];
	correctChoiceIndex: number;
}

export interface SetClockQuestion {
	targetTime: Time;
	/** Where the hands start out — never already on the target, so there is always something to do. */
	startingTime: Time;
}

export interface DurationQuestion {
	startTime: Time;
	targetTime: Time;
	/** Candidate durations in minutes, always under an hour so each renders as one clean wedge. */
	choices: number[];
	correctChoiceIndex: number;
}

/**
 * Durations are deliberately coarser than the level's clock-reading granularity: the answer is
 * a pie wedge to compare by eye, so low levels get big quarter-circle slices rather than a
 * literal `minuteStep` sweep (a whole-hour step would be a full, unreadable circle).
 */
const DURATION_CONSTRAINTS: Record<LevelId, { step: number; maxMinutes: number }> = {
	wholeHour: { step: 15, maxMinutes: 45 },
	halfHour: { step: 15, maxMinutes: 45 },
	quarterHour: { step: 15, maxMinutes: 45 },
	fiveMinute: { step: 5, maxMinutes: 55 },
	anyMinute: { step: 5, maxMinutes: 55 }
};

export function durationOptionsForLevel(level: LevelId): number[] {
	const { step, maxMinutes } = DURATION_CONSTRAINTS[level];
	const options: number[] = [];
	for (let minutes = step; minutes <= maxMinutes; minutes += step) options.push(minutes);
	return options;
}

function randomTimeForLevel(level: LevelId, random: RandomSource): Time {
	const { minuteStep } = LEVEL_CONSTRAINTS[level];
	const hour = randomInt(random, 0, 24);
	const stepsPerHour = 60 / minuteStep;
	const minute = randomInt(random, 0, stepsPerHour) * minuteStep;
	return { hour, minute: minute % 60 };
}

function distractorTimes(
	target: Time,
	level: LevelId,
	count: number,
	random: RandomSource
): Time[] {
	const { minuteStep } = LEVEL_CONSTRAINTS[level];
	const distractors: Time[] = [];
	const seen = new Set([`${target.hour}:${target.minute}`]);
	let guard = 0;
	while (distractors.length < count && guard < 50) {
		guard++;
		const offsetSteps = randomInt(random, -3, 4) || 1;
		const candidate = addMinutes(target, offsetSteps * minuteStep);
		const key = `${candidate.hour}:${candidate.minute}`;
		if (!seen.has(key)) {
			seen.add(key);
			distractors.push(candidate);
		}
	}
	return distractors;
}

export function generateReadClockQuestion(
	level: LevelId,
	direction: ReadClockDirection,
	random: RandomSource = defaultRandom()
): ReadClockQuestion {
	const targetTime = randomTimeForLevel(level, random);
	const distractors = distractorTimes(targetTime, level, 3, random);
	const choices = shuffle(random, [targetTime, ...distractors]);
	const correctChoiceIndex = choices.findIndex((choice) => timesEqual(choice, targetTime));
	return { direction, targetTime, choices, correctChoiceIndex };
}

export function generateSetClockQuestion(
	level: LevelId,
	random: RandomSource = defaultRandom()
): SetClockQuestion {
	const targetTime = randomTimeForLevel(level, random);
	let startingTime = randomTimeForLevel(level, random);
	let guard = 0;
	while (timesEqual(startingTime, targetTime) && guard < 20) {
		guard++;
		startingTime = randomTimeForLevel(level, random);
	}
	if (timesEqual(startingTime, targetTime)) {
		startingTime = addMinutes(targetTime, LEVEL_CONSTRAINTS[level].minuteStep);
	}
	return { targetTime, startingTime };
}

export function generateDurationQuestion(
	level: LevelId,
	random: RandomSource = defaultRandom()
): DurationQuestion {
	const options = durationOptionsForLevel(level);
	const actualMinutes = pick(random, options);

	// Start on a tidy position for the duration's own step, so the target lands somewhere
	// equally readable (e.g. start at :00 with a 15-minute answer puts the target on :15).
	const { step } = DURATION_CONSTRAINTS[level];
	const stepsPerHour = 60 / step;
	const startTime: Time = {
		hour: randomInt(random, 0, 24),
		minute: (randomInt(random, 0, stepsPerHour) * step) % 60
	};
	const targetTime = addMinutes(startTime, actualMinutes);

	const distractors = shuffle(
		random,
		options.filter((value) => value !== actualMinutes)
	).slice(0, 3);

	const choiceValues = shuffle(random, [actualMinutes, ...distractors]);
	const correctChoiceIndex = choiceValues.indexOf(actualMinutes);

	return { startTime, targetTime, choices: choiceValues, correctChoiceIndex };
}

export function verifyMinutesBetween(startTime: Time, targetTime: Time): number {
	return minutesBetween(startTime, targetTime);
}
