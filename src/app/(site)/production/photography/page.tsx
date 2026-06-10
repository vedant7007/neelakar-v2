import { db } from '@/lib/db'
import { portfolioItems } from '@/lib/db/schema'
import { eq, and, asc } from 'drizzle-orm'
import PhotographyClient from '@/components/PhotographyClient'

export const dynamic = 'force-dynamic'

const PICSUM_IDS = [10, 17, 22, 27, 33, 39, 42, 49, 55, 64, 76, 83, 91, 96, 103, 110, 119, 137, 142, 160]

export default async function PhotographyPage() {
  let orbitImages: string[] = []
  let bgImages: string[] = []

  try {
    const items = await db
      .select({ imageUrl: portfolioItems.imageUrl })
      .from(portfolioItems)
      .where(and(eq(portfolioItems.context, 'photography'), eq(portfolioItems.isActive, true)))
      .orderBy(asc(portfolioItems.sortOrder))
    if (items.length >= 8) {
      orbitImages = items.map(i => i.imageUrl)
      bgImages = items.map(i => i.imageUrl)
    }
  } catch (err) {
    console.error('Failed to load photography portfolio:', err)
  }

  // Placeholder set until real portfolio images are added in the admin CMS
  if (orbitImages.length === 0) {
    orbitImages = PICSUM_IDS.map((id) => `https://picsum.photos/id/${id}/400/500`)
    bgImages = PICSUM_IDS.map((id) => `https://picsum.photos/id/${id}/1200/1600`)
  }

  return <PhotographyClient orbitImages={orbitImages} bgImages={bgImages} />
}
