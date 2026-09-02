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
	aria-label="Québec"
>
	<!-- Blue field -->
	<rect width="36" height="24" rx="3" fill="#003399" />

	<!-- White cross -->
	<rect x="16" y="0" width="4" height="24" fill="#ffffff" />
	<rect x="0" y="10" width="36" height="4" fill="#ffffff" />

	<!-- 4 Fleur-de-lys in cantons -->
	<!-- Canton 1 (top-left) -->
	<g transform="translate(8, 5) scale(0.42)">
		<path
			d="M0 -7C-1 -4 -2 -2 0 1C-1 1 -3 -1 -4 -2C-4 0 -2 2 -1 3C-3 3 -4 2 -5 1C-5 4 -3 5 -1 5L-1 6C-2 6 -3 5 -3 7C0 7 0 6 1 6L1 5C3 5 5 4 5 1C4 2 3 3 1 3C2 2 4 0 4 -2C3 -1 1 1 0 1C2 -2 1 -4 0 -7Z"
			fill="#ffffff"
		/>
	</g>
	<!-- Canton 2 (top-right) -->
	<g transform="translate(28, 5) scale(0.42)">
		<path
			d="M0 -7C-1 -4 -2 -2 0 1C-1 1 -3 -1 -4 -2C-4 0 -2 2 -1 3C-3 3 -4 2 -5 1C-5 4 -3 5 -1 5L-1 6C-2 6 -3 5 -3 7C0 7 0 6 1 6L1 5C3 5 5 4 5 1C4 2 3 3 1 3C2 2 4 0 4 -2C3 -1 1 1 0 1C2 -2 1 -4 0 -7Z"
			fill="#ffffff"
		/>
	</g>
	<!-- Canton 3 (bottom-left) -->
	<g transform="translate(8, 19) scale(0.42)">
		<path
			d="M0 -7C-1 -4 -2 -2 0 1C-1 1 -3 -1 -4 -2C-4 0 -2 2 -1 3C-3 3 -4 2 -5 1C-5 4 -3 5 -1 5L-1 6C-2 6 -3 5 -3 7C0 7 0 6 1 6L1 5C3 5 5 4 5 1C4 2 3 3 1 3C2 2 4 0 4 -2C3 -1 1 1 0 1C2 -2 1 -4 0 -7Z"
			fill="#ffffff"
		/>
	</g>
	<!-- Canton 4 (bottom-right) -->
	<g transform="translate(28, 19) scale(0.42)">
		<path
			d="M0 -7C-1 -4 -2 -2 0 1C-1 1 -3 -1 -4 -2C-4 0 -2 2 -1 3C-3 3 -4 2 -5 1C-5 4 -3 5 -1 5L-1 6C-2 6 -3 5 -3 7C0 7 0 6 1 6L1 5C3 5 5 4 5 1C4 2 3 3 1 3C2 2 4 0 4 -2C3 -1 1 1 0 1C2 -2 1 -4 0 -7Z"
			fill="#ffffff"
		/>
	</g>
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
