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
	aria-label="France"
>
	<rect width="36" height="24" rx="3" fill="#ffffff" />
	<!-- Blue left third -->
	<rect width="12" height="24" rx="3" fill="#002395" />
	<rect width="3" height="24" x="9" fill="#002395" />
	<!-- Red right third -->
	<rect x="24" width="12" height="24" rx="3" fill="#ed2939" />
	<rect x="24" width="3" height="24" fill="#ed2939" />
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
