import { createError } from 'evlog'

export default defineEventHandler(async (event) => {
  const log = useLogger(event)

  let authors
  try {
    authors = await queryCollection(event, 'authors')
      .select('id', 'name', 'url', 'stem')
      .all()
  }
  catch (error) {
    const cause = error instanceof Error
      ? error
      : new Error(String(error))

    log.set({
      failure: { step: 'queryCollection', collection: 'authors' },
    })
    log.error(cause)

    throw createError({
      status: 500,
      message: 'Failed to load authors',
      why: 'The authors collection query failed',
      fix: 'Retry the request; if it persists, check the content database',
      cause,
    })
  }

  const result = authors.map(({ stem, ...author }) => {
    const id = stem.split('/').pop()

    return {
      ...author,
      id,
    }
  })

  log.set({
    authors: { count: result.length },
  })

  return result
})
