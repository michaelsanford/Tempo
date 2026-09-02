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
		d="M12 3v12m0 0l4-4m-4 4l-4-4"
		stroke-width="2.5"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
	<path
		d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2"
		stroke-width="2.5"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
</svg>
