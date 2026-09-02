<script lang="ts">
	import type { Time } from '$lib/types/time';
	import { angleForTime } from '$lib/logic/time';
	import { addMinutes } from '$lib/logic/duration';

	interface Props {
		startTime: Time;
		/** Duration to sweep, in minutes. Kept under an hour so the wedge is one clean slice. */
		durationMinutes: number;
		size?: string;
		/** Show the hands at the start and end of the sweep, not just the shaded slice. */
		showHands?: boolean;
		label?: string;
	}

	let {
		startTime,
		durationMinutes,
		size = 'min(30vw, 120px)',
		showHands = false,
		label
	}: Props = $props();

	const WEDGE_RADIUS = 38;

	let startAngle = $derived(angleForTime(startTime).minuteAngle);
	let sweepDegrees = $derived(Math.min(durationMinutes, 60) * 6);
	let endTime = $derived(addMinutes(startTime, durationMinutes));

	function pointAt(angleDeg: number, radius: number): [number, number] {
		const radians = (angleDeg - 90) * (Math.PI / 180);
		return [50 + radius * Math.cos(radians), 50 + radius * Math.sin(radians)];
	}

	/** Pie slice from the start position sweeping clockwise through the duration. */
	let wedgePath = $derived.by(() => {
		if (sweepDegrees <= 0) return '';
		// A full sweep can't be drawn as one arc (start and end coincide), so draw a disc.
		if (sweepDegrees >= 360) {
			return `M 50 ${50 - WEDGE_RADIUS} A ${WEDGE_RADIUS} ${WEDGE_RADIUS} 0 1 1 49.99 ${50 - WEDGE_RADIUS} Z`;
		}
		const [x1, y1] = pointAt(startAngle, WEDGE_RADIUS);
		const [x2, y2] = pointAt(startAngle + sweepDegrees, WEDGE_RADIUS);
		const largeArc = sweepDegrees > 180 ? 1 : 0;
		return `M 50 50 L ${x1} ${y1} A ${WEDGE_RADIUS} ${WEDGE_RADIUS} 0 ${largeArc} 1 ${x2} ${y2} Z`;
	});

	let startHand = $derived(pointAt(startAngle, WEDGE_RADIUS));
	let endHand = $derived(pointAt(startAngle + sweepDegrees, WEDGE_RADIUS));
	let startHourHand = $derived(pointAt(angleForTime(startTime).hourAngle, 24));
	let endHourHand = $derived(pointAt(angleForTime(endTime).hourAngle, 24));
</script>

<svg
	viewBox="0 0 100 100"
	style:width={size}
	style:height={size}
	role="img"
	aria-label={label ?? `${durationMinutes} minutes`}
	class="wedge-svg"
>
	<!-- Outer Clock Frame -->
	<circle
		cx="50"
		cy="50"
		r="48"
		fill="var(--color-clock-dial)"
		stroke="var(--color-clock-dial-border)"
		stroke-width="3"
	/>

	<!-- Tick marks -->
	{#each Array(12) as _, i (i)}
		<line
			x1={50 + 44 * Math.sin((i * 30 * Math.PI) / 180)}
			y1={50 - 44 * Math.cos((i * 30 * Math.PI) / 180)}
			x2={50 + 47 * Math.sin((i * 30 * Math.PI) / 180)}
			y2={50 - 47 * Math.cos((i * 30 * Math.PI) / 180)}
			stroke={i % 3 === 0 ? 'var(--color-clock-dial-border)' : 'var(--color-clock-tick)'}
			stroke-width={i % 3 === 0 ? 2.2 : 1.2}
			stroke-linecap="round"
		/>
	{/each}

	{#if wedgePath}
		<path
			d={wedgePath}
			fill="var(--color-accent)"
			fill-opacity="0.65"
			stroke="var(--color-accent)"
			stroke-width="2"
			stroke-linejoin="round"
		/>
	{/if}

	{#if showHands}
		<line
			x1="50"
			y1="50"
			x2={startHourHand[0]}
			y2={startHourHand[1]}
			stroke="var(--color-clock-hour-hand)"
			stroke-width="4"
			stroke-linecap="round"
			opacity="0.4"
		/>
		<line
			x1="50"
			y1="50"
			x2={endHourHand[0]}
			y2={endHourHand[1]}
			stroke="var(--color-clock-hour-hand)"
			stroke-width="4"
			stroke-linecap="round"
		/>
	{/if}

	<!-- Start & End hands of wedge -->
	<line
		x1="50"
		y1="50"
		x2={startHand[0]}
		y2={startHand[1]}
		stroke="var(--color-clock-hour-hand)"
		stroke-width="2.5"
		stroke-linecap="round"
		opacity="0.7"
	/>
	<line
		x1="50"
		y1="50"
		x2={endHand[0]}
		y2={endHand[1]}
		stroke="var(--color-clock-minute-hand)"
		stroke-width="3.5"
		stroke-linecap="round"
	/>
	<circle cx="50" cy="50" r="3.5" fill="var(--color-clock-hour-hand)" />
</svg>

<style>
	.wedge-svg {
		filter: drop-shadow(0 4px 10px var(--color-shadow));
	}
</style>
