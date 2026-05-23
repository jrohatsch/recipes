import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join } from 'path';

const filesDir = './files';
const supportedFormats = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];

async function optimizeImages() {
	try {
		const files = await readdir(filesDir);
		
		for (const file of files) {
			const filePath = join(filesDir, file);
			const fileStats = await stat(filePath);
			
			if (!fileStats.isFile()) continue;
			
			const ext = file.substring(file.lastIndexOf('.')).toLowerCase();
			if (!supportedFormats.includes(ext)) continue;
			
			const beforeSize = fileStats.size;
			
			// Optimize the image
			await sharp(filePath)
				.resize(1200, 1200, {
					fit: 'inside',
					withoutEnlargement: true
				})
				.toFormat('webp', { quality: 80 })
				.toFile(filePath.replace(ext, '.webp'));
			
			// Also keep optimized version of original format
			if (ext === '.png') {
				await sharp(filePath)
					.resize(1200, 1200, {
						fit: 'inside',
						withoutEnlargement: true
					})
					.png({ quality: 80 })
					.toFile(filePath);
			} else if (['.jpg', '.jpeg'].includes(ext)) {
				await sharp(filePath)
					.resize(1200, 1200, {
						fit: 'inside',
						withoutEnlargement: true
					})
					.jpeg({ quality: 80 })
					.toFile(filePath);
			}
			
			const afterStats = await stat(filePath);
			const afterSize = afterStats.size;
			const reduction = ((1 - afterSize / beforeSize) * 100).toFixed(1);
			
			console.log(`✓ Optimized ${file} (${reduction}% reduction)`);
		}
		
		console.log('\n✅ Image optimization complete!');
	} catch (error) {
		console.error('Error optimizing images:', error);
		process.exit(1);
	}
}

optimizeImages();
