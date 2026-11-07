import { createError } from 'evlog'

export default defineEventHandler(async (event) => {
  const log = useLogger(event)

  const id = getRouterParam(event, 'id')

  log.set({
    author: { id },
  })

  let author
  try {
    author = await queryCollection(event, 'authors')
      .select('name', 'url', 'stem')
      .where('stem', '=', `authors/${id}`)
      .first()
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
      why: 'Author ID does not exist',
      fix: 'List valid authors at GET /authors and use one of the returned ids',
    })
  }

  const result = {
    id: author.stem.split('/').pop(),
    name: author.name,
    url: author.url,
  }

  log.set({ author: result })

  return result
})
