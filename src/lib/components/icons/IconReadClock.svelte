<script lang="ts">
	interface Props {
		size?: string;
		color?: string;
	}

	let { size = '2.5rem', color = 'currentColor' }: Props = $props();
</script>

<svg
	viewBox="0 0 48 48"
	style:width={size}
	style:height={size}
	style:fill="none"
	style:stroke={color}
	role="img"
	aria-hidden="true"
>
	<!-- Magnifying glass frame -->
	<circle
		cx="21"
		cy="21"
		r="14"
		stroke-width="3.5"
		fill="color-mix(in srgb, currentColor 12%, transparent)"
	/>
	<path d="M31 31L42 42" stroke-width="4" stroke-linecap="round" />

	<!-- Mini clock face inside lens -->
	<circle cx="21" cy="21" r="9" stroke-width="2" stroke-dasharray="1.5 3" />
	<!-- Clock hands pointing to 3:00 -->
	<path d="M21 21V16" stroke-width="2.5" stroke-linecap="round" />
	<path d="M21 21H26" stroke-width="2.5" stroke-linecap="round" />
	<circle cx="21" cy="21" r="1.5" fill={color} />

	<!-- Little sparkle stars -->
	<path d="M38 10L39 13L42 14L39 15L38 18L37 15L34 14L37 13Z" fill={color} stroke="none" />
</svg>
