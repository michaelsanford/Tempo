<script lang="ts">
	import SetClockFace from '$lib/components/clock/SetClockFace.svelte';
	import DigitalClockDisplay from '$lib/components/clock/DigitalClockDisplay.svelte';
	import IconArrowLeft from '$lib/components/icons/IconArrowLeft.svelte';
	import IconArrowRight from '$lib/components/icons/IconArrowRight.svelte';
	import IconSpeaker from '$lib/components/icons/IconSpeaker.svelte';
	import IconNow from '$lib/components/icons/IconNow.svelte';
	import { t, speechPhrasing } from '$lib/i18n';
	import { timeSpeaker } from '$lib/utils/speech';
	import { settingsStore } from '$lib/stores/settingsStore';
	import { clockTickStore } from '$lib/stores/clockTickStore';
	import { addMinutes } from '$lib/logic/duration';
	import type { Time } from '$lib/types/time';

	let time = $state<Time>({ hour: 12, minute: 0 });

	function speak() {
		if ($settingsStore.narrationEnabled) void timeSpeaker.speakTime(time, $speechPhrasing);
	}

	function nudge(minutes: number) {
		time = addMinutes(time, minutes);
	}

	/** Jump the hands to the real current time — ties free play back to the actual day. */
	function setToNow() {
		time = { hour: $clockTickStore.getHours(), minute: $clockTickStore.getMinutes() };
	}
</script>

<h1 class="visually-hidden">{$t('explore.title')}</h1>

<div class="readout">
	<DigitalClockDisplay {time} />
</div>

<div class="face">
	<SetClockFace
		{time}
		minuteStep={1}
		onchange={(next) => (time = next)}
		label={$t('nav.explore')}
	/>
</div>

<div class="controls">
	<button class="icon-button" onclick={() => nudge(-60)} aria-label={$t('explore.hourBack')}>
		<IconArrowLeft size="2.2rem" color="currentColor" />
	</button>
	<button class="icon-button accent" onclick={speak} aria-label={$t('explore.speakButton')}>
		<IconSpeaker size="2.2rem" color="currentColor" />
	</button>
	<button class="icon-button" onclick={() => nudge(60)} aria-label={$t('explore.hourForward')}>
		<IconArrowRight size="2.2rem" color="currentColor" />
	</button>
</div>

<button class="now touch-target" onclick={setToNow} aria-label={$t('explore.nowButton')}>
	<IconNow size="1.75rem" color="var(--color-primary)" />
	<span>{$t('explore.nowButton')}</span>
</button>

<style>
	.readout,
	.face,
	.controls {
		display: flex;
		justify-content: center;
	}

	.face {
		padding: 0.25rem 0;
	}

	.controls {
		gap: 1.25rem;
		align-items: center;
	}

	.now {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		align-self: center;
		background: var(--color-surface);
		border: 2px solid var(--color-primary);
		border-radius: 999px;
		padding: 0.5rem 1.25rem;
		font-size: 0.85rem;
		font-weight: 700;
		color: var(--color-text);
		cursor: pointer;
		box-shadow:
			0 3px 0 color-mix(in srgb, var(--color-primary) 60%, black),
			0 4px 12px var(--color-shadow);
		transition:
			transform 0.12s ease,
			box-shadow 0.12s ease;
	}

	.now:active {
		transform: translateY(2px);
		box-shadow:
			0 1px 0 color-mix(in srgb, var(--color-primary) 60%, black),
			0 2px 6px var(--color-shadow);
	}
</style>
