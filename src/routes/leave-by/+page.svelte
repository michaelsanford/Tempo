<script lang="ts">
	import AnalogClockFace from '$lib/components/clock/AnalogClockFace.svelte';
	import DigitalClockDisplay from '$lib/components/clock/DigitalClockDisplay.svelte';
	import CountdownRing from '$lib/components/routine/CountdownRing.svelte';
	import IconLeaveBy from '$lib/components/icons/IconLeaveBy.svelte';
	import IconRunner from '$lib/components/icons/IconRunner.svelte';
	import { clockTickStore } from '$lib/stores/clockTickStore';
	import { routineStore } from '$lib/stores/routineStore';
	import { settingsStore } from '$lib/stores/settingsStore';
	import { nextOccurrence, msRemaining, isOverdue } from '$lib/logic/routineCountdown';
	import { t, speechPhrasing } from '$lib/i18n';
	import { timeSpeaker } from '$lib/utils/speech';
	import { soundEffects } from '$lib/utils/soundEffects';
	import type { RoutineEvent } from '$lib/types/routine';

	const GRACE_MS = 5 * 60 * 1000;
	const WINDOW_MS = 60 * 60 * 1000; // countdown ring fills over the last hour before deadline

	let now = $derived($clockTickStore);
	let currentTime = $derived({ hour: now.getHours(), minute: now.getMinutes() });

	let upcoming = $derived(
		$routineStore
			.map((event) => ({ event, next: nextOccurrence(event, now) }))
			.filter((entry): entry is { event: RoutineEvent; next: Date } => entry.next !== null)
			.sort((a, b) => a.next.getTime() - b.next.getTime())[0]
	);

	let remainingMs = $derived(upcoming ? msRemaining(upcoming.next, now) : null);
	let overdue = $derived(upcoming ? isOverdue(upcoming.next, now) : false);
	let withinGrace = $derived(overdue && remainingMs !== null && remainingMs > -GRACE_MS);
	let fraction = $derived(
		remainingMs === null ? 0 : 1 - Math.min(1, Math.max(0, remainingMs / WINDOW_MS))
	);

	let announced = $state(false);
	$effect(() => {
		if (!upcoming) return;
		if (overdue && !announced) {
			announced = true;
			if ($settingsStore.soundEffectsEnabled) soundEffects.playTick();
			if ($settingsStore.narrationEnabled) {
				void timeSpeaker.speak(upcoming.event.label, $speechPhrasing.speechLangTag);
			}
		}
		if (!overdue) announced = false;
	});

	function remainingLabel(ms: number): string {
		const totalSeconds = Math.max(0, Math.round(ms / 1000));
		const minutes = Math.floor(totalSeconds / 60);
		const seconds = totalSeconds % 60;
		return `${minutes}:${String(seconds).padStart(2, '0')}`;
	}
</script>

<h1 class="visually-hidden">{$t('leaveBy.title')}</h1>

<div class="clocks">
	<AnalogClockFace time={currentTime} size="min(45vw, 160px)" />
	<DigitalClockDisplay time={currentTime} />
</div>

{#if !upcoming}
	<div class="empty">
		<IconLeaveBy size="3rem" color="var(--color-primary)" />
		<p>{$t('leaveBy.noEvents')}</p>
	</div>
{:else if overdue}
	<div class="overdue card" class:grace={withinGrace}>
		<p class="event-label">{upcoming.event.label}</p>
		<div class="big">
			<IconRunner size="2.5rem" color="var(--color-accent)" />
			<span>{$t('leaveBy.timeToGo')}</span>
		</div>
		{#if !withinGrace}
			<p class="message">{$t('leaveBy.overdueMessage')}</p>
		{/if}
	</div>
{:else}
	<div class="countdown card">
		<p class="event-label">{upcoming.event.label}</p>
		<CountdownRing {fraction} label={remainingLabel(remainingMs ?? 0)} />
	</div>
{/if}

<style>
	.clocks {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	.empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
		text-align: center;
		font-size: 0.95rem;
		color: var(--color-text-muted);
		padding: 1.5rem;
	}

	.countdown,
	.overdue {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		text-align: center;
	}

	.event-label {
		font-weight: 800;
		font-size: 1.25rem;
		color: var(--color-primary);
		margin: 0;
	}

	.big {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		font-size: clamp(1.6rem, 8vw, 2.25rem);
		font-weight: 800;
		color: var(--color-accent);
		margin: 0.25rem 0;
	}

	.message {
		font-size: 0.85rem;
		color: var(--color-text-muted);
		margin: 0;
	}
</style>
