import type { Shop } from '#server/schema/shop'
import { createError } from 'evlog'
import { joinURL } from 'ufo'
import { shopSchema } from '#server/schema/shop'

export default defineEventHandler(async (event): Promise<Shop> => {
  const log = useLogger(event)
  const { siteUrl } = useRuntimeConfig()

  const { id } = await getValidatedRouterParams(event, shopSchema.pick({ id: true }).parse)

  log.set({
    shop: { id },
  })

  let shop
  try {
    shop = await queryCollection(event, 'shops')
      .select('name', 'prefecture', 'stem', 'photos')
      .where('stem', '=', `shops/${id}/info`)
      .first()
  }
  catch (error) {
    const cause = error instanceof Error
      ? error
      : new Error(String(error))

    log.error(cause, { step: 'queryCollection', collection: 'shops' })

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
      why: `No shop exists with id "${id}"`,
      fix: 'List valid shops at GET /shops and use one of the returned ids',
    })
  }

  const { stem, photos, ...b } = shop

  const result = {
    ...b,
    id: stem.split('/')[1]!,
    photos: photos?.map(photo => ({
      ...photo,
      name: joinURL(siteUrl, photo.name),
    })),
  }

  log.set({
    shop: { id: result.id, photos: result.photos?.length ?? 0 },
  })

  return result
})
