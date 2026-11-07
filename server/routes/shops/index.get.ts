import { createError } from 'evlog'
import { joinURL } from 'ufo'

export default defineEventHandler(async (event) => {
  const log = useLogger(event)
  const runtimeConfig = useRuntimeConfig()

  let shops
  try {
    shops = await queryCollection(event, 'shops')
      .select('name', 'stem', 'prefecture', 'photos')
      .all()
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
      message: 'Failed to load shops',
      why: 'The shops collection query failed',
      fix: 'Retry the request; if it persists, check the content database',
      cause,
    })
  }

  const result = shops.map(({ stem, ...shop }) => {
    const id = stem.split('/').pop()!

    const photos = shop.photos?.map(({ name, ...it }) => ({
      ...it,
      url: joinURL(runtimeConfig.siteUrl, 'shops', id, name),
    }))

    return {
      ...shop,
      photos,
      id,
    }
  })

  log.set({
    shops: {
      count: result.length,
      photos: result.reduce((total, shop) => total + (shop.photos?.length ?? 0), 0),
    },
  })

  return result
})
