import { NextResponse, type NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { testimonials } from '@/lib/db/schema'
import { createClient } from '@/lib/supabase/server'
import { eq } from 'drizzle-orm'

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
    for (const field of ['context', 'quote', 'authorName', 'authorRole', 'sortOrder', 'isActive']) {
      if (body[field] !== undefined) updateData[field] = body[field]
    }

    const [updated] = await db
      .update(testimonials).set(updateData)
      .where(eq(testimonials.id, id)).returning()

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
    const [deleted] = await db.delete(testimonials).where(eq(testimonials.id, id)).returning()
    if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
