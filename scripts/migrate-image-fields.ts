import { getCliClient } from "sanity/cli"

interface SanityImage {
  _type: "image"
  asset?: { _type: "reference"; _ref: string }
  hotspot?: unknown
  crop?: unknown
}

interface ImageObject {
  imageName: string
  imageAlt: string
  imageFile: SanityImage
}

interface GalleryImageItem {
  _key: string
  _type: "galleryImage"
  image?: SanityImage
  imageFile?: SanityImage
  [field: string]: unknown
}

interface CardItem {
  _key: string
  heading?: string
  image?: SanityImage | ImageObject
  [field: string]: unknown
}

interface PageDocument {
  _id: string
  hero?: { background?: SanityImage | ImageObject; [field: string]: unknown }
  image?: SanityImage | ImageObject
  images?: GalleryImageItem[]
  belief?: CardItem[]
  whatWeDo?: { cards?: CardItem[]; [field: string]: unknown }
}

const client = getCliClient({ apiVersion: "2026-01-01" })

function isLegacyImage(value: unknown): value is SanityImage {
  return (
    typeof value === "object" &&
    value !== null &&
    (value as { _type?: string })._type === "image"
  )
}

// Wraps a bare Sanity image in the imageSchema object shape. Name and alt are
// seeded from existing copy where there is some, otherwise left for editors:
// Studio's required validation flags the empty alt text until it is filled in.
function wrapImage(
  value: SanityImage | ImageObject | undefined,
  imageName: string,
  imageAlt: string,
): ImageObject | undefined {
  return isLegacyImage(value)
    ? { imageName, imageAlt, imageFile: value }
    : (value as ImageObject | undefined)
}

function renameGalleryImageField(item: GalleryImageItem): GalleryImageItem {
  if (!item.image) return item
  const { image, ...rest } = item
  return { ...rest, imageFile: image }
}

function wrapCards(cards: CardItem[], fallbackName: string): CardItem[] {
  return cards.map((card, index) => ({
    ...card,
    image: wrapImage(
      card.image,
      card.heading || `${fallbackName} ${index + 1}`,
      card.heading ?? "",
    ),
  }))
}

function buildPatch(page: PageDocument): Record<string, unknown> {
  const patch: Record<string, unknown> = {}

  if (page.images?.some((item) => item.image)) {
    patch.images = page.images.map(renameGalleryImageField)
  }
  if (isLegacyImage(page.hero?.background)) {
    patch["hero.background"] = wrapImage(
      page.hero.background,
      "Hero background",
      "Skim Reapers Ltd",
    )
  }
  if (isLegacyImage(page.image)) {
    patch.image = wrapImage(page.image, "Home image", "")
  }
  if (page.belief?.some((card) => isLegacyImage(card.image))) {
    patch.belief = wrapCards(page.belief, "Belief image")
  }
  if (page.whatWeDo?.cards?.some((card) => isLegacyImage(card.image))) {
    patch["whatWeDo.cards"] = wrapCards(page.whatWeDo.cards, "Card icon")
  }
  return patch
}

async function migrateImageFields(): Promise<void> {
  const pages = await client.fetch<PageDocument[]>(
    `*[defined(hero) || defined(images) || defined(belief) || defined(whatWeDo) || defined(image)]{
      _id, hero, image, images, belief, whatWeDo
    }`,
  )

  for (const page of pages) {
    const patch = buildPatch(page)
    if (Object.keys(patch).length === 0) continue

    await client.patch(page._id).set(patch).commit()
    console.log(`Migrated ${Object.keys(patch).join(", ")} on ${page._id}`)
  }
}

migrateImageFields()
