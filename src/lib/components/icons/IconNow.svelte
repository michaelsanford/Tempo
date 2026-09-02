<script lang="ts">
	interface Props {
		size?: string;
		color?: string;
	}

	let { size = '2rem', color = 'currentColor' }: Props = $props();
</script>

<svg
	viewBox="0 0 24 24"
	style:width={size}
	style:height={size}
	style:fill="none"
	style:stroke={color}
	role="img"
	aria-hidden="true"
>
	<!-- Stopwatch body -->
	<circle
		cx="12"
		cy="13"
		r="8"
		stroke-width="2.2"
		fill="color-mix(in srgb, currentColor 15%, transparent)"
	/>
	<path d="M12 9V13L15 13" stroke-width="2.5" stroke-linecap="round" />
	<!-- Top button -->
	<path d="M12 5V2" stroke-width="2.5" stroke-linecap="round" />
	<path d="M10 2H14" stroke-width="2.5" stroke-linecap="round" />
	<!-- Side button -->
	<path d="M18 7L19.5 5.5" stroke-width="2.2" stroke-linecap="round" />
</svg>
