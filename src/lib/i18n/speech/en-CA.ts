import type { SpeechPhrasing } from '../locales';
import type { Time } from '$lib/types/time';

const HOUR_WORDS = [
	'twelve',
	'one',
	'two',
	'three',
	'four',
	'five',
	'six',
	'seven',
	'eight',
	'nine',
	'ten',
	'eleven'
];

const ONES = [
	'zero',
	'one',
	'two',
	'three',
	'four',
	'five',
	'six',
	'seven',
	'eight',
	'nine',
	'ten',
	'eleven',
	'twelve',
	'thirteen',
	'fourteen',
	'fifteen',
	'sixteen',
	'seventeen',
	'eighteen',
	'nineteen'
];

const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty'];

function minuteWords(minute: number): string {
	if (minute < 20) return ONES[minute];
	const tens = TENS[Math.floor(minute / 10)];
	const ones = minute % 10;
	return ones === 0 ? tens : `${tens} ${ONES[ones]}`;
}

function speakTimePhrase(time: Time): string {
	const hourWord = HOUR_WORDS[time.hour % 12];
	if (time.minute === 0) return `${hourWord} o'clock`;
	if (time.minute < 10) return `${hourWord} oh ${ONES[time.minute]}`;
	return `${hourWord} ${minuteWords(time.minute)}`;
}

function speakFeedback(correct: boolean): string {
	return correct ? 'Correct! Great job!' : "Not quite, let's try again!";
}

export const enCASpeech: SpeechPhrasing = {
	speakTimePhrase,
	speakFeedback,
	speechLangTag: 'en-CA'
};
