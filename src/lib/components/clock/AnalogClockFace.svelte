<script lang="ts">
	import type { Time } from '$lib/types/time';
	import { angleForTime } from '$lib/logic/time';

	interface Props {
		time: Time;
		/** CSS size value, e.g. "min(80vw, 45vh)" — defaults to a phone-friendly responsive size. */
		size?: string;
	}

	let { time, size = 'min(80vw, 45vh, 320px)' }: Props = $props();

	let angles = $derived(angleForTime(time));

	function handPoint(angleDeg: number, length: number): string {
		const radians = (angleDeg - 90) * (Math.PI / 180);
		const x = 50 + length * Math.cos(radians);
		const y = 50 + length * Math.sin(radians);
		return `${x},${y}`;
	}

	const NUMBERS = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
	const NUMERAL_RADIUS = 35;
</script>

<svg
	viewBox="0 0 100 100"
	style:width={size}
	style:height={size}
	role="img"
	aria-label="Analogue clock face"
	class="clock-svg"
>
	<!-- Outer Clock Frame -->
	<circle
		cx="50"
		cy="50"
		r="48"
		fill="var(--color-clock-dial)"
		stroke="var(--color-clock-dial-border)"
		stroke-width="3.5"
	/>

	<!-- Inner decorative ring -->
	<circle
		cx="50"
		cy="50"
		r="43"
		fill="none"
		stroke="var(--color-card-border)"
		stroke-width="0.75"
		stroke-dasharray="1.5 2.5"
	/>

	<!-- Tick marks -->
	{#each Array(12) as _, i (i)}
		<line
			x1={50 + 44 * Math.sin((i * 30 * Math.PI) / 180)}
			y1={50 - 44 * Math.cos((i * 30 * Math.PI) / 180)}
			x2={50 + 47 * Math.sin((i * 30 * Math.PI) / 180)}
			y2={50 - 47 * Math.cos((i * 30 * Math.PI) / 180)}
			stroke={i % 3 === 0 ? 'var(--color-clock-dial-border)' : 'var(--color-clock-tick)'}
			stroke-width={i % 3 === 0 ? 2.5 : 1.2}
			stroke-linecap="round"
		/>
	{/each}

	<!-- Hour numerals 1 to 12 -->
	{#each NUMBERS as num, i (num)}
		{@const rad = (i * 30 - 90) * (Math.PI / 180)}
		<text
			x={50 + NUMERAL_RADIUS * Math.cos(rad)}
			y={50 + NUMERAL_RADIUS * Math.sin(rad)}
			text-anchor="middle"
			dominant-baseline="central"
			fill="var(--color-clock-numeral)"
			font-size="6.8"
			font-weight="800"
			class="clock-num"
		>
			{num}
		</text>
	{/each}

	<!-- Hour hand (Thicker, Sky Blue) -->
	<line
		x1="50"
		y1="50"
		x2={handPoint(angles.hourAngle, 24).split(',')[0]}
		y2={handPoint(angles.hourAngle, 24).split(',')[1]}
		stroke="var(--color-clock-hour-hand)"
		stroke-width="4.8"
		stroke-linecap="round"
	/>

	<!-- Minute hand (Longer, Sunny Amber) -->
	<line
		x1="50"
		y1="50"
		x2={handPoint(angles.minuteAngle, 37).split(',')[0]}
		y2={handPoint(angles.minuteAngle, 37).split(',')[1]}
		stroke="var(--color-clock-minute-hand)"
		stroke-width="3.6"
		stroke-linecap="round"
	/>

	<!-- Center cap with layered depth -->
	<circle cx="50" cy="50" r="4" fill="var(--color-clock-hour-hand)" />
	<circle cx="50" cy="50" r="2" fill="var(--color-bg)" />
</svg>

<style>
	.clock-svg {
		filter: drop-shadow(0 6px 14px var(--color-shadow));
	}

	.clock-num {
		user-select: none;
		font-family:
			system-ui,
			-apple-system,
			'Segoe UI',
			Roboto,
			sans-serif;
	}
</style>
