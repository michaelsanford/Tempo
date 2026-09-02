<script lang="ts">
	interface Props {
		size?: string;
	}

	let { size = '1.75rem' }: Props = $props();

	/** Five-pointed star as an SVG path, centred on (cx, cy) with the given circumradius. */
	function star(cx: number, cy: number, r: number, rotation = 0): string {
		const points: string[] = [];
		for (let i = 0; i < 10; i++) {
			const radius = i % 2 === 0 ? r : r * 0.382;
			const angle = (i * 36 - 90 + rotation) * (Math.PI / 180);
			points.push(
				`${(cx + radius * Math.cos(angle)).toFixed(2)},${(cy + radius * Math.sin(angle)).toFixed(2)}`
			);
		}
		return `M${points.join('L')}Z`;
	}

	// The four small stars each tilt to point at the large one, as on the real flag.
	const smallStars = [
		{ cx: 12.2, cy: 4.2, rotation: 22 },
		{ cx: 14.6, cy: 6.8, rotation: 45 },
		{ cx: 14.6, cy: 10.4, rotation: 70 },
		{ cx: 12.2, cy: 12.8, rotation: 22 }
	];
</script>

<svg
	viewBox="0 0 36 24"
	style:width={size}
	style:height="calc({size} * 24 / 36)"
	class="flag"
	role="img"
	aria-label="China"
>
	<rect width="36" height="24" rx="3" fill="#de2910" />
	<!-- Large star -->
	<path d={star(6.5, 6, 4)} fill="#ffde00" />
	<!-- Four small stars arcing around it -->
	{#each smallStars as s (s.cx + '-' + s.cy)}
		<path d={star(s.cx, s.cy, 1.35, s.rotation)} fill="#ffde00" />
	{/each}
</svg>

<style>
	.flag {
		display: inline-block;
		vertical-align: middle;
		border-radius: 3px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.35);
		overflow: hidden;
		flex-shrink: 0;
	}
</style>
