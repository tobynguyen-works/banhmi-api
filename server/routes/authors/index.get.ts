import type { Author } from '#server/schema/author'
import { createError } from 'evlog'

export default defineCachedEventHandler(async (event): Promise<Author[]> => {
  const log = useLogger(event)

  let authors
  try {
    authors = await queryCollection(event, 'authors')
      .select('name', 'url', 'stem')
      .all()
  }
  catch (error) {
    const cause = error instanceof Error
      ? error
      : new Error(String(error))

    log.error(cause, { step: 'queryCollection', collection: 'authors' })

    throw createError({
      status: 500,
      message: 'Failed to load authors',
      why: 'The authors collection query failed',
      fix: 'Retry the request; if it persists, check the content database',
      cause,
    })
  }

  const result = authors.map(({ name, url, stem }) => ({
    name,
    url,
    id: stem.slice(stem.lastIndexOf('/') + 1),
  }))

  log.set({
    authors: { count: result.length },
  })

  return result
}, {
  swr: true,
  maxAge: 60 * 60 * 24,
})
