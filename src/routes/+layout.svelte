<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="layout">
	{@render children()}
</div>

<style>
	:global(*) {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	:global(body) {
		background-color: #f9f7f3;
		color: #3d3d3d;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue',
			Arial, sans-serif;
		line-height: 1.6;
		font-size: 16px;
		font-weight: 400;
	}

	:global(a) {
		color: #6b5b4f;
		text-decoration: underline;
		transition: color 0.2s;
	}

	:global(a:hover) {
		color: #3d3d3d;
	}

	.layout {
		min-height: 100vh;
		background: linear-gradient(135deg, #fafaf7 0%, #f5f3ed 100%);
	}
</style>
