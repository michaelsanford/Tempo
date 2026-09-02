<script lang="ts">
	import type { Time } from '$lib/types/time';
	import { angleForTime } from '$lib/logic/time';
	import {
		angleFromPointer,
		dragHand,
		pickHand,
		HOUR_HAND_LENGTH,
		MINUTE_HAND_LENGTH,
		type HandName
	} from '$lib/utils/dragHandle';

	interface Props {
		time: Time;
		minuteStep: number;
		onchange: (time: Time) => void;
		size?: string;
		label?: string;
	}

	let {
		time,
		minuteStep,
		onchange,
		size = 'min(80vw, 45vh, 320px)',
		label = 'Clock hands'
	}: Props = $props();

	let svgEl: SVGSVGElement;
	let draggingHand = $state<HandName | null>(null);
	let angles = $derived(angleForTime(time));

	function handPoint(angleDeg: number, length: number): [number, number] {
		const radians = (angleDeg - 90) * (Math.PI / 180);
		return [50 + length * Math.cos(radians), 50 + length * Math.sin(radians)];
	}

	/** Pointer position as clock-face polar coords, in the SVG's 0-100 viewBox units. */
	function pointerPolar(clientX: number, clientY: number): { angleDeg: number; radius: number } {
		const rect = svgEl.getBoundingClientRect();
		const dx = clientX - (rect.left + rect.width / 2);
		const dy = clientY - (rect.top + rect.height / 2);
		const scale = rect.width > 0 ? 100 / rect.width : 1;
		return {
			angleDeg: angleFromPointer(dx, dy),
			radius: Math.hypot(dx, dy) * scale
		};
	}

	function onPointerDown(event: PointerEvent) {
		const { angleDeg, radius } = pointerPolar(event.clientX, event.clientY);
		const hand = pickHand(time, angleDeg, radius, minuteStep);
		draggingHand = hand;
		// Capture on the SVG itself so the drag survives the hand moving out from under
		// the pointer — child hit areas would drop it the moment the geometry changed.
		svgEl.setPointerCapture(event.pointerId);
		// Jump the hand straight to the tap, so a tap anywhere on the face works too.
		onchange(dragHand(hand, time, angleDeg, minuteStep));
	}

	function onPointerMove(event: PointerEvent) {
		if (!draggingHand) return;
		const { angleDeg } = pointerPolar(event.clientX, event.clientY);
		onchange(dragHand(draggingHand, time, angleDeg, minuteStep));
	}

	function endDrag() {
		draggingHand = null;
	}

	/** Nudge the focused hand with the arrow keys, for keyboard and switch access. */
	function nudge(hand: HandName, direction: 1 | -1) {
		const stepDeg = hand === 'minute' ? (minuteStep / 60) * 360 : 30;
		const currentAngle = hand === 'minute' ? angles.minuteAngle : angles.hourAngle;
		const nextAngle = (((currentAngle + direction * stepDeg) % 360) + 360) % 360;
		onchange(dragHand(hand, time, nextAngle, minuteStep));
	}

	function onKeyDown(hand: HandName, event: KeyboardEvent) {
		if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
			event.preventDefault();
			nudge(hand, 1);
		} else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
			event.preventDefault();
			nudge(hand, -1);
		}
	}

	const [hourX, hourY] = $derived(handPoint(angles.hourAngle, HOUR_HAND_LENGTH));
	const [minuteX, minuteY] = $derived(handPoint(angles.minuteAngle, MINUTE_HAND_LENGTH));
	let minuteDraggable = $derived(minuteStep < 60);

	const NUMBERS = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
	const NUMERAL_RADIUS = 35;
</script>

<svg
	bind:this={svgEl}
	viewBox="0 0 100 100"
	style:width={size}
	style:height={size}
	style:touch-action="none"
	style:cursor={draggingHand ? 'grabbing' : 'grab'}
	role="application"
	aria-label={label}
	class="clock-svg"
	onpointerdown={onPointerDown}
	onpointermove={onPointerMove}
	onpointerup={endDrag}
	onpointercancel={endDrag}
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

	<!--
		Hands are painted with a wide transparent halo so a thumb landing near one still
		reads as "on" it; the actual hand-vs-hand decision is made in pickHand() on
		pointerdown, so paint order here never traps a grab.
	-->
	<g class:active={draggingHand === 'hour'}>
		<line
			x1="50"
			y1="50"
			x2={hourX}
			y2={hourY}
			stroke="transparent"
			stroke-width="18"
			stroke-linecap="round"
		/>
		<line
			x1="50"
			y1="50"
			x2={hourX}
			y2={hourY}
			stroke="var(--color-clock-hour-hand)"
			stroke-width={draggingHand === 'hour' ? 6 : 4.8}
			stroke-linecap="round"
			role="slider"
			aria-label="Hour hand"
			aria-valuenow={time.hour % 12}
			aria-valuemin={0}
			aria-valuemax={11}
			tabindex="0"
			onkeydown={(e) => onKeyDown('hour', e)}
		/>
		<!-- Grabbing handle dot on hour hand tip -->
		<circle
			cx={hourX}
			cy={hourY}
			r={draggingHand === 'hour' ? 4 : 3}
			fill="var(--color-clock-hour-hand)"
		/>
	</g>

	{#if minuteDraggable}
		<g class:active={draggingHand === 'minute'}>
			<line
				x1="50"
				y1="50"
				x2={minuteX}
				y2={minuteY}
				stroke="transparent"
				stroke-width="18"
				stroke-linecap="round"
			/>
			<line
				x1="50"
				y1="50"
				x2={minuteX}
				y2={minuteY}
				stroke="var(--color-clock-minute-hand)"
				stroke-width={draggingHand === 'minute' ? 5 : 3.6}
				stroke-linecap="round"
				role="slider"
				aria-label="Minute hand"
				aria-valuenow={time.minute}
				aria-valuemin={0}
				aria-valuemax={59}
				tabindex="0"
				onkeydown={(e) => onKeyDown('minute', e)}
			/>
			<!-- Grabbing handle dot on minute hand tip -->
			<circle
				cx={minuteX}
				cy={minuteY}
				r={draggingHand === 'minute' ? 4 : 3}
				fill="var(--color-clock-minute-hand)"
			/>
		</g>
	{:else}
		<line
			x1="50"
			y1="50"
			x2={minuteX}
			y2={minuteY}
			stroke="var(--color-clock-minute-hand)"
			stroke-width="3.6"
			stroke-linecap="round"
		/>
	{/if}

	<!-- Center hub -->
	<circle cx="50" cy="50" r="4.5" fill="var(--color-clock-hour-hand)" />
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

	/*
	 * SVG focus rings render as a box around the whole hand, which looks like a glitch
	 * mid-drag. Suppress it for pointer focus and show a dashed hand for keyboard focus.
	 */
	line:focus {
		outline: none;
	}

	line:focus-visible {
		outline: none;
		stroke-dasharray: 4 2.5;
	}
</style>
