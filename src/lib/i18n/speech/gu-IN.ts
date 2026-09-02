import type { SpeechPhrasing } from '../locales';
import type { Time } from '$lib/types/time';

/**
 * Gujarati number words 0–59, spelled out in full.
 *
 * Unlike English or French, Gujarati numerals in this range are largely irregular —
 * they cannot be composed from a tens word plus a ones word — so the whole range is
 * tabulated rather than generated.
 */
const NUMBER_WORDS = [
	'શૂન્ય',
	'એક',
	'બે',
	'ત્રણ',
	'ચાર',
	'પાંચ',
	'છ',
	'સાત',
	'આઠ',
	'નવ',
	'દસ',
	'અગિયાર',
	'બાર',
	'તેર',
	'ચૌદ',
	'પંદર',
	'સોળ',
	'સત્તર',
	'અઢાર',
	'ઓગણીસ',
	'વીસ',
	'એકવીસ',
	'બાવીસ',
	'તેવીસ',
	'ચોવીસ',
	'પચ્ચીસ',
	'છવ્વીસ',
	'સત્તાવીસ',
	'અઠ્ઠાવીસ',
	'ઓગણત્રીસ',
	'ત્રીસ',
	'એકત્રીસ',
	'બત્રીસ',
	'તેત્રીસ',
	'ચોત્રીસ',
	'પાંત્રીસ',
	'છત્રીસ',
	'સાડત્રીસ',
	'આડત્રીસ',
	'ઓગણચાળીસ',
	'ચાળીસ',
	'એકતાળીસ',
	'બેતાળીસ',
	'તેતાળીસ',
	'ચુંમાળીસ',
	'પિસ્તાળીસ',
	'છેતાળીસ',
	'સુડતાળીસ',
	'અડતાળીસ',
	'ઓગણપચાસ',
	'પચાસ',
	'એકાવન',
	'બાવન',
	'ત્રેપન',
	'ચોપન',
	'પંચાવન',
	'છપ્પન',
	'સત્તાવન',
	'અઠ્ઠાવન',
	'ઓગણસાઠ'
];

/** Hour 12 is spoken as બાર; the table is indexed by `hour % 12`. */
function hourWord(hour: number): string {
	return NUMBER_WORDS[hour % 12 === 0 ? 12 : hour % 12];
}

function speakTimePhrase(time: Time): string {
	const hour = hourWord(time.hour);
	// One o'clock takes the singular વાગ્યો; every other hour takes the plural વાગ્યા.
	const struck = time.hour % 12 === 1 ? 'વાગ્યો' : 'વાગ્યા';
	if (time.minute === 0) return `${hour} ${struck}`;
	return `${hour} વાગીને ${NUMBER_WORDS[time.minute]} મિનિટ`;
}

function speakFeedback(correct: boolean): string {
	return correct ? 'સાચું! ખૂબ સરસ!' : 'થોડું ચૂક્યા, ફરી પ્રયત્ન કરીએ!';
}

export const guINSpeech: SpeechPhrasing = {
	speakTimePhrase,
	speakFeedback,
	speechLangTag: 'gu-IN'
};
