/** Small seedable PRNG (mulberry32) so question generation is deterministic in tests. */
export function mulberry32(seed: number): () => number {
	let a = seed;
	return function () {
		a |= 0;
		a = (a + 0x6d2b79f5) | 0;
		let t = Math.imul(a ^ (a >>> 15), 1 | a);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

export type RandomSource = () => number;

export function defaultRandom(): RandomSource {
	return Math.random;
}

export function randomInt(random: RandomSource, min: number, maxExclusive: number): number {
	return min + Math.floor(random() * (maxExclusive - min));
}

export function pick<T>(random: RandomSource, items: readonly T[]): T {
	return items[randomInt(random, 0, items.length)];
}

/** Fisher-Yates shuffle, returns a new array. */
export function shuffle<T>(random: RandomSource, items: readonly T[]): T[] {
	const result = [...items];
	for (let i = result.length - 1; i > 0; i--) {
		const j = randomInt(random, 0, i + 1);
		[result[i], result[j]] = [result[j], result[i]];
	}
	return result;
}
