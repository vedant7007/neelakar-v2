import { NextResponse, type NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { workshops } from '@/lib/db/schema'
import { createClient } from '@/lib/supabase/server'
import { desc } from 'drizzle-orm'

export async function GET() {
  try {
    const all = await db
      .select()
      .from(workshops)
      .orderBy(desc(workshops.sortOrder))

    return NextResponse.json(all)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()

    const [created] = await db.insert(workshops).values({
      title: body.title,
      category: body.category,
      slug: body.slug,
      description: body.description || null,
      dateDisplay: body.dateDisplay,
      startDate: body.startDate,
      endDate: body.endDate,
      location: body.location,
      duration: body.duration,
      level: body.level,
      price: body.price,
      priceDisplay: body.priceDisplay,
      totalSpots: body.totalSpots || 20,
      instructor: body.instructor || null,
      highlight: body.highlight || false,
      isActive: body.isActive ?? true,
      sortOrder: body.sortOrder || 0,
    }).returning()

    return NextResponse.json(created, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
