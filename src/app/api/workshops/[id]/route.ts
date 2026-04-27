import { NextResponse, type NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { workshops } from '@/lib/db/schema'
import { createClient } from '@/lib/supabase/server'
import { eq } from 'drizzle-orm'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const [workshop] = await db
      .select().from(workshops)
      .where(eq(workshops.id, id)).limit(1)

    if (!workshop) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(workshop)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const body = await request.json()

    const updateData: Record<string, unknown> = { updatedAt: new Date() }
    const fields = [
      'title', 'category', 'slug', 'description', 'dateDisplay',
      'startDate', 'endDate', 'location', 'duration', 'level',
      'price', 'priceDisplay', 'totalSpots', 'spotsFilled',
      'instructor', 'highlight', 'isActive', 'sortOrder',
    ]

    for (const field of fields) {
      if (body[field] !== undefined) updateData[field] = body[field]
    }

    const [updated] = await db
      .update(workshops).set(updateData)
      .where(eq(workshops.id, id)).returning()

    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const [deleted] = await db
      .delete(workshops)
      .where(eq(workshops.id, id)).returning()

    if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
