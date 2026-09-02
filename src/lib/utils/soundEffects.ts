/** Synthesizes short chimes via Web Audio — no binary audio assets, no network calls. */
export class SoundEffects {
	private context: AudioContext | null = null;

	/** Must be called from within a user-gesture handler (tap/click) per browser autoplay policy. */
	private ensureContext(): AudioContext | null {
		if (typeof window === 'undefined') return null;
		const AudioContextCtor =
			window.AudioContext ??
			(window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
		if (!AudioContextCtor) return null;
		if (!this.context) this.context = new AudioContextCtor();
		if (this.context.state === 'suspended') void this.context.resume();
		return this.context;
	}

	private tone(frequency: number, startOffset: number, duration: number, gain = 0.2): void {
		const ctx = this.ensureContext();
		if (!ctx) return;
		const oscillator = ctx.createOscillator();
		const gainNode = ctx.createGain();
		oscillator.type = 'sine';
		oscillator.frequency.value = frequency;
		const startTime = ctx.currentTime + startOffset;
		gainNode.gain.setValueAtTime(0, startTime);
		gainNode.gain.linearRampToValueAtTime(gain, startTime + 0.02);
		gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
		oscillator.connect(gainNode).connect(ctx.destination);
		oscillator.start(startTime);
		oscillator.stop(startTime + duration + 0.05);
	}

	playCorrect(): void {
		this.tone(523.25, 0, 0.15);
		this.tone(659.25, 0.1, 0.2);
		this.tone(783.99, 0.2, 0.3);
	}

	playIncorrect(): void {
		this.tone(220, 0, 0.25, 0.15);
	}

	playLevelUp(): void {
		[523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => this.tone(freq, i * 0.1, 0.25));
	}

	playBadgeEarned(): void {
		[659.25, 783.99, 987.77, 1318.5].forEach((freq, i) => this.tone(freq, i * 0.08, 0.3));
	}

	playTick(): void {
		this.tone(880, 0, 0.08, 0.1);
	}
}

export const soundEffects = new SoundEffects();
