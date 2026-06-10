import { db } from '@/lib/db'
import { portfolioItems } from '@/lib/db/schema'
import { eq, and, asc } from 'drizzle-orm'
import VideographyClient, { type VideoProject } from '@/components/production/VideographyClient'

export const dynamic = 'force-dynamic'

// Placeholder slides until real film stills are added in the admin CMS
const FALLBACK: VideoProject[] = [
  { title: ['The Greatest', 'Love Story'], category: 'Feature Documentary', client: 'Amazon Originals', image: 'https://picsum.photos/id/1015/1920/1080' },
  { title: ['Shadows of', 'Tomorrow'], category: 'Commercial', client: 'Nike India', image: 'https://picsum.photos/id/1018/1920/1080' },
  { title: ['Silent', 'Rebellion'], category: 'Music Video', client: 'Universal Music', image: 'https://picsum.photos/id/1035/1920/1080' },
  { title: ['Golden', 'Hour'], category: 'Fashion Film', client: 'Vogue India', image: 'https://picsum.photos/id/1036/1920/1080' },
  { title: ['Between the', 'Lines'], category: 'Short Film', client: 'MUBI Originals', image: 'https://picsum.photos/id/1039/1920/1080' },
  { title: ['Eternal', 'Bloom'], category: 'Brand Film', client: 'Tanishq', image: 'https://picsum.photos/id/1043/1920/1080' },
  { title: ['Raw', 'Elegance'], category: 'Editorial', client: "Harper's Bazaar", image: 'https://picsum.photos/id/1044/1920/1080' },
  { title: ['City of', 'Dreams'], category: 'Documentary', client: 'Netflix India', image: 'https://picsum.photos/id/1049/1920/1080' },
]

// Split a one-line title into the two halves displayed left and right of the player
function splitTitle(title: string): [string, string] {
  const words = title.trim().split(/\s+/)
  if (words.length < 2) return [title, '']
  const mid = Math.ceil(words.length / 2)
  return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')]
}

export default async function VideographyPage() {
  let projects: VideoProject[] = []

  try {
    const items = await db
      .select()
      .from(portfolioItems)
      .where(and(eq(portfolioItems.context, 'videography'), eq(portfolioItems.isActive, true)))
      .orderBy(asc(portfolioItems.sortOrder))
    if (items.length >= 3) {
      projects = items.map(i => ({
        title: splitTitle(i.title),
        category: i.category,
        client: i.subtitle || 'Neelakar Creative House',
        image: i.imageUrl,
      }))
    }
  } catch (err) {
    console.error('Failed to load videography portfolio:', err)
  }

  if (projects.length === 0) projects = FALLBACK

  return <VideographyClient projects={projects} />
}
