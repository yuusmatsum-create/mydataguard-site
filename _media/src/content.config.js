import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { CATEGORIES, CAUSES } from './lib/validate.js';

const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: z.object({
    title: z.string(),
    category: z.enum(Object.keys(CATEGORIES)),
    summary: z.string().max(160),
    insight: z.string().optional(),
    actions: z.array(z.string()).default([]),
    priority: z.enum(['now', 'week', 'planned']).optional(),
    facts: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    cause: z.enum(Object.keys(CAUSES)).optional(),
    tags: z.array(z.string()).default([]),
    sources: z.array(z.object({ title: z.string(), url: z.string(), date: z.string().optional() })),
    corrections: z.array(z.object({ date: z.string(), note: z.string() })).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { news };
