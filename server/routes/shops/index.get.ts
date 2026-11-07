import type { Shop } from '#server/schema/shop'
import { joinURL } from 'ufo'

export default defineCachedEventHandler(async (event): Promise<Shop[]> => {
  const { siteUrl } = useRuntimeConfig()

  const shops = await queryCollection(event, 'shops')
    .select('name', 'prefecture', 'stem', 'photos')
    .all()

  return shops.map(({ stem, photos, ...shop }) => ({
    ...shop,
    id: stem.split('/')[1]!,
    photos: photos?.map(photo => ({
      ...photo,
      name: joinURL(siteUrl, photo.name),
    })),
  }))
}, {
  swr: true,
  maxAge: 60 * 60 * 24,
})
