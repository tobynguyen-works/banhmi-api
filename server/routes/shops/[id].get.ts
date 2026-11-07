import { createError } from 'evlog'

export default defineEventHandler(async (event) => {
  const log = useLogger(event)

  const id = getRouterParam(event, 'id')

  log.set({
    shop: { id },
  })

  let shop
  try {
    shop = await queryCollection(event, 'shops')
      .select('name', 'stem', 'prefecture', 'photos')
      .where('stem', '=', `shops/${id}`)
      .first()
  }
  catch (error) {
    const cause = error instanceof Error
      ? error
      : new Error(String(error))

    log.set({
      failure: { step: 'queryCollection', collection: 'shops' },
    })
    log.error(cause)

    throw createError({
      status: 500,
      message: 'Failed to load shop',
      why: 'The shops collection query failed',
      fix: 'Retry the request; if it persists, check the content database',
      cause,
    })
  }

  if (!shop) {
    throw createError({
      status: 404,
      message: 'Shop not found',
      why: 'Shop ID does not exist',
      fix: 'List valid shops at GET /shops and use one of the returned ids',
    })
  }

  const result = {
    ...shop,
    id: shop.stem.split('/').pop(),
  }

  log.set({
    shop: {
      id: result.id,
      name: result.name,
      prefecture: result.prefecture,
      photos: result.photos?.length ?? 0,
    },
  })

  return result
})
