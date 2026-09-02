<script lang="ts">
	interface Props {
		size?: string;
	}

	let { size = '1.75rem' }: Props = $props();

	// 24 spokes of the Ashoka Chakra.
	const spokes = Array.from({ length: 24 }, (_, i) => i * 15);
</script>

<svg
	viewBox="0 0 36 24"
	style:width={size}
	style:height="calc({size} * 24 / 36)"
	class="flag"
	role="img"
	aria-label="India"
>
	<rect width="36" height="24" rx="3" fill="#ffffff" />
	<!-- Saffron top band -->
	<path d="M3 0h30a3 3 0 0 1 3 3v5H0V3a3 3 0 0 1 3-3z" fill="#ff9933" />
	<!-- Green bottom band -->
	<path d="M0 16h36v5a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3v-5z" fill="#138808" />
	<!-- Ashoka Chakra -->
	<circle cx="18" cy="12" r="3.4" fill="none" stroke="#000080" stroke-width="0.7" />
	<circle cx="18" cy="12" r="0.6" fill="#000080" />
	{#each spokes as angle (angle)}
		<line
			x1="18"
			y1="12"
			x2={18 + 3.4 * Math.cos((angle * Math.PI) / 180)}
			y2={12 + 3.4 * Math.sin((angle * Math.PI) / 180)}
			stroke="#000080"
			stroke-width="0.28"
		/>
	{/each}
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
