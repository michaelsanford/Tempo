<script lang="ts">
	interface Props {
		size?: string;
	}

	let { size = '1.75rem' }: Props = $props();
</script>

<svg
	viewBox="0 0 36 24"
	style:width={size}
	style:height="calc({size} * 24 / 36)"
	class="flag"
	role="img"
	aria-label="Canada"
>
	<rect width="36" height="24" rx="3" fill="#ffffff" />
	<!-- Red side bands -->
	<rect width="9" height="24" rx="3" fill="#d80027" />
	<rect width="3" height="24" x="6" fill="#d80027" />
	<rect x="27" width="9" height="24" rx="3" fill="#d80027" />
	<rect x="27" width="3" height="24" fill="#d80027" />
	<!-- Maple leaf -->
	<path
		d="M18 5.5L19.2 9.2L22.2 8.4L21.4 11.2L24.5 12.8L22.2 14.5L23.2 17.5L20.2 16.5L18.7 18.5L18.5 21H17.5L17.3 18.5L15.8 16.5L12.8 17.5L13.8 14.5L11.5 12.8L14.6 11.2L13.8 8.4L16.8 9.2Z"
		fill="#d80027"
	/>
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
