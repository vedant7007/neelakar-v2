import { NextResponse, type NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { siteContent } from '@/lib/db/schema'
import { createClient } from '@/lib/supabase/server'
import { eq } from 'drizzle-orm'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> },
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { key } = await params
    const body = await request.json()

    const [updated] = await db
      .update(siteContent)
      .set({
        value: body.value,
        updatedAt: new Date(),
        updatedBy: user.id,
      })
      .where(eq(siteContent.key, key))
      .returning()

    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
