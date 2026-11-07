import type { Author } from '#server/schema/author'
import { createError } from 'evlog'
import { authorSchema } from '#server/schema/author'

export default defineCachedEventHandler(async (event): Promise<Author> => {
  const log = useLogger(event)

  const { id } = await getValidatedRouterParams(event, authorSchema.pick({ id: true }).parse)

  log.set({
    author: { id },
  })

  let author
  try {
    author = await queryCollection(event, 'authors').select('name', 'url', 'stem').where('stem', '=', `authors/${id}`).first()
  }
  catch (error) {
    const cause = error instanceof Error
      ? error
      : new Error(String(error))

    log.error(cause, { step: 'queryCollection', collection: 'authors' })

    throw createError({
      status: 500,
      message: 'Failed to load author',
      why: 'The authors collection query failed',
      fix: 'Retry the request; if it persists, check the content database',
      cause,
    })
  }

  if (!author) {
    throw createError({
      status: 404,
      message: 'Author not found',
      why: `No author exists with id "${id}"`,
      fix: 'List valid authors at GET /authors and use one of the returned ids',
    })
  }

  const { stem, ...a } = author

  const result = {
    ...a,
    id: stem.slice(stem.lastIndexOf('/') + 1),
  }

  log.set({ author: result })

  return result
}, {
  swr: true,
  maxAge: 60 * 60 * 24,
})
