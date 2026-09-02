import { describe, it, expect } from 'vitest';
import { mulberry32 } from './randomSeed';
import {
	durationOptionsForLevel,
	generateDurationQuestion,
	generateReadClockQuestion,
	generateSetClockQuestion
} from './questionGenerators';
import { minutesBetween } from './duration';

describe('generateReadClockQuestion', () => {
	it('produces 4 unique choices including the correct one, snapped to the level step', () => {
		const random = mulberry32(42);
		const question = generateReadClockQuestion('quarterHour', 'analogToDigital', random);
		expect(question.choices).toHaveLength(4);
		expect(question.choices[question.correctChoiceIndex]).toEqual(question.targetTime);
		expect(question.targetTime.minute % 15).toBe(0);
		const keys = new Set(question.choices.map((c) => `${c.hour}:${c.minute}`));
		expect(keys.size).toBe(4);
	});

	it('snaps whole-hour level questions to minute 0', () => {
		const random = mulberry32(7);
		const question = generateReadClockQuestion('wholeHour', 'digitalToAnalog', random);
		expect(question.targetTime.minute).toBe(0);
		for (const choice of question.choices) {
			expect(choice.minute).toBe(0);
		}
	});
});

describe('generateSetClockQuestion', () => {
	it('snaps the target time to the level step', () => {
		const random = mulberry32(3);
		const question = generateSetClockQuestion('fiveMinute', random);
		expect(question.targetTime.minute % 5).toBe(0);
	});

	it('never starts the hands already on the answer', () => {
		for (let seed = 0; seed < 100; seed++) {
			const question = generateSetClockQuestion('wholeHour', mulberry32(seed));
			expect(question.startingTime).not.toEqual(question.targetTime);
		}
	});

	it('snaps the starting hands to the level step too', () => {
		const question = generateSetClockQuestion('quarterHour', mulberry32(5));
		expect(question.startingTime.minute % 15).toBe(0);
	});
});

describe('generateDurationQuestion', () => {
	it('the correct choice matches the actual minutes between start and target', () => {
		const random = mulberry32(11);
		const question = generateDurationQuestion('halfHour', random);
		const actual = minutesBetween(question.startTime, question.targetTime);
		expect(question.choices[question.correctChoiceIndex]).toBe(actual);
		// Easy levels have only three distinct slices to offer, which is plenty of choice
		// for a 4-year-old; finer levels fill out to four.
		expect(question.choices.length).toBeGreaterThanOrEqual(3);
		expect(question.choices.length).toBeLessThanOrEqual(4);
	});

	// Every choice is drawn as a pie wedge, so a duration of an hour or more would render
	// as a full (or ambiguous) circle and stop being comparable by eye.
	it('keeps every choice under an hour so each wedge is one readable slice', () => {
		for (const level of [
			'wholeHour',
			'halfHour',
			'quarterHour',
			'fiveMinute',
			'anyMinute'
		] as const) {
			for (let seed = 0; seed < 25; seed++) {
				const question = generateDurationQuestion(level, mulberry32(seed));
				for (const minutes of question.choices) {
					expect(minutes).toBeGreaterThan(0);
					expect(minutes).toBeLessThan(60);
				}
			}
		}
	});

	it('uses coarse quarter-hour slices at the easiest levels', () => {
		for (let seed = 0; seed < 25; seed++) {
			const question = generateDurationQuestion('wholeHour', mulberry32(seed));
			for (const minutes of question.choices) {
				expect(minutes % 15).toBe(0);
			}
		}
	});

	it('offers four distinct choices once the option pool is big enough', () => {
		for (let seed = 0; seed < 25; seed++) {
			const question = generateDurationQuestion('fiveMinute', mulberry32(seed));
			expect(new Set(question.choices).size).toBe(4);
		}
	});

	it('offers three distinct choices on the easiest levels', () => {
		for (let seed = 0; seed < 25; seed++) {
			const question = generateDurationQuestion('wholeHour', mulberry32(seed));
			expect(new Set(question.choices).size).toBe(3);
		}
	});
});

describe('durationOptionsForLevel', () => {
	it('gives big obvious slices on the easy levels and finer ones later', () => {
		expect(durationOptionsForLevel('wholeHour')).toEqual([15, 30, 45]);
		expect(durationOptionsForLevel('fiveMinute')).toContain(5);
		expect(durationOptionsForLevel('fiveMinute').every((m) => m < 60)).toBe(true);
	});
});
