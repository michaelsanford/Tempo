<script lang="ts">
	import IconStar from '$lib/components/icons/IconStar.svelte';

	interface Props {
		visible: boolean;
	}

	let { visible }: Props = $props();

	// 8 radiating stars/sparks around the central star
	const SPARKS = [
		{ angle: 0, distance: 70, delay: 0 },
		{ angle: 45, distance: 85, delay: 50 },
		{ angle: 90, distance: 75, delay: 0 },
		{ angle: 135, distance: 90, delay: 60 },
		{ angle: 180, distance: 70, delay: 0 },
		{ angle: 225, distance: 85, delay: 50 },
		{ angle: 270, distance: 75, delay: 0 },
		{ angle: 315, distance: 90, delay: 60 }
	];
</script>

{#if visible}
	<div class="burst-container" aria-hidden="true">
		<!-- Central Mega Star -->
		<div class="central-star">
			<IconStar size="5.5rem" color="#fbbf24" />
		</div>

		<!-- Exploding sparks -->
		{#each SPARKS as spark, i (i)}
			{@const rad = (spark.angle * Math.PI) / 180}
			{@const tx = Math.round(Math.cos(rad) * spark.distance)}
			{@const ty = Math.round(Math.sin(rad) * spark.distance)}
			<div
				class="spark"
				style:--tx="{tx}px"
				style:--ty="{ty}px"
				style:animation-delay="{spark.delay}ms"
			>
				<IconStar size="1.75rem" color="#fcd34d" />
			</div>
		{/each}
	</div>
{/if}

<style>
	.burst-container {
		position: fixed;
		top: 45%;
		left: 50%;
		transform: translate(-50%, -50%);
		pointer-events: none;
		z-index: 99;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.central-star {
		filter: drop-shadow(0 0 25px rgba(251, 191, 36, 0.8));
		animation: pop-mega 0.65s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
	}

	.spark {
		position: absolute;
		filter: drop-shadow(0 0 10px rgba(253, 224, 71, 0.7));
		animation: spark-fly 0.65s ease-out forwards;
	}

	@keyframes pop-mega {
		0% {
			transform: scale(0) rotate(-45deg);
			opacity: 0;
		}
		45% {
			transform: scale(1.35) rotate(10deg);
			opacity: 1;
		}
		100% {
			transform: scale(1) translateY(-25px) rotate(0deg);
			opacity: 0;
		}
	}

	@keyframes spark-fly {
		0% {
			transform: translate(0, 0) scale(0);
			opacity: 0;
		}
		40% {
			opacity: 1;
		}
		100% {
			transform: translate(var(--tx), var(--ty)) scale(1.1) rotate(180deg);
			opacity: 0;
		}
	}
</style>
