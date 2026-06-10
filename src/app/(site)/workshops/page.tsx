import type { Metadata } from 'next'
import { db } from '@/lib/db'
import { workshops } from '@/lib/db/schema'
import { eq, asc } from 'drizzle-orm'
import WorkshopsClient, { type PublicWorkshop } from '@/components/WorkshopsClient'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Workshops — Neelakar Creative House',
  description:
    'Hands-on photography, videography, and branding workshops by Neelakar Creative House. Learn the craft from working professionals.',
  openGraph: {
    title: 'Workshops — Neelakar Creative House',
    description:
      'Hands-on photography, videography, and branding workshops. Learn the craft from working professionals.',
  },
}

export default async function WorkshopsPage() {
  let items: PublicWorkshop[] = []
  try {
    const rows = await db
      .select()
      .from(workshops)
      .where(eq(workshops.isActive, true))
      .orderBy(asc(workshops.startDate))
    items = rows.map(w => ({
      id: w.id,
      title: w.title,
      category: w.category,
      description: w.description,
      dateDisplay: w.dateDisplay,
      location: w.location,
      duration: w.duration,
      level: w.level,
      priceDisplay: w.priceDisplay,
      spotsLeft: Math.max(0, w.totalSpots - w.spotsFilled),
      totalSpots: w.totalSpots,
      instructor: w.instructor,
      highlight: w.highlight,
    }))
  } catch (err) {
    console.error('Failed to load workshops:', err)
  }

  return <WorkshopsClient workshops={items} />
}
