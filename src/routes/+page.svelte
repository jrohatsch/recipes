<script lang="ts">
	import { base } from '$app/paths';
	
	interface Recipe {
		title: string;
		date: string;
		slug: string;
		body: string;
	}

	
	let { data } = $props();
	const allRecipes: Recipe[] = data.recipes;
	let searchQuery = $state('');

	function extractMatchingLines(text: string, query: string, limit: number = 2): string[] {
		const queryLower = query.toLowerCase();
		const lines = text.split('\n');
		const matching: string[] = [];

		for (const line of lines) {
			if (line.toLowerCase().includes(queryLower) && line.trim().length > 0) {
				// Remove markdown formatting for display
				const cleanedLine = line
					.replace(/^\*+\s*/, '')
					.replace(/\*+$/g, '')
					.replace(/^#+\s+/, '')
					.replace(/!\[.*?\]\(.*?\)/g, '')
					.trim();
				
				if (cleanedLine && !matching.includes(cleanedLine)) {
					matching.push(cleanedLine);
				}

				if (matching.length >= limit) break;
			}
		}

		return matching;
	}

	let filteredRecipes = $derived.by(() => {
		if (searchQuery.trim() === '') {
			return allRecipes.map(recipe => ({
				...recipe,
				matchingLines: []
			}));
		}

		const query = searchQuery.toLowerCase();
		return allRecipes
			.filter(recipe => {
				return (
					recipe.title.toLowerCase().includes(query) ||
					recipe.body.toLowerCase().includes(query)
				);
			})
			.map(recipe => ({
				...recipe,
				matchingLines:
					recipe.title.toLowerCase().includes(query)
						? []
						: extractMatchingLines(recipe.body, searchQuery)
			}));
	});
</script>

<div class="container">
	<header>
		<h1>Rezeptebuch</h1>
		<p class="subtitle">Eine kleine Sammlung an Lieblingsrezepten</p>
		
		<div class="search-container">
			<input
				type="text"
				class="search-input"
				placeholder="Rezepte durchsuchen..."
				bind:value={searchQuery}
				aria-label="Search recipes"
			/>
			<span class="search-icon"><i class="fa fa-search" aria-hidden="true"></i></span>
		</div>
	</header>

	<main>
		{#if filteredRecipes.length > 0}
			<div class="recipes-grid">
				{#each filteredRecipes as recipe (recipe.slug)}
					<a href={`${base}/recipe/${recipe.slug}`} class="recipe-card">
						<h2>{recipe.title}</h2>
						{#if recipe.matchingLines.length > 0}
							<div class="matching-lines">
								{#each recipe.matchingLines as line}
									<p class="match-snippet">{line}</p>
								{/each}
							</div>
						{/if}
						<p class="date">
							{new Date(recipe.date).toLocaleDateString('en-US', {
								year: 'numeric',
								month: 'long',
								day: 'numeric'
							})}
						</p>
					</a>
				{/each}
			</div>
		{:else if searchQuery.trim() !== ''}
			<p class="empty">No recipes found matching "{searchQuery}"</p>
		{:else}
			<p class="empty">No recipes found</p>
		{/if}
	</main>
</div>

<style>
	.container {
		max-width: 900px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}

	header {
		text-align: center;
		margin-bottom: 3rem;
	}

	h1 {
		font-size: 2.5rem;
		color: #3d3d3d;
		margin: 0;
		font-weight: 600;
	}

	.subtitle {
		color: #8b8b8b;
		font-size: 1rem;
		margin: 0.5rem 0 0 0;
		font-weight: 300;
	}

	.search-container {
		position: relative;
		margin-top: 1.5rem;
		max-width: 400px;
		margin-left: auto;
		margin-right: auto;
	}

	.search-input {
		width: 100%;
		padding: 0.75rem 2.5rem 0.75rem 1rem;
		font-size: 0.95rem;
		border: 1px solid #e8e6e1;
		border-radius: 6px;
		background: #fafaf7;
		color: #3d3d3d;
		transition: all 0.2s ease;
		font-family: inherit;
	}

	.search-input:focus {
		outline: none;
		border-color: #d4d0c8;
		background: #fff;
		box-shadow: 0 0 0 3px rgba(212, 208, 200, 0.1);
	}

	.search-input::placeholder {
		color: #a09a94;
	}

	.search-icon {
		position: absolute;
		right: 0.75rem;
		top: 50%;
		transform: translateY(-50%);
		font-size: 1rem;
		pointer-events: none;
	}

	main {
		padding-bottom: 2rem;
	}

	.recipes-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: 1.5rem;
	}

	.recipe-card {
		display: block;
		padding: 1.5rem;
		background: #fafaf7;
		border: 1px solid #e8e6e1;
		border-radius: 6px;
		text-decoration: none;
		color: #3d3d3d;
		transition: all 0.3s ease;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
	}

	.recipe-card:hover {
		background: #f5f3ed;
		border-color: #d4d0c8;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		transform: translateY(-2px);
	}

	.recipe-card h2 {
		margin: 0;
		font-size: 1.3rem;
		font-weight: 600;
		color: #3d3d3d;
	}

	.matching-lines {
		margin: 0.75rem 0;
		padding: 0.75rem;
		background: #f5f3ed;
		border-left: 3px solid #d4d0c8;
		border-radius: 3px;
	}

	.match-snippet {
		margin: 0.35rem 0;
		font-size: 0.85rem;
		color: #6b5b4f;
		line-height: 1.4;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.date {
		margin: 0.75rem 0 0 0;
		font-size: 0.85rem;
		color: #a09a94;
	}

	.empty {
		text-align: center;
		color: #8b8b8b;
		padding: 2rem;
	}
</style>
