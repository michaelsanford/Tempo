import type { Time } from '$lib/types/time';
import type { Locale, SpeechPhrasing } from '$lib/i18n/locales';

/** Wraps window.speechSynthesis. No-ops gracefully on unsupported browsers/webviews. */
export class TimeSpeaker {
	private voicesReady: Promise<void> | null = null;

	private supported(): boolean {
		return typeof window !== 'undefined' && 'speechSynthesis' in window;
	}

	private async ensureVoices(): Promise<void> {
		if (!this.supported()) return;
		if (window.speechSynthesis.getVoices().length > 0) return;
		if (!this.voicesReady) {
			this.voicesReady = new Promise((resolve) => {
				const onVoicesChanged = () => {
					window.speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged);
					resolve();
				};
				window.speechSynthesis.addEventListener('voiceschanged', onVoicesChanged);
				// Some browsers never fire voiceschanged if voices are already loaded synchronously.
				setTimeout(resolve, 500);
			});
		}
		await this.voicesReady;
	}

	private pickVoice(langTag: string): SpeechSynthesisVoice | undefined {
		const voices = window.speechSynthesis.getVoices();
		return (
			voices.find((v) => v.lang === langTag) ??
			voices.find((v) => v.lang.startsWith(langTag.split('-')[0]))
		);
	}

	async speak(text: string, langTag: string): Promise<void> {
		if (!this.supported()) return;
		await this.ensureVoices();
		window.speechSynthesis.cancel();
		const utterance = new SpeechSynthesisUtterance(text);
		utterance.lang = langTag;
		const voice = this.pickVoice(langTag);
		if (voice) utterance.voice = voice;
		window.speechSynthesis.speak(utterance);
	}

	async speakTime(time: Time, phrasing: SpeechPhrasing): Promise<void> {
		await this.speak(phrasing.speakTimePhrase(time), phrasing.speechLangTag);
	}

	async speakFeedback(correct: boolean, phrasing: SpeechPhrasing): Promise<void> {
		await this.speak(phrasing.speakFeedback(correct), phrasing.speechLangTag);
	}

	cancelAll(): void {
		if (this.supported()) window.speechSynthesis.cancel();
	}
}

export const timeSpeaker = new TimeSpeaker();

export type { Locale };
