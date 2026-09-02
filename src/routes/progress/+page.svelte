<script lang="ts">
	import BadgeTile from '$lib/components/badges/BadgeTile.svelte';
	import IconStar from '$lib/components/icons/IconStar.svelte';
	import IconFlame from '$lib/components/icons/IconFlame.svelte';
	import IconMedal from '$lib/components/icons/IconMedal.svelte';
	import { progressStore } from '$lib/stores/progressStore';
	import { BADGE_DEFINITIONS } from '$lib/logic/rewards';
	import { t } from '$lib/i18n';
	import type { GameMode } from '$lib/types/progress';

	const MODES: GameMode[] = ['readClock', 'matchClock', 'setClock', 'howLongUntil'];

	let earnedIds = $derived(new Set($progressStore.badges.map((b) => b.id)));
	let allBadges = $derived(
		BADGE_DEFINITIONS.map((def) => {
			const earned = $progressStore.badges.find((b) => b.id === def.id);
			return (
				earned ?? {
					id: def.id,
					name: def.name,
					description: def.description,
					icon: def.icon,
					earnedAt: null
				}
			);
		})
	);
</script>

<h1 class="visually-hidden">{$t('progress.title')}</h1>

<div class="stats card">
	<div class="stat">
		<div class="stat-value">
			<IconStar size="1.4rem" color="#fbbf24" />
			<span>{$progressStore.totalStars}</span>
		</div>
		<span class="label">{$t('progress.totalStars')}</span>
	</div>
	<div class="stat">
		<div class="stat-value">
			<IconFlame size="1.4rem" color="#f97316" />
			<span>{$progressStore.streak.currentStreakDays}</span>
		</div>
		<span class="label">{$t('progress.currentStreak')}</span>
	</div>
	<div class="stat">
		<div class="stat-value">
			<IconMedal size="1.4rem" color="#fbbf24" />
			<span>{$progressStore.streak.longestStreakDays}</span>
		</div>
		<span class="label">{$t('progress.longestStreak')}</span>
	</div>
</div>

<div class="levels card">
	{#each MODES as mode (mode)}
		<div class="level-row">
			<span>{$t(`nav.${mode}`)}</span>
			<span class="level-value"
				>{$t(`levels.${$progressStore.modes[mode]?.currentLevel ?? 'wholeHour'}`)}</span
			>
		</div>
	{/each}
</div>

<h2 class="visually-hidden">{$t('progress.badgesEarned')}</h2>
<div class="badges">
	{#each allBadges as badge (badge.id)}
		<BadgeTile {badge} earned={earnedIds.has(badge.id)} />
	{/each}
</div>

<style>
	.stats {
		display: flex;
		justify-content: space-around;
	}

	.stat {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
	}

	.stat-value {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		font-weight: 800;
		font-size: 1.25rem;
		color: var(--color-text);
	}

	.label {
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--color-text-muted);
	}

	.levels {
		display: flex;
		flex-direction: column;
		gap: 0.65rem;
	}

	.level-row {
		display: flex;
		justify-content: space-between;
		font-weight: 700;
		font-size: 0.95rem;
	}

	.level-value {
		color: var(--color-primary);
	}

	.badges {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.6rem;
	}
</style>
