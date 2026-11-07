import { defineCollection, defineContentConfig } from '@nuxt/content'
import { z } from 'zod/v4'

const authorSchema = z.object({
  name: z.string(),
  url: z.string().url(),
})

const shopSchema = z.object({
  id: z.string().regex(/^[\w-]+$/),
  name: z.optional(z.string()),
  prefecture: z.optional(z.string()),
  photos: z.optional(z.array(z.object({
    name: z.string(),
    width: z.number().min(1),
    height: z.number().min(1),
    authorId: z.optional(z.string().regex(/^[\w-]+$/)),
  }))),
})

export default defineContentConfig({
  collections: {
    authors: defineCollection({
      type: 'data',
      source: 'authors/*.json',
      schema: authorSchema,
    }),
    shops: defineCollection({
      type: 'data',
      source: 'shops/*.json',
      schema: shopSchema,
    }),
  },
})
