import { NextResponse, type NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { testimonials } from '@/lib/db/schema'
import { createClient } from '@/lib/supabase/server'
import { asc, eq } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const context = new URL(request.url).searchParams.get('context')
    const where = context ? eq(testimonials.context, context) : eq(testimonials.isActive, true)

    const all = await db
      .select().from(testimonials)
      .where(where)
      .orderBy(asc(testimonials.sortOrder))

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
    const [created] = await db.insert(testimonials).values({
      context: body.context || 'main',
      quote: body.quote,
      authorName: body.authorName,
      authorRole: body.authorRole || null,
      sortOrder: body.sortOrder || 0,
      isActive: body.isActive ?? true,
    }).returning()

    return NextResponse.json(created, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
