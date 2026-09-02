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
	<path
		d="M5 12H19M19 12L13 6M19 12L13 18"
		stroke-width="3"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
</svg>
