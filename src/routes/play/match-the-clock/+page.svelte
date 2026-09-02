<script lang="ts">
	import AnalogClockFace from '$lib/components/clock/AnalogClockFace.svelte';
	import DigitalClockDisplay from '$lib/components/clock/DigitalClockDisplay.svelte';
	import ChoiceButton from '$lib/components/game/ChoiceButton.svelte';
	import FeedbackBanner from '$lib/components/game/FeedbackBanner.svelte';
	import ProgressHeader from '$lib/components/game/ProgressHeader.svelte';
	import StarBurst from '$lib/components/game/StarBurst.svelte';
	import IconArrowRight from '$lib/components/icons/IconArrowRight.svelte';
	import { generateReadClockQuestion, type ReadClockQuestion } from '$lib/logic/questionGenerators';
	import { isTimeAnswerCorrect } from '$lib/logic/answerChecking';
	import { recordAttempt } from '$lib/logic/rewards';
	import { effectiveLevel } from '$lib/logic/levels';
	import { progressStore } from '$lib/stores/progressStore';
	import { settingsStore } from '$lib/stores/settingsStore';
	import { t, speechPhrasing } from '$lib/i18n';
	import { timeSpeaker } from '$lib/utils/speech';
	import { soundEffects } from '$lib/utils/soundEffects';
	import type { Time } from '$lib/types/time';

	const MODE = 'matchClock' as const;

	let sessionStars = $state(0);
	let answered = $state(false);
	let lastCorrect = $state(false);
	let showBurst = $state(false);

	function currentLevel() {
		return effectiveLevel(
			$progressStore.modes[MODE]?.currentLevel ?? 'wholeHour',
			$settingsStore.difficultyOverride
		);
	}

	let activeLevel = $derived(currentLevel());

	let question = $state<ReadClockQuestion>(
		generateReadClockQuestion(currentLevel(), 'digitalToAnalog')
	);

	function makeQuestion(): ReadClockQuestion {
		return generateReadClockQuestion(currentLevel(), 'digitalToAnalog');
	}

	function choose(choice: Time) {
		if (answered) return;
		answered = true;
		lastCorrect = isTimeAnswerCorrect(choice, question.targetTime);

		progressStore.set(recordAttempt($progressStore, MODE, activeLevel, lastCorrect));

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
		question = makeQuestion();
	}

	function speakTarget() {
		if ($settingsStore.narrationEnabled)
			void timeSpeaker.speakTime(question.targetTime, $speechPhrasing);
	}
</script>

<ProgressHeader levelLabel={$t(`levels.${activeLevel}`)} starsThisSession={sessionStars} />

<h1 class="visually-hidden">{$t('nav.matchClock')}</h1>

<div class="target">
	<button class="speak-wrap" onclick={speakTarget} aria-label={$t('explore.speakButton')}>
		<DigitalClockDisplay time={question.targetTime} />
	</button>
</div>

{#if answered}
	<FeedbackBanner correct={lastCorrect} />
	<button class="icon-button" onclick={next} aria-label={$t('game.next')}>
		<IconArrowRight size="2.2rem" color="currentColor" />
	</button>
{:else}
	<div class="choice-grid">
		{#each question.choices as choice, i (i)}
			<ChoiceButton onclick={() => choose(choice)}>
				<AnalogClockFace time={choice} size="min(35vw, 135px)" />
			</ChoiceButton>
		{/each}
	</div>
{/if}

<StarBurst visible={showBurst} />

<style>
	.target {
		display: flex;
		justify-content: center;
		padding: 0.5rem 0;
	}

	.speak-wrap {
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
	}
</style>
