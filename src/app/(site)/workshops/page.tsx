import type { Metadata } from 'next'
import { db } from '@/lib/db'
import { workshops, testimonials } from '@/lib/db/schema'
import { eq, and, asc } from 'drizzle-orm'
import WorkshopsClient, { type PublicWorkshop, type WorkshopReview } from '@/components/workshops/WorkshopsClient'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Workshops — Neelakar Creative House',
  description:
    'Hands-on photography, videography, and branding workshops by Neelakar Creative House. Learn the craft from working professionals in small cohorts.',
  openGraph: {
    title: 'Workshops — Neelakar Creative House',
    description:
      'Hands-on photography, videography, and branding workshops. Learn the craft from working professionals in small cohorts.',
  },
}

// Sample programme shown only with ?preview=1 when the DB has no workshops yet —
// lets the design be reviewed before real sessions are created in the admin CMS.
const PREVIEW: PublicWorkshop[] = [
  { id: 'preview-1', title: 'Cinematic Photography Masterclass', category: 'Photography', description: 'The art of cinematic storytelling through stills — composition, light, and the grade. Two days in the studio with a working fashion photographer.', dateDisplay: 'Jun 14–15, 2026', location: 'Neelakar Studio, Hyderabad', duration: '2 Days', level: 'Intermediate', priceDisplay: '₹4,999', spotsLeft: 8, totalSpots: 30, instructor: 'Arjun Kapoor', highlight: true },
  { id: 'preview-2', title: 'Brand Identity Design Sprint', category: 'Branding', description: 'Build a complete identity from scratch — logo, type system, palette, and brand book — in a fast, hands-on weekend.', dateDisplay: 'Jul 5–6, 2026', location: 'Online (Zoom)', duration: '2 Days', level: 'Beginner', priceDisplay: '₹3,499', spotsLeft: 4, totalSpots: 40, instructor: 'Priya Mehta', highlight: false },
  { id: 'preview-3', title: 'Short Film Production Bootcamp', category: 'Film', description: 'From script to screen in three days. Cinematography, directing, and the fundamentals of post-production.', dateDisplay: 'Aug 8–10, 2026', location: 'Neelakar Studio, Hyderabad', duration: '3 Days', level: 'Intermediate', priceDisplay: '₹7,999', spotsLeft: 12, totalSpots: 20, instructor: 'Rohan Deshmukh', highlight: false },
  { id: 'preview-4', title: 'Social Content Creation', category: 'Film', description: 'Scroll-stopping reels, stories, and posts — photo, video, and design for Instagram and YouTube.', dateDisplay: 'Sep 12, 2026', location: 'Online (Zoom)', duration: '1 Day', level: 'Beginner', priceDisplay: '₹1,999', spotsLeft: 0, totalSpots: 60, instructor: 'Sneha Joshi', highlight: false },
]

export default async function WorkshopsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { preview } = await searchParams

  let items: PublicWorkshop[] = []
  let review: WorkshopReview | null = null

  try {
    const rows = await db
      .select()
      .from(workshops)
      .where(eq(workshops.isActive, true))
      .orderBy(asc(workshops.startDate))
    items = rows.map((w) => ({
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

  // Featured review is admin-controlled: any active testimonial with context "workshop"
  try {
    const [t] = await db
      .select()
      .from(testimonials)
      .where(and(eq(testimonials.context, 'workshop'), eq(testimonials.isActive, true)))
      .orderBy(asc(testimonials.sortOrder))
      .limit(1)
    if (t) review = { quote: t.quote, authorName: t.authorName, authorRole: t.authorRole }
  } catch (err) {
    console.error('Failed to load workshop review:', err)
  }

  if (items.length === 0 && preview === '1') items = PREVIEW

  return <WorkshopsClient workshops={items} review={review} />
}
