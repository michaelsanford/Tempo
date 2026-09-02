<script lang="ts">
	import SetClockFace from '$lib/components/clock/SetClockFace.svelte';
	import DigitalClockDisplay from '$lib/components/clock/DigitalClockDisplay.svelte';
	import FeedbackBanner from '$lib/components/game/FeedbackBanner.svelte';
	import ProgressHeader from '$lib/components/game/ProgressHeader.svelte';
	import StarBurst from '$lib/components/game/StarBurst.svelte';
	import IconTarget from '$lib/components/icons/IconTarget.svelte';
	import IconCheck from '$lib/components/icons/IconCheck.svelte';
	import IconArrowRight from '$lib/components/icons/IconArrowRight.svelte';
	import { generateSetClockQuestion, type SetClockQuestion } from '$lib/logic/questionGenerators';
	import { isTimeAnswerCorrect } from '$lib/logic/answerChecking';
	import { recordAttempt } from '$lib/logic/rewards';
	import { effectiveLevel } from '$lib/logic/levels';
	import { LEVEL_CONSTRAINTS } from '$lib/logic/levels';
	import { progressStore } from '$lib/stores/progressStore';
	import { settingsStore } from '$lib/stores/settingsStore';
	import { t, speechPhrasing } from '$lib/i18n';
	import { timeSpeaker } from '$lib/utils/speech';
	import { soundEffects } from '$lib/utils/soundEffects';
	import type { Time } from '$lib/types/time';

	const MODE = 'setClock' as const;

	let sessionStars = $state(0);
	let answered = $state(false);
	let lastCorrect = $state(false);
	let showBurst = $state(false);

	function currentLevel() {
		return effectiveLevel(
			$progressStore.modes[MODE].currentLevel,
			$settingsStore.difficultyOverride
		);
	}

	const initialQuestion = generateSetClockQuestion(currentLevel());
	let question = $state<SetClockQuestion>(initialQuestion);
	// Seeded from the question, then driven independently by the child dragging the hands.
	let handsTime = $state<Time>(initialQuestion.startingTime);

	function onHandsChange(time: Time) {
		if (answered) return;
		handsTime = time;
	}

	function submit() {
		if (answered) return;
		answered = true;
		lastCorrect = isTimeAnswerCorrect(handsTime, question.targetTime);

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
		question = generateSetClockQuestion(currentLevel());
		handsTime = question.startingTime;
	}
</script>

<ProgressHeader levelLabel={$t(`levels.${currentLevel()}`)} starsThisSession={sessionStars} />

<h1 class="visually-hidden">{$t('game.setTheClock')}</h1>

<div class="target">
	<div class="target-icon">
		<IconTarget size="2rem" color="var(--color-primary)" />
	</div>
	<DigitalClockDisplay time={question.targetTime} />
</div>

<div class="face">
	<SetClockFace
		time={handsTime}
		minuteStep={LEVEL_CONSTRAINTS[currentLevel()].minuteStep}
		onchange={onHandsChange}
		label={$t('game.setTheClock')}
	/>
</div>

{#if answered}
	<FeedbackBanner correct={lastCorrect} />
	<button class="icon-button" onclick={next} aria-label={$t('game.next')}>
		<IconArrowRight size="2.2rem" color="currentColor" />
	</button>
{:else}
	<button class="icon-button success" onclick={submit} aria-label={$t('game.submit')}>
		<IconCheck size="2.4rem" color="#0c1222" />
	</button>
{/if}

<StarBurst visible={showBurst} />

<style>
	.target {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.65rem;
	}

	.target-icon {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.face {
		display: flex;
		justify-content: center;
		padding: 0.25rem 0;
	}
</style>
