import { describe, it, expect } from 'vitest';
import { isMastered, nextLevel, LEVELS } from './levels';

describe('nextLevel', () => {
	it('advances through the level order', () => {
		expect(nextLevel('wholeHour')).toBe('halfHour');
		expect(nextLevel('halfHour')).toBe('quarterHour');
	});

	it('stays at the final level', () => {
		expect(nextLevel('anyMinute')).toBe('anyMinute');
	});

	it('covers every level exactly once in order', () => {
		expect(LEVELS).toEqual(['wholeHour', 'halfHour', 'quarterHour', 'fiveMinute', 'anyMinute']);
	});
});

describe('isMastered', () => {
	it('requires both the streak and minimum attempts', () => {
		expect(isMastered(8, 10)).toBe(true);
		expect(isMastered(8, 9)).toBe(false);
		expect(isMastered(7, 20)).toBe(false);
	});
});
