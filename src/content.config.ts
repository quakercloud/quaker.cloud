import { defineCollection, z } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
	docs: defineCollection({
		loader: docsLoader(),
		schema: docsSchema({
			extend: z.object({
				version: z.string().optional(),
				specStatus: z.string().optional(),
				publishDate: z.coerce.date().optional(),
				lastModified: z.coerce.date().optional(),
				namespace: z.string().optional(),
			}),
		}),
	}),
};
