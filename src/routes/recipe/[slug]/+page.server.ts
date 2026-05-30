import { readFile } from 'fs/promises';
import { join } from 'path';
import { error } from '@sveltejs/kit';
import { markdown } from 'markdown';

export async function load({ params }) {
	const { slug } = params;
	const recipePath = join(process.cwd(), 'files', `${slug}.md`);
	
	try {
		const content = await readFile(recipePath, 'utf-8');

		const frontmatterMatch = content.match(/^\+\+\+\n([\s\S]*?)\n\+\+\+/);
		let title = '';
		let date = '';
		
		if (frontmatterMatch) {
			const lines = frontmatterMatch[1].split('\n');
			for (const line of lines) {
				if (line.startsWith('title')) {
					title = line.split('=')[1]?.trim().replace(/^['"]|['"]$/g, '');
				}
				if (line.startsWith('date')) {
					date = line.split('=')[1]?.trim().replace(/^['"]|['"]$/g, '');
				}
			}
		}
		
		// Extract body (everything after frontmatter)
		const bodyStart = content.indexOf('+++', 4) + 3;
		const body = content.substring(bodyStart).trim();
		const htmlBody = markdown.toHTML(body);
		
		return {
			title,
			date,
			body: htmlBody,
			slug
		};
	} catch (err) {
		error(404, 'Recipe not found');
	}
}
