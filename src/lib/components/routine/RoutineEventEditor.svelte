<script lang="ts">
	import { untrack } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import type { RoutineEvent, Weekday } from '$lib/types/routine';
	import { t } from '$lib/i18n';

	interface Props {
		event: RoutineEvent;
		onSave: (event: RoutineEvent) => void;
		onCancel: () => void;
	}

	let { event, onSave, onCancel }: Props = $props();

	// Snapshot on mount only — the parent remounts this component (via {#key event.id})
	// whenever a different event is opened for editing.
	let label = $state(untrack(() => event.label));
	let hour = $state(untrack(() => event.leaveBy.hour));
	let minute = $state(untrack(() => event.leaveBy.minute));
	const activeDays = new SvelteSet<Weekday>(untrack(() => event.activeDays));

	const ALL_DAYS: Weekday[] = [0, 1, 2, 3, 4, 5, 6];

	function toggleDay(day: Weekday) {
		if (activeDays.has(day)) activeDays.delete(day);
		else activeDays.add(day);
	}

	function save() {
		onSave({
			...event,
			label: label.trim() || event.label,
			leaveBy: { hour, minute },
			activeDays: Array.from(activeDays)
		});
	}
</script>

<div class="card editor">
	<label class="field">
		{$t('settings.routineLabel')}
		<input type="text" bind:value={label} />
	</label>

	<label class="field">
		{$t('settings.routineLeaveBy')}
		<div class="time-inputs">
			<input class="touch-target" type="number" min="0" max="23" bind:value={hour} />
			<span>:</span>
			<input class="touch-target" type="number" min="0" max="59" bind:value={minute} />
		</div>
	</label>

	<div class="field">
		{$t('settings.routineDays')}
		<div class="days">
			{#each ALL_DAYS as day (day)}
				<button
					type="button"
					class="day touch-target"
					class:active={activeDays.has(day)}
					onclick={() => toggleDay(day)}
				>
					{$t(`days.${day}`)}
				</button>
			{/each}
		</div>
	</div>

	<div class="buttons">
		<button class="cancel touch-target" onclick={onCancel}>{$t('settings.cancel')}</button>
		<button class="save touch-target" onclick={save}>{$t('settings.save')}</button>
	</div>
</div>

<style>
	.editor {
		display: flex;
		flex-direction: column;
		gap: 0.85rem;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		font-weight: 700;
		font-size: 0.85rem;
		color: var(--color-text-muted);
	}

	input[type='text'],
	input[type='number'] {
		font-size: 1.1rem;
		font-weight: 600;
		padding: 0.6rem 0.75rem;
		border-radius: var(--radius-md);
		border: 2px solid var(--color-card-border);
		background: var(--color-bg-secondary);
		color: var(--color-text);
	}

	input[type='text']:focus,
	input[type='number']:focus {
		outline: none;
		border-color: var(--color-primary);
	}

	.time-inputs {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.time-inputs span {
		font-weight: 800;
		font-size: 1.25rem;
		color: var(--color-text);
	}

	.time-inputs input {
		width: 4.5rem;
		text-align: center;
	}

	.days {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
	}

	.day {
		padding: 0.45rem 0.75rem;
		border-radius: 999px;
		border: 2px solid var(--color-card-border);
		background: var(--color-bg-secondary);
		color: var(--color-text-muted);
		font-weight: 700;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.day.active {
		background: var(--color-primary);
		border-color: var(--color-primary);
		color: #0c1222;
	}

	.buttons {
		display: flex;
		gap: 0.75rem;
		margin-top: 0.5rem;
	}

	.buttons button {
		flex: 1;
		padding: 0.75rem;
		border-radius: var(--radius-md);
		font-weight: 800;
		border: none;
		cursor: pointer;
		transition:
			transform 0.12s ease,
			box-shadow 0.12s ease;
	}

	.cancel {
		background: var(--color-bg-secondary);
		border: 2px solid var(--color-card-border) !important;
		color: var(--color-text);
	}

	.save {
		background: var(--color-primary);
		color: #0c1222;
	}

	.cancel:active,
	.save:active {
		transform: translateY(2px);
	}
</style>
