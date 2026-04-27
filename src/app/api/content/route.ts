import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { siteContent } from '@/lib/db/schema'
import { asc } from 'drizzle-orm'

export async function GET() {
  try {
    const all = await db
      .select().from(siteContent)
      .orderBy(asc(siteContent.category), asc(siteContent.key))

    return NextResponse.json(all)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
