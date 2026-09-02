import type { SpeechPhrasing } from '../locales';
import type { Time } from '$lib/types/time';

const HOUR_WORDS = [
	'douze',
	'une',
	'deux',
	'trois',
	'quatre',
	'cinq',
	'six',
	'sept',
	'huit',
	'neuf',
	'dix',
	'onze'
];

const ONES = [
	'zéro',
	'une',
	'deux',
	'trois',
	'quatre',
	'cinq',
	'six',
	'sept',
	'huit',
	'neuf',
	'dix',
	'onze',
	'douze',
	'treize',
	'quatorze',
	'quinze',
	'seize',
	'dix-sept',
	'dix-huit',
	'dix-neuf'
];

const TENS = ['', '', 'vingt', 'trente', 'quarante', 'cinquante'];

function minuteWords(minute: number): string {
	if (minute < 20) return ONES[minute];
	const tens = TENS[Math.floor(minute / 10)];
	const ones = minute % 10;
	if (ones === 0) return tens;
	if (ones === 1) return `${tens} et un`;
	return `${tens}-${ONES[ones]}`;
}

function speakTimePhrase(time: Time): string {
	const hour = time.hour % 12;
	const hourPhrase = hour === 1 ? 'une heure' : `${HOUR_WORDS[hour]} heures`;
	if (time.minute === 0) return hourPhrase;
	return `${hourPhrase} ${minuteWords(time.minute)}`;
}

function speakFeedback(correct: boolean): string {
	return correct ? 'Bravo ! Bonne réponse !' : 'Ce n’est pas tout à fait ça, essaie encore !';
}

export const frCASpeech: SpeechPhrasing = {
	speakTimePhrase,
	speakFeedback,
	speechLangTag: 'fr-CA'
};
