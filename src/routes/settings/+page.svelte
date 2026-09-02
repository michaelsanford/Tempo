<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { settingsUnlocked } from '$lib/stores/parentGateStore';
	import { settingsStore } from '$lib/stores/settingsStore';
	import { resetProgress } from '$lib/stores/progressStore';
	import {
		routineStore,
		addRoutine,
		updateRoutine,
		deleteRoutine,
		createRoutineId
	} from '$lib/stores/routineStore';
	import RoutineEventCard from '$lib/components/routine/RoutineEventCard.svelte';
	import RoutineEventEditor from '$lib/components/routine/RoutineEventEditor.svelte';
	import IconFlagCanada from '$lib/components/icons/IconFlagCanada.svelte';
	import IconFlagQuebec from '$lib/components/icons/IconFlagQuebec.svelte';
	import IconFlagFrance from '$lib/components/icons/IconFlagFrance.svelte';
	import IconCheck from '$lib/components/icons/IconCheck.svelte';
	import IconDownload from '$lib/components/icons/IconDownload.svelte';
	import InstallInstructionsModal from '$lib/components/pwa/InstallInstructionsModal.svelte';
	import { isInstalled, isIos, promptInstall } from '$lib/stores/pwaInstallStore';
	import { t } from '$lib/i18n';
	import { SUPPORTED_LOCALES, LOCALE_META, type Locale } from '$lib/i18n/locales';
	import { LEVELS } from '$lib/logic/levels';
	import type { LevelId } from '$lib/types/progress';
	import type { ThemeMode } from '$lib/types/settings';
	import type { RoutineEvent } from '$lib/types/routine';

	if (!$settingsUnlocked) {
		goto(resolve('/'));
	}

	let editingEvent = $state<RoutineEvent | null>(null);
	let languageDropdownOpen = $state(false);
	let showInstallModal = $state(false);

	async function handleInstallClick() {
		const outcome = await promptInstall();
		if (outcome === 'manual') {
			showInstallModal = true;
		}
	}

	function newRoutine() {
		editingEvent = {
			id: createRoutineId(),
			label: '',
			leaveBy: { hour: 8, minute: 0 },
			activeDays: [1, 2, 3, 4, 5],
			enabled: true,
			createdAt: new Date().toISOString()
		};
	}

	function saveRoutine(event: RoutineEvent) {
		if ($routineStore.some((e) => e.id === event.id)) {
			updateRoutine(event.id, event);
		} else {
			addRoutine(event);
		}
		editingEvent = null;
	}

	function confirmReset() {
		if (confirm($t('settings.resetConfirm'))) resetProgress();
	}

	function onDifficultyChange(event: Event) {
		const value = (event.target as HTMLSelectElement).value as LevelId | 'auto';
		settingsStore.update((s) => ({ ...s, difficultyOverride: value }));
	}

	function selectLocale(loc: Locale) {
		settingsStore.update((s) => ({ ...s, locale: loc }));
		languageDropdownOpen = false;
	}

	function onThemeChange(event: Event) {
		const value = (event.target as HTMLSelectElement).value as ThemeMode;
		settingsStore.update((s) => ({ ...s, theme: value }));
	}

	let selectedMeta = $derived(LOCALE_META[$settingsStore.locale] ?? LOCALE_META['en-CA']);
</script>

{#if $settingsUnlocked}
	<h1 class="title">{$t('settings.title')}</h1>

	<div class="card options">
		<label class="row">
			<span>{$t('settings.narration')}</span>
			<input type="checkbox" bind:checked={$settingsStore.narrationEnabled} />
		</label>
		<label class="row">
			<span>{$t('settings.soundEffects')}</span>
			<input type="checkbox" bind:checked={$settingsStore.soundEffectsEnabled} />
		</label>
		<label class="row">
			<span>{$t('settings.theme')}</span>
			<select value={$settingsStore.theme ?? 'dark'} onchange={onThemeChange}>
				<option value="dark">{$t('settings.themeDark')}</option>
				<option value="light">{$t('settings.themeLight')}</option>
			</select>
		</label>

		<!-- Custom Language Dropdown with Flags -->
		<div class="row language-row">
			<span>{$t('settings.language')}</span>
			<div class="lang-picker">
				<button
					type="button"
					class="lang-current touch-target"
					onclick={() => (languageDropdownOpen = !languageDropdownOpen)}
					aria-haspopup="listbox"
					aria-expanded={languageDropdownOpen}
				>
					{#if selectedMeta.flagType === 'canada'}
						<IconFlagCanada size="1.6rem" />
					{:else if selectedMeta.flagType === 'quebec'}
						<IconFlagQuebec size="1.6rem" />
					{:else}
						<IconFlagFrance size="1.6rem" />
					{/if}
					<span class="lang-name">{selectedMeta.name}</span>
					<span class="lang-region">({selectedMeta.region})</span>
					<span class="dropdown-chevron">{languageDropdownOpen ? '▲' : '▼'}</span>
				</button>

				{#if languageDropdownOpen}
					<!-- eslint-disable-next-line svelte/valid-compile -->
					<div class="lang-menu" role="listbox">
						{#each SUPPORTED_LOCALES as loc (loc)}
							{@const meta = LOCALE_META[loc]}
							{@const isSelected = $settingsStore.locale === loc}
							<button
								type="button"
								class="lang-option"
								class:selected={isSelected}
								role="option"
								aria-selected={isSelected}
								onclick={() => selectLocale(loc)}
							>
								<div class="lang-opt-left">
									{#if meta.flagType === 'canada'}
										<IconFlagCanada size="1.6rem" />
									{:else if meta.flagType === 'quebec'}
										<IconFlagQuebec size="1.6rem" />
									{:else}
										<IconFlagFrance size="1.6rem" />
									{/if}
									<span class="lang-opt-text">
										<strong>{meta.name}</strong>
										<span class="region-hint">({meta.region})</span>
									</span>
								</div>
								{#if isSelected}
									<IconCheck size="1.2rem" color="var(--color-primary)" />
								{/if}
							</button>
						{/each}
					</div>
				{/if}
			</div>
		</div>

		<label class="row">
			<span>{$t('settings.difficultyOverride')}</span>
			<select value={$settingsStore.difficultyOverride} onchange={onDifficultyChange}>
				<option value="auto">{$t('settings.difficultyAuto')}</option>
				{#each LEVELS as level (level)}
					<option value={level}>{$t(`levels.${level}`)}</option>
				{/each}
			</select>
		</label>

		<div class="row install-row">
			<div class="install-info">
				<span class="install-title">{$t('settings.installSection')}</span>
				<span class="install-desc">{$t('settings.installDescription')}</span>
			</div>
			{#if $isInstalled}
				<div class="installed-badge">
					<IconCheck size="1.1rem" color="var(--color-success)" />
					<span>{$t('settings.installed')}</span>
				</div>
			{:else}
				<button type="button" class="install-btn touch-target" onclick={handleInstallClick}>
					<IconDownload size="1.2rem" color="#0c1222" />
					<span>{$t('settings.installButton')}</span>
				</button>
			{/if}
		</div>
	</div>

	<h2 class="subtitle">{$t('settings.routines')}</h2>
	<div class="routines">
		{#each $routineStore as event (event.id)}
			<RoutineEventCard
				{event}
				onEdit={() => (editingEvent = event)}
				onDelete={() => deleteRoutine(event.id)}
				onToggle={() => updateRoutine(event.id, { enabled: !event.enabled })}
			/>
		{/each}
	</div>

	{#if editingEvent}
		{#key editingEvent.id}
			<RoutineEventEditor
				event={editingEvent}
				onSave={saveRoutine}
				onCancel={() => (editingEvent = null)}
			/>
		{/key}
	{:else}
		<button class="add touch-target" onclick={newRoutine}>+ {$t('settings.addRoutine')}</button>
	{/if}

	<button class="reset touch-target" onclick={confirmReset}>{$t('settings.resetProgress')}</button>

	{#if showInstallModal}
		<InstallInstructionsModal isIos={$isIos} onClose={() => (showInstallModal = false)} />
	{/if}
{/if}

<style>
	.title {
		text-align: center;
		font-size: clamp(1.25rem, 6vw, 1.75rem);
		font-weight: 800;
		color: var(--color-text);
		margin: 0;
	}

	.subtitle {
		font-size: 1.15rem;
		font-weight: 800;
		color: var(--color-text);
		margin: 0.5rem 0 0;
	}

	.options {
		display: flex;
		flex-direction: column;
		gap: 0.85rem;
		overflow: visible;
	}

	.row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-weight: 700;
		font-size: 0.95rem;
		color: var(--color-text);
		position: relative;
	}

	select {
		background: var(--color-bg-secondary);
		color: var(--color-text);
		border: 2px solid var(--color-card-border);
		border-radius: var(--radius-md);
		padding: 0.35rem 0.65rem;
		font-weight: 600;
		font-size: 0.9rem;
	}

	input[type='checkbox'] {
		width: 1.35rem;
		height: 1.35rem;
		accent-color: var(--color-primary);
		cursor: pointer;
	}

	.language-row {
		align-items: center;
	}

	.lang-picker {
		position: relative;
	}

	.lang-current {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		background: var(--color-bg-secondary);
		color: var(--color-text);
		border: 2px solid var(--color-card-border);
		border-radius: var(--radius-md);
		padding: 0.35rem 0.65rem;
		font-weight: 600;
		font-size: 0.85rem;
		cursor: pointer;
		transition: border-color 0.15s ease;
	}

	.lang-current:hover {
		border-color: var(--color-primary);
	}

	.lang-name {
		font-weight: 700;
	}

	.lang-region {
		color: var(--color-text-muted);
		font-size: 0.75rem;
	}

	.dropdown-chevron {
		font-size: 0.65rem;
		color: var(--color-text-muted);
		margin-left: 0.2rem;
	}

	.lang-menu {
		position: absolute;
		right: 0;
		top: calc(100% + 0.35rem);
		z-index: 50;
		background: var(--color-surface);
		border: 2px solid var(--color-primary);
		border-radius: var(--radius-md);
		padding: 0.35rem;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		min-width: 13.5rem;
		box-shadow: 0 8px 24px var(--color-shadow);
	}

	.lang-option {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		padding: 0.5rem 0.65rem;
		border-radius: var(--radius-sm, 0.5rem);
		border: none;
		background: none;
		color: var(--color-text);
		cursor: pointer;
		text-align: left;
		transition: background 0.12s ease;
	}

	.lang-option:hover,
	.lang-option.selected {
		background: var(--color-bg-secondary);
	}

	.lang-opt-left {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.lang-opt-text {
		display: flex;
		flex-direction: column;
		font-size: 0.85rem;
		line-height: 1.2;
	}

	.region-hint {
		font-size: 0.75rem;
		color: var(--color-text-muted);
	}

	.routines {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.add,
	.reset {
		padding: 0.85rem;
		border-radius: var(--radius-md);
		font-weight: 800;
		border: none;
		cursor: pointer;
		transition:
			transform 0.12s ease,
			box-shadow 0.12s ease;
	}

	.add {
		background: var(--color-bg-secondary);
		border: 2px dashed var(--color-primary);
		color: var(--color-primary);
	}

	.reset {
		background: color-mix(in srgb, var(--color-danger) 18%, var(--color-surface));
		border: 2px solid var(--color-danger);
		color: var(--color-danger);
	}

	.add:active,
	.reset:active {
		transform: translateY(2px);
	}

	.install-row {
		flex-direction: column;
		align-items: stretch;
		gap: 0.65rem;
		padding-top: 0.65rem;
		border-top: 1px solid var(--color-card-border);
	}

	.install-info {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
	}

	.install-title {
		font-weight: 700;
		font-size: 0.95rem;
		color: var(--color-text);
	}

	.install-desc {
		font-size: 0.8rem;
		font-weight: 500;
		color: var(--color-text-muted);
		line-height: 1.35;
	}

	.installed-badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.4rem;
		padding: 0.5rem 0.85rem;
		background: color-mix(in srgb, var(--color-success) 15%, var(--color-surface));
		border: 1.5px solid var(--color-success);
		border-radius: var(--radius-md);
		font-size: 0.85rem;
		font-weight: 700;
		color: var(--color-success);
	}

	.install-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.65rem 1rem;
		border: none;
		border-radius: var(--radius-md);
		background: var(--color-primary);
		color: #0c1222;
		font-weight: 800;
		font-size: 0.95rem;
		cursor: pointer;
		box-shadow:
			0 3px 0 color-mix(in srgb, var(--color-primary) 60%, black),
			0 4px 8px var(--color-shadow);
		transition:
			transform 0.12s ease,
			box-shadow 0.12s ease;
	}

	.install-btn:active {
		transform: translateY(2px);
		box-shadow:
			0 1px 0 color-mix(in srgb, var(--color-primary) 60%, black),
			0 2px 4px var(--color-shadow);
	}
</style>
