import { z } from 'zod/v4'

export const authorSchema = z.object({
  id: z.string(),
  name: z.string(),
  url: z.url(),
})

export type Author = z.infer<typeof authorSchema>
