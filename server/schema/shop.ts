import { z } from 'zod/v4'

export const shopSchema = z.object({
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

export type Shop = z.infer<typeof shopSchema>
