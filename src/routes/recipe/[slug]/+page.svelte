<script lang="ts">
	import { base } from '$app/paths';
	
	let { data } = $props();
</script>

<svelte:head>
	<title>{data.title} - Recipes</title>
</svelte:head>

<div class="container">
	<a href={base || '/'} class="back-link"><i class="fa-solid fa-arrow-left"></i> Zurück zu den Rezepten</a>
	
	<article>
		<header>
			<h1>{data.title}</h1>
			<p class="date">
				{new Date(data.date).toLocaleDateString('en-US', {
					year: 'numeric',
					month: 'long',
					day: 'numeric'
				})}
			</p>
		</header>

		<div class="recipe-content">
			{@html data.body}
		</div>
	</article>
</div>

<style>
	.container {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}

	.back-link {
		display: inline-block;
		margin-bottom: 2rem;
		color: #7a7a7a;
		text-decoration: none;
		font-size: 0.95rem;
		transition: color 0.2s;
	}

	.back-link:hover {
		color: #3d3d3d;
	}

	article {
		background: #fafaf7;
		padding: 2.5rem;
		border: 1px solid #e8e6e1;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
	}

	header {
		margin-bottom: 2rem;
		border-bottom: 2px solid #e8e6e1;
		padding-bottom: 1.5rem;
	}

	h1 {
		margin: 0;
		font-size: 2rem;
		color: #3d3d3d;
		font-weight: 600;
	}

	.date {
		margin: 0.5rem 0 0 0;
		color: #a09a94;
		font-size: 0.9rem;
	}

	.recipe-content {
		color: #3d3d3d;
		line-height: 1.7;
		font-size: 1rem;
	}

	:global(.recipe-content h2) {
		font-size: 1.4rem;
		color: #3d3d3d;
		margin: 1.5rem 0 1rem 0;
		font-weight: 600;
	}

	:global(.recipe-content h3) {
		font-size: 1.1rem;
		color: #3d3d3d;
		margin: 1.2rem 0 0.8rem 0;
		font-weight: 600;
	}

	:global(.recipe-content strong) {
		font-weight: 600;
		color: #2d2d2d;
	}

	:global(.recipe-content ul),
	:global(.recipe-content ol) {
		margin: 1rem 0;
		padding-left: 1.5rem;
	}

	:global(.recipe-content li) {
		margin: 0.5rem 0;
		list-style: inherit;
	}

	:global(.recipe-content figure) {
		margin: 1.5rem 0;
		text-align: center;
	}

	:global(.recipe-content img) {
		max-width: 100%;
		height: auto;
		border-radius: 6px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	:global(.recipe-content br) {
		display: none;
	}
</style>
