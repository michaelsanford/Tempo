<script lang="ts">
	import AnalogClockFace from '$lib/components/clock/AnalogClockFace.svelte';
	import DurationWedge from '$lib/components/clock/DurationWedge.svelte';
	import ChoiceButton from '$lib/components/game/ChoiceButton.svelte';
	import FeedbackBanner from '$lib/components/game/FeedbackBanner.svelte';
	import ProgressHeader from '$lib/components/game/ProgressHeader.svelte';
	import StarBurst from '$lib/components/game/StarBurst.svelte';
	import IconArrowRight from '$lib/components/icons/IconArrowRight.svelte';
	import { generateDurationQuestion, type DurationQuestion } from '$lib/logic/questionGenerators';
	import { isDurationAnswerCorrect } from '$lib/logic/answerChecking';
	import { formatDuration } from '$lib/logic/duration';
	import { recordAttempt } from '$lib/logic/rewards';
	import { effectiveLevel } from '$lib/logic/levels';
	import { progressStore } from '$lib/stores/progressStore';
	import { settingsStore } from '$lib/stores/settingsStore';
	import { t, speechPhrasing } from '$lib/i18n';
	import { timeSpeaker } from '$lib/utils/speech';
	import { soundEffects } from '$lib/utils/soundEffects';

	const MODE = 'howLongUntil' as const;

	let sessionStars = $state(0);
	let answered = $state(false);
	let lastCorrect = $state(false);
	let showBurst = $state(false);
	let chosenIndex = $state<number | null>(null);

	function currentLevel() {
		return effectiveLevel(
			$progressStore.modes[MODE].currentLevel,
			$settingsStore.difficultyOverride
		);
	}

	let question = $state<DurationQuestion>(generateDurationQuestion(currentLevel()));
	let correctMinutes = $derived(question.choices[question.correctChoiceIndex]);

	function choose(minutes: number, index: number) {
		if (answered) return;
		answered = true;
		chosenIndex = index;
		lastCorrect = isDurationAnswerCorrect(minutes, correctMinutes);

		const level = currentLevel();
		progressStore.set(recordAttempt($progressStore, MODE, level, lastCorrect));

		if (lastCorrect) {
			sessionStars += 1;
			showBurst = true;
			setTimeout(() => (showBurst = false), 650);
			if ($settingsStore.soundEffectsEnabled) soundEffects.playCorrect();
		} else if ($settingsStore.soundEffectsEnabled) {
			soundEffects.playIncorrect();
		}
		if ($settingsStore.narrationEnabled)
			void timeSpeaker.speakFeedback(lastCorrect, $speechPhrasing);
	}

	function next() {
		answered = false;
		chosenIndex = null;
		question = generateDurationQuestion(currentLevel());
	}

	function choiceState(index: number): 'default' | 'correct' | 'incorrect' {
		if (!answered) return 'default';
		if (index === question.correctChoiceIndex) return 'correct';
		return index === chosenIndex ? 'incorrect' : 'default';
	}
</script>

<ProgressHeader levelLabel={$t(`levels.${currentLevel()}`)} starsThisSession={sessionStars} />

<h1 class="visually-hidden">{$t('game.howManyMinutesUntil')}</h1>

<!-- Both ends of the gap are analogue: the child compares faces, not digits. -->
<div class="times">
	<AnalogClockFace time={question.startTime} size="min(34vw, 140px)" />
	<div class="arrow-wrap">
		<IconArrowRight size="1.8rem" color="var(--color-primary)" />
	</div>
	<AnalogClockFace time={question.targetTime} size="min(34vw, 140px)" />
</div>

{#if answered}
	<FeedbackBanner correct={lastCorrect} />
{/if}

<div class="choice-grid">
	{#each question.choices as minutes, i (i)}
		<ChoiceButton onclick={() => choose(minutes, i)} disabled={answered} state={choiceState(i)}>
			<span class="choice-inner">
				<!-- The shaded slice is the answer; the numeral is only a secondary cue. -->
				<DurationWedge
					startTime={question.startTime}
					durationMinutes={minutes}
					size="min(26vw, 100px)"
					label={formatDuration(minutes)}
				/>
				<span class="choice-label">{formatDuration(minutes)}</span>
			</span>
		</ChoiceButton>
	{/each}
</div>

{#if answered}
	<button class="icon-button" onclick={next} aria-label={$t('game.next')}>
		<IconArrowRight size="2.2rem" color="currentColor" />
	</button>
{/if}

<StarBurst visible={showBurst} />

<style>
	.times {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.65rem;
	}

	.arrow-wrap {
		display: flex;
		align-items: center;
		justify-content: center;
		filter: drop-shadow(0 0 8px rgba(var(--color-primary-rgb), 0.4));
	}

	.choice-inner {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.35rem;
	}

	.choice-label {
		font-size: 0.9rem;
		font-weight: 700;
		color: var(--color-text);
	}
</style>
