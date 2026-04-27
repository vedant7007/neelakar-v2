import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { db } from '@/lib/db'
import { adminProfiles } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { decryptDescriptor } from '@/lib/face-auth/encrypt'
import { isFaceMatch, euclideanDistance } from '@/lib/face-auth/compare'
import { z } from 'zod'

const schema = z.object({
  descriptor: z.array(z.number()).length(128),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid descriptor' }, { status: 400 })
    }

    const profiles = await db
      .select()
      .from(adminProfiles)
      .where(eq(adminProfiles.faceRegistered, true))

    let matchedProfile: typeof profiles[0] | null = null
    let bestDistance = Infinity

    for (const profile of profiles) {
      if (!profile.faceDescriptorEncrypted) continue
      const stored = decryptDescriptor(profile.faceDescriptorEncrypted)
      const distance = euclideanDistance(parsed.data.descriptor, stored)

      if (distance < bestDistance) {
        bestDistance = distance
        if (isFaceMatch(parsed.data.descriptor, stored)) {
          matchedProfile = profile
        }
      }
    }

    if (!matchedProfile) {
      return NextResponse.json({ error: 'Face not recognized' }, { status: 401 })
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )

    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(matchedProfile.id)
    if (userError || !userData.user?.email) {
      return NextResponse.json({ error: 'User lookup failed' }, { status: 500 })
    }

    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: userData.user.email,
    })

    if (linkError || !linkData) {
      return NextResponse.json({ error: 'Session creation failed' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      displayName: matchedProfile.displayName,
      email: userData.user.email,
      tokenHash: linkData.properties?.hashed_token,
    })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
