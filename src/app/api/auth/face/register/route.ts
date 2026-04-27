import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { adminProfiles } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { encryptDescriptor } from '@/lib/face-auth/encrypt'
import { z } from 'zod'

const schema = z.object({
  descriptor: z.array(z.number()).length(128),
})

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid descriptor' }, { status: 400 })
    }

    const encrypted = encryptDescriptor(parsed.data.descriptor)

    await db
      .update(adminProfiles)
      .set({
        faceDescriptorEncrypted: encrypted,
        faceRegistered: true,
      })
      .where(eq(adminProfiles.id, user.id))

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await db
      .update(adminProfiles)
      .set({
        faceDescriptorEncrypted: null,
        faceRegistered: false,
      })
      .where(eq(adminProfiles.id, user.id))

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
