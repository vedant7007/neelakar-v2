import { NextResponse, type NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { services } from '@/lib/db/schema'
import { createClient } from '@/lib/supabase/server'
import { asc, eq } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const context = new URL(request.url).searchParams.get('context')
    const where = context ? eq(services.context, context) : eq(services.isActive, true)

    const all = await db
      .select().from(services)
      .where(where)
      .orderBy(asc(services.sortOrder))

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
    const [created] = await db.insert(services).values({
      name: body.name,
      slug: body.slug,
      tagline: body.tagline || null,
      description: body.description || null,
      href: body.href || null,
      color: body.color || null,
      textColor: body.textColor || null,
      context: body.context || 'main',
      metadata: body.metadata || null,
      sortOrder: body.sortOrder || 0,
      isActive: body.isActive ?? true,
    }).returning()

    return NextResponse.json(created, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
