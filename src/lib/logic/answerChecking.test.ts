import { describe, it, expect } from 'vitest';
import { isTimeAnswerCorrect, isDurationAnswerCorrect } from './answerChecking';

describe('isTimeAnswerCorrect', () => {
	it('considers matching times in the same half-day as correct', () => {
		expect(isTimeAnswerCorrect({ hour: 3, minute: 30 }, { hour: 3, minute: 30 })).toBe(true);
		expect(isTimeAnswerCorrect({ hour: 0, minute: 0 }, { hour: 0, minute: 0 })).toBe(true);
		expect(isTimeAnswerCorrect({ hour: 15, minute: 45 }, { hour: 15, minute: 45 })).toBe(true);
	});

	it('considers 12-hour equivalent times across AM/PM as correct on a clock dial', () => {
		expect(isTimeAnswerCorrect({ hour: 3, minute: 30 }, { hour: 15, minute: 30 })).toBe(true);
		expect(isTimeAnswerCorrect({ hour: 15, minute: 30 }, { hour: 3, minute: 30 })).toBe(true);
		expect(isTimeAnswerCorrect({ hour: 0, minute: 0 }, { hour: 12, minute: 0 })).toBe(true);
		expect(isTimeAnswerCorrect({ hour: 12, minute: 0 }, { hour: 0, minute: 0 })).toBe(true);
		expect(isTimeAnswerCorrect({ hour: 23, minute: 45 }, { hour: 11, minute: 45 })).toBe(true);
		expect(isTimeAnswerCorrect({ hour: 13, minute: 15 }, { hour: 1, minute: 15 })).toBe(true);
	});

	it('rejects incorrect times', () => {
		expect(isTimeAnswerCorrect({ hour: 3, minute: 30 }, { hour: 3, minute: 31 })).toBe(false);
		expect(isTimeAnswerCorrect({ hour: 3, minute: 30 }, { hour: 4, minute: 30 })).toBe(false);
		expect(isTimeAnswerCorrect({ hour: 15, minute: 30 }, { hour: 16, minute: 30 })).toBe(false);
		expect(isTimeAnswerCorrect({ hour: 12, minute: 0 }, { hour: 1, minute: 0 })).toBe(false);
	});
});

describe('isDurationAnswerCorrect', () => {
	it('checks exact equality of minutes', () => {
		expect(isDurationAnswerCorrect(30, 30)).toBe(true);
		expect(isDurationAnswerCorrect(15, 30)).toBe(false);
	});
});
