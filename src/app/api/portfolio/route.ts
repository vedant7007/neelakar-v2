import { NextResponse, type NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { portfolioItems } from '@/lib/db/schema'
import { createClient } from '@/lib/supabase/server'
import { asc, eq } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const context = new URL(request.url).searchParams.get('context')
    const where = context ? eq(portfolioItems.context, context) : eq(portfolioItems.isActive, true)

    const all = await db
      .select().from(portfolioItems)
      .where(where)
      .orderBy(asc(portfolioItems.sortOrder))

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
    const [created] = await db.insert(portfolioItems).values({
      title: body.title,
      category: body.category || null,
      imageUrl: body.imageUrl || null,
      imageStoragePath: body.imageStoragePath || null,
      context: body.context || 'portfolio',
      subtitle: body.subtitle || null,
      sortOrder: body.sortOrder || 0,
      isActive: body.isActive ?? true,
    }).returning()

    return NextResponse.json(created, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
