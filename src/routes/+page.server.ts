import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

interface RecipeMeta {
	title: string;
	date: string;
	slug: string;
	body: string;
}

export async function load() {
	const recipesDir = join(process.cwd(), 'files');
	const files = await readdir(recipesDir);
	
	const recipes: RecipeMeta[] = [];
	
	for (const file of files.filter(f => f.endsWith('.md'))) {
		const content = await readFile(join(recipesDir, file), 'utf-8');
		
		// Parse TOML frontmatter
		const frontmatterMatch = content.match(/^\+\+\+\n([\s\S]*?)\n\+\+\+/);
		if (frontmatterMatch) {
			const tomlString = frontmatterMatch[1];
			const lines = tomlString.split('\n');
			
			let title = '';
			let date = '';
			
			for (const line of lines) {
				if (line.startsWith('title')) {
					title = line.split('=')[1]?.trim().replace(/^['"]|['"]$/g, '');
				}
				if (line.startsWith('date')) {
					date = line.split('=')[1]?.trim().replace(/^['"]|['"]$/g, '');
				}
			}
			
			// Extract body (everything after frontmatter)
			const bodyStart = content.indexOf('+++', 4) + 3;
			const body = content.substring(bodyStart).trim();
			
			recipes.push({
				title: title || file.replace('.md', ''),
				date,
				slug: file.replace('.md', ''),
				body
			});
		}
	}
	
	// Sort by date descending
	recipes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
	
	return { recipes };
}
