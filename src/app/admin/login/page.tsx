'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { COLORS, FONTS } from '@/lib/theme'

const GOLD = COLORS.gold
const DISPLAY = FONTS.display
const SANS = FONTS.sans

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) {
      setError('Invalid credentials.')
      setLoading(false)
      return
    }
    router.push('/admin')
    router.refresh()
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center px-6"
      style={{ backgroundColor: COLORS.bg }}
    >
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-10">
          <div className="relative w-14 h-14">
            <Image src="/NCH_logo_white.png" alt="Neelakar" fill className="object-contain opacity-80" sizes="56px" />
          </div>
        </div>
        <h1
          className="text-center mb-2"
          style={{
            fontFamily: DISPLAY, fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)', fontWeight: 300,
            fontStyle: 'italic', color: '#fff',
          }}
        >
          The back of house.
        </h1>
        <p
          className="text-center mb-10"
          style={{
            fontFamily: SANS, fontSize: '0.7rem', fontWeight: 600, color: GOLD,
            letterSpacing: '0.35em', textTransform: 'uppercase',
          }}
        >
          Admin access
        </p>

        <form onSubmit={signIn}>
          <div className="mb-6">
            <label
              className="block mb-2"
              style={{
                fontFamily: SANS, fontSize: '0.62rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)',
                letterSpacing: '0.3em', textTransform: 'uppercase',
              }}
            >
              Email
            </label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)} required
              autoComplete="email"
              className="w-full bg-transparent pb-3 outline-none border-b border-white/10 focus:border-[#C8A96E] transition-colors"
              style={{ fontFamily: SANS, fontSize: '1rem', fontWeight: 300, color: '#fff' }}
            />
          </div>
          <div className="mb-8">
            <label
              className="block mb-2"
              style={{
                fontFamily: SANS, fontSize: '0.62rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)',
                letterSpacing: '0.3em', textTransform: 'uppercase',
              }}
            >
              Password
            </label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)} required
              autoComplete="current-password"
              className="w-full bg-transparent pb-3 outline-none border-b border-white/10 focus:border-[#C8A96E] transition-colors"
              style={{ fontFamily: SANS, fontSize: '1rem', fontWeight: 300, color: '#fff' }}
            />
          </div>

          {error && (
            <p className="mb-6" style={{ fontFamily: SANS, fontSize: '0.8rem', color: 'rgba(220,120,100,0.85)' }}>
              {error}
            </p>
          )}

          <button
            type="submit" disabled={loading}
            className="group relative overflow-hidden w-full py-4 transition-all duration-300"
            style={{
              fontFamily: SANS, fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.35em',
              textTransform: 'uppercase', backgroundColor: 'transparent', color: GOLD,
              border: '1px solid rgba(200,169,110,0.3)',
              cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.6 : 1,
            }}
          >
            <span className="relative z-10 transition-colors duration-400 group-hover:text-[#060F0B]">
              {loading ? 'Entering…' : 'Enter'}
            </span>
            <span
              className="absolute inset-0 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out"
              style={{ backgroundColor: GOLD }}
            />
          </button>
        </form>
      </div>
    </main>
  )
}
