import type { SpeechPhrasing } from '../locales';
import type { Time } from '$lib/types/time';

const DIGITS = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];

/**
 * Hour names. Two o'clock is 两点 (liǎng diǎn), not 二点 — 二 is only used for
 * counting, so the hour slot needs its own table rather than reusing DIGITS.
 */
const HOUR_WORDS = ['十二', '一', '两', '三', '四', '五', '六', '七', '八', '九', '十', '十一'];

/** Standard Mandarin composition for 0–59: 十五, 二十, 三十七… */
function numberWords(value: number): string {
	if (value < 10) return DIGITS[value];
	const tens = Math.floor(value / 10);
	const ones = value % 10;
	const tensPart = tens === 1 ? '十' : `${DIGITS[tens]}十`;
	return ones === 0 ? tensPart : `${tensPart}${DIGITS[ones]}`;
}

function speakTimePhrase(time: Time): string {
	const hourWord = HOUR_WORDS[time.hour % 12];
	if (time.minute === 0) return `${hourWord}点整`;
	// Minutes under ten take a spoken 零: 三点零五分.
	if (time.minute < 10) return `${hourWord}点零${DIGITS[time.minute]}分`;
	return `${hourWord}点${numberWords(time.minute)}分`;
}

function speakFeedback(correct: boolean): string {
	return correct ? '答对了！真棒！' : '还差一点，我们再试一次！';
}

export const zhCNSpeech: SpeechPhrasing = {
	speakTimePhrase,
	speakFeedback,
	speechLangTag: 'zh-CN'
};
