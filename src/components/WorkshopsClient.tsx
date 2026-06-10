'use client'

import { useState } from 'react'

const GOLD = '#C8A96E'
const DISPLAY = "var(--font-neel-display), 'Playfair Display', serif"
const SANS = "var(--font-dm-sans), 'DM Sans', sans-serif"
const NUSRAT = "'Nusrat', cursive"

export interface PublicWorkshop {
  id: string
  title: string
  category: string
  description: string | null
  dateDisplay: string
  location: string
  duration: string
  level: string
  priceDisplay: string
  spotsLeft: number
  totalSpots: number
  instructor: string | null
  highlight: boolean
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function RegisterForm({ workshop, onDone }: { workshop: PublicWorkshop; onDone: () => void }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) { setError('Your name, please.'); return }
    if (!EMAIL_RE.test(email.trim())) { setError('A valid email, please.'); return }
    setError('')
    setSending(true)
    try {
      const res = await fetch(`/api/workshops/${workshop.id}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), phone: phone.trim() || undefined }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(typeof data.error === 'string' ? data.error : 'Something went wrong. Try again.')
        setSending(false)
        return
      }
      setSuccess(true)
    } catch {
      setError('Something went wrong. Try again.')
      setSending(false)
    }
  }

  if (success) {
    return (
      <div className="pt-6 pb-2">
        <p style={{ fontFamily: DISPLAY, fontSize: 'clamp(1.1rem, 1.4vw, 1.4rem)', fontStyle: 'italic', fontWeight: 300, color: '#fff' }}>
          You&rsquo;re in. <span style={{ fontFamily: NUSRAT, color: GOLD }}>see you there.</span>
        </p>
        <p className="mt-2" style={{ fontFamily: SANS, fontSize: '0.8rem', fontWeight: 300, color: 'rgba(255,255,255,0.4)' }}>
          A confirmation is on its way to your inbox.
        </p>
        <button onClick={onDone} className="mt-4" style={{
          fontFamily: SANS, fontSize: '0.62rem', fontWeight: 600, color: GOLD, letterSpacing: '0.25em',
          textTransform: 'uppercase', background: 'none', border: 'none', cursor: 'pointer', padding: 0,
        }}>
          Close
        </button>
      </div>
    )
  }

  const inputStyle = {
    fontFamily: SANS, fontSize: '0.95rem', fontWeight: 300, color: '#fff',
  } as const

  return (
    <form onSubmit={submit} className="pt-6 pb-2 grid grid-cols-1 md:grid-cols-3 gap-5">
      <input
        value={name} onChange={e => setName(e.target.value)} placeholder="Your name"
        className="bg-transparent pb-3 outline-none border-b border-white/10 focus:border-[#C8A96E] transition-colors placeholder:text-white/20"
        style={inputStyle}
      />
      <input
        type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email"
        className="bg-transparent pb-3 outline-none border-b border-white/10 focus:border-[#C8A96E] transition-colors placeholder:text-white/20"
        style={inputStyle}
      />
      <input
        value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone (optional)"
        className="bg-transparent pb-3 outline-none border-b border-white/10 focus:border-[#C8A96E] transition-colors placeholder:text-white/20"
        style={inputStyle}
      />
      <div className="md:col-span-3 flex items-center gap-6 flex-wrap">
        <button
          type="submit" disabled={sending}
          className="group relative overflow-hidden px-8 py-3.5 transition-all duration-300"
          style={{
            fontFamily: SANS, fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.3em',
            textTransform: 'uppercase', backgroundColor: 'transparent', color: GOLD,
            border: '1px solid rgba(200,169,110,0.35)',
            cursor: sending ? 'wait' : 'pointer', opacity: sending ? 0.6 : 1,
          }}
        >
          <span className="relative z-10 transition-colors duration-400 group-hover:text-[#060F0B]">
            {sending ? 'Reserving…' : 'Reserve my spot'}
          </span>
          <span className="absolute inset-0 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out"
            style={{ backgroundColor: GOLD }} />
        </button>
        {error && (
          <p style={{ fontFamily: SANS, fontSize: '0.78rem', color: 'rgba(220,120,100,0.85)' }}>{error}</p>
        )}
      </div>
    </form>
  )
}

export default function WorkshopsClient({ workshops }: { workshops: PublicWorkshop[] }) {
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#060F0B' }}>
      {/* Hero */}
      <section className="px-6 md:px-14 lg:px-24 pt-36 md:pt-44 pb-16 md:pb-24">
        <div className="flex items-center gap-4 mb-7">
          <div className="h-px w-8" style={{ backgroundColor: GOLD, opacity: 0.3 }} />
          <span style={{
            fontFamily: SANS, fontSize: 'clamp(0.55rem, 0.62vw, 0.65rem)', fontWeight: 600,
            color: GOLD, letterSpacing: '0.45em', textTransform: 'uppercase',
          }}>
            Learn with us
          </span>
        </div>
        <h1 style={{
          fontFamily: DISPLAY, fontSize: 'clamp(2.8rem, 7vw, 6.5rem)', fontWeight: 300,
          fontStyle: 'italic', color: '#fff', lineHeight: 1.05, letterSpacing: '-0.02em',
        }}>
          Workshops
        </h1>
        <p className="mt-6 max-w-xl" style={{
          fontFamily: SANS, fontSize: 'clamp(0.9rem, 1vw, 1.05rem)', fontWeight: 300,
          color: 'rgba(255,255,255,0.45)', lineHeight: 1.8,
        }}>
          Small rooms, working professionals, real craft. Photography, film, and brand —
          taught the way we practice it.
        </p>
      </section>

      {/* List */}
      <section className="px-6 md:px-14 lg:px-24 pb-32">
        {workshops.length === 0 ? (
          <div className="py-20 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <p style={{
              fontFamily: DISPLAY, fontSize: 'clamp(1.2rem, 1.6vw, 1.6rem)', fontWeight: 300,
              fontStyle: 'italic', color: 'rgba(255,255,255,0.5)',
            }}>
              The next season is being written.
            </p>
            <p className="mt-3" style={{ fontFamily: SANS, fontSize: '0.85rem', fontWeight: 300, color: 'rgba(255,255,255,0.3)' }}>
              New workshops are announced on{' '}
              <a href="https://www.instagram.com/neelakar_house" target="_blank" rel="noopener noreferrer"
                style={{ color: GOLD, textDecoration: 'none' }}>@Neelakar_House</a> first.
            </p>
          </div>
        ) : (
          workshops.map((w) => {
            const full = w.spotsLeft === 0
            const open = openId === w.id
            return (
              <article key={w.id} className="border-t py-10 md:py-12" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-10">
                  {/* Date + category */}
                  <div className="md:w-48 shrink-0">
                    <p style={{
                      fontFamily: SANS, fontSize: '0.68rem', fontWeight: 600, color: GOLD,
                      letterSpacing: '0.3em', textTransform: 'uppercase',
                    }}>
                      {w.dateDisplay}
                    </p>
                    <p className="mt-2" style={{
                      fontFamily: SANS, fontSize: '0.65rem', fontWeight: 400,
                      color: 'rgba(255,255,255,0.3)', letterSpacing: '0.2em', textTransform: 'uppercase',
                    }}>
                      {w.category}
                    </p>
                    {w.highlight && (
                      <p className="mt-3" style={{ fontFamily: NUSRAT, fontSize: '1.1rem', color: GOLD }}>
                        featured.
                      </p>
                    )}
                  </div>

                  {/* Body */}
                  <div className="flex-1 min-w-0">
                    <h2 style={{
                      fontFamily: DISPLAY, fontSize: 'clamp(1.5rem, 2.4vw, 2.3rem)', fontWeight: 300,
                      fontStyle: 'italic', color: '#fff', lineHeight: 1.2,
                    }}>
                      {w.title}
                    </h2>
                    {w.description && (
                      <p className="mt-3 max-w-2xl" style={{
                        fontFamily: SANS, fontSize: 'clamp(0.85rem, 0.95vw, 0.95rem)', fontWeight: 300,
                        color: 'rgba(255,255,255,0.4)', lineHeight: 1.8,
                      }}>
                        {w.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-x-7 gap-y-2 mt-5">
                      {[w.location, w.duration, w.level, w.instructor ? `Led by ${w.instructor}` : null]
                        .filter(Boolean)
                        .map((meta) => (
                          <span key={meta as string} style={{
                            fontFamily: SANS, fontSize: '0.72rem', fontWeight: 400,
                            color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em',
                          }}>
                            {meta}
                          </span>
                        ))}
                    </div>
                  </div>

                  {/* Price + CTA */}
                  <div className="md:w-52 shrink-0 md:text-right">
                    <p style={{
                      fontFamily: DISPLAY, fontSize: 'clamp(1.2rem, 1.6vw, 1.6rem)', fontWeight: 300,
                      color: '#fff',
                    }}>
                      {w.priceDisplay}
                    </p>
                    <p className="mt-1" style={{
                      fontFamily: SANS, fontSize: '0.68rem', fontWeight: 400,
                      color: full ? 'rgba(220,120,100,0.7)' : w.spotsLeft <= 5 ? GOLD : 'rgba(255,255,255,0.3)',
                      letterSpacing: '0.15em', textTransform: 'uppercase',
                    }}>
                      {full ? 'Fully booked' : `${w.spotsLeft} ${w.spotsLeft === 1 ? 'spot' : 'spots'} left`}
                    </p>
                    {!full && (
                      <button
                        onClick={() => setOpenId(open ? null : w.id)}
                        className="mt-4 group inline-flex items-center gap-3"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                      >
                        <span className="h-px w-5 transition-all duration-400 group-hover:w-10"
                          style={{ backgroundColor: GOLD, display: 'inline-block' }} />
                        <span style={{
                          fontFamily: SANS, fontSize: '0.62rem', fontWeight: 600, color: GOLD,
                          letterSpacing: '0.25em', textTransform: 'uppercase',
                        }}>
                          {open ? 'Close' : 'Reserve'}
                        </span>
                      </button>
                    )}
                  </div>
                </div>

                {open && !full && <RegisterForm workshop={w} onDone={() => setOpenId(null)} />}
              </article>
            )
          })
        )}
      </section>
    </main>
  )
}
