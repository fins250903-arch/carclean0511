import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/index.{md,mdx}' }),
	schema: () =>
		z.object({
			title: z.string(),
			description: z.string().optional(),
			date: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			coverImage: z.string().optional(),
			categories: z.array(z.string()).optional(),
		}),
});

export const collections = { blog };
