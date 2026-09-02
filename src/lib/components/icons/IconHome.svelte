<script lang="ts">
	interface Props {
		size?: string;
		color?: string;
	}

	let { size = '1.5rem', color = 'currentColor' }: Props = $props();
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
		d="M3 10.5L12 3L21 10.5V20C21 20.5523 20.5523 21 20 21H15C14.4477 21 14 20.5523 14 20V15C14 14.4477 13.5523 14 13 14H11C10.4477 14 10 14.4477 10 15V20C10 20.5523 9.55228 21 9 21H4C3.44772 21 3 20.5523 3 20V10.5Z"
		stroke-width="2.2"
		stroke-linecap="round"
		stroke-linejoin="round"
		fill="color-mix(in srgb, currentColor 15%, transparent)"
	/>
</svg>
