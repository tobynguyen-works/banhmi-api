import { defineCollection, defineContentConfig } from '@nuxt/content'
import { authorSchema } from './server/schema/author'
import { shopSchema } from './server/schema/shop'

export default defineContentConfig({
  collections: {
    authors: defineCollection({
      type: 'data',
      source: 'authors/*.json',
      schema: authorSchema.omit({ id: true }),
    }),
    shops: defineCollection({
      type: 'data',
      source: 'shops/*/info.json',
      schema: shopSchema.omit({ id: true }),
    }),
  },
})
