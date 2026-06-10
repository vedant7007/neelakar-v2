'use client'

import { useState, useEffect, useLayoutEffect, useRef, useMemo } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import FooterSection from '@/components/sections/FooterSection'

gsap.registerPlugin(ScrollTrigger)

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

export interface WorkshopReview {
  quote: string
  authorName: string
  authorRole: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const LEVEL_RANK: Record<string, number> = { Beginner: 1, Intermediate: 2, Advanced: 3 }
const ROMAN = '·  MMXXVI'

const PILLARS = [
  { n: '01', title: 'Seeing', body: 'Composition, light, and the discipline of the frame — the eye before the gear.' },
  { n: '02', title: 'Making', body: 'Direction, equipment, and the craft of actually being on set under pressure.' },
  { n: '03', title: 'Finishing', body: 'The edit, the color, and the grade that turns footage into a feeling.' },
  { n: '04', title: 'Showing', body: 'Story, brand, and shaping a final cut the world remembers.' },
]

const DEFAULT_REVIEW: WorkshopReview = {
  quote: 'I walked in shooting on auto. I left with a language. The room was small enough that nothing went unanswered — and everything got tried.',
  authorName: 'Meera Nair',
  authorRole: "Cinematic Photography · Cohort '25",
}

function LevelDots({ level }: { level: string }) {
  const n = LEVEL_RANK[level] ?? 0
  return (
    <span className="wk-level" title={level} aria-label={`Level: ${level}`}>
      {[1, 2, 3].map((i) => (
        <span key={i} className="wk-dot" data-on={i <= n} />
      ))}
      <span className="wk-level-label">{level}</span>
    </span>
  )
}

/* ── Registration form, revealed inside an expanding row ── */
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
      <div className="wk-success">
        <p className="wk-success-line">
          Your seat is held. <span className="wk-cursive">see you in the room.</span>
        </p>
        <p className="wk-success-sub">A confirmation is on its way to your inbox.</p>
        <button onClick={onDone} className="wk-text-link">Close</button>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="wk-form">
      <div className="wk-field" style={{ animationDelay: '0.05s' }}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" aria-label="Your name" />
      </div>
      <div className="wk-field" style={{ animationDelay: '0.12s' }}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" aria-label="Email" />
      </div>
      <div className="wk-field" style={{ animationDelay: '0.19s' }}>
        <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone (optional)" aria-label="Phone" />
      </div>
      <div className="wk-form-actions" style={{ animationDelay: '0.26s' }}>
        <button type="submit" disabled={sending} className="wk-submit">
          <span>{sending ? 'Reserving…' : 'Reserve my spot'}</span>
        </button>
        {error && <p className="wk-error">{error}</p>}
      </div>
    </form>
  )
}

export default function WorkshopsClient({
  workshops,
  review,
}: {
  workshops: PublicWorkshop[]
  review: WorkshopReview | null
}) {
  const [openId, setOpenId] = useState<string | null>(null)
  const [filter, setFilter] = useState('All')
  const rootRef = useRef<HTMLElement>(null)
  const featuredReview = review ?? DEFAULT_REVIEW

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(workshops.map((w) => w.category)))],
    [workshops],
  )
  const visible = useMemo(
    () => (filter === 'All' ? workshops : workshops.filter((w) => w.category === filter)),
    [filter, workshops],
  )
  const hasWorkshops = workshops.length > 0

  const goToProgramme = () => {
    const el = document.getElementById('programme')
    if (!el) return
    const lenis = (window as Window & { __lenis?: { scrollTo: (t: Element, o?: { offset?: number }) => void } }).__lenis
    if (lenis) lenis.scrollTo(el, { offset: -30 })
    else el.scrollIntoView({ behavior: 'smooth' })
  }

  /* Hero load — masked line reveal, staggered meta */
  useLayoutEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    const ctx = gsap.context(() => {
      gsap.set('.wk-line > span', { yPercent: 115 })
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
      tl.to('.wk-line > span', { yPercent: 0, duration: 1.1, stagger: 0.1 }, 0.15)
        .from('.wk-eyebrow', { opacity: 0, y: 18, duration: 0.9 }, 0)
        .from('.wk-accent', { opacity: 0, y: 14, duration: 0.9 }, 0.55)
        .from('.wk-lead', { opacity: 0, y: 18, duration: 0.9 }, 0.65)
        .from('.wk-hero-foot', { opacity: 0, y: 14, duration: 0.9 }, 0.78)
    }, rootRef)
    return () => ctx.revert()
  }, [])

  /* Section + row reveals on scroll, plus numeral parallax — re-runs on filter change */
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const root = rootRef.current
    if (!root) return

    const targets = Array.from(root.querySelectorAll<HTMLElement>('.wk-row, .wk-reveal'))
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    targets.forEach((t) => io.observe(t))

    let ctx: gsap.Context | undefined
    if (!reduce) {
      ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>('.wk-num').forEach((num) => {
          gsap.fromTo(
            num,
            { yPercent: 12 },
            {
              yPercent: -12,
              ease: 'none',
              scrollTrigger: { trigger: num.closest('.wk-row'), start: 'top bottom', end: 'bottom top', scrub: 1 },
            },
          )
        })
      }, rootRef)
      ScrollTrigger.refresh()
    }

    return () => {
      io.disconnect()
      ctx?.revert()
    }
  }, [visible])

  return (
    <main ref={rootRef} className="wk-root">
      <style>{`
        .wk-root {
          position: relative; background: #060F0B; overflow-x: clip;
        }
        .wk-grain {
          position: fixed; inset: 0; z-index: 1; pointer-events: none; opacity: 0.5;
          mix-blend-mode: soft-light;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E");
        }
        .wk-content { position: relative; z-index: 2; }
        .wk-wrap { max-width: 1500px; margin: 0 auto; }
        .wk-pad { padding-left: clamp(1.5rem, 6vw, 7rem); padding-right: clamp(1.5rem, 6vw, 7rem); }

        .wk-sec-label {
          display: flex; align-items: center; gap: 1rem; margin-bottom: clamp(2rem, 4vh, 3rem);
          font-family: ${SANS}; font-size: clamp(0.55rem, 0.65vw, 0.66rem); font-weight: 600;
          color: ${GOLD}; letter-spacing: 0.4em; text-transform: uppercase;
        }
        .wk-sec-label .rule { display: inline-block; width: clamp(28px, 5vw, 64px); height: 1px; background: ${GOLD}; opacity: 0.5; }

        /* reveal helper */
        .wk-reveal { opacity: 0; transform: translateY(34px); transition: opacity 0.95s cubic-bezier(0.16,0.84,0.44,1), transform 0.95s cubic-bezier(0.16,0.84,0.44,1); }
        .wk-reveal.in { opacity: 1; transform: none; }

        /* ── HERO ── */
        .wk-hero {
          position: relative; min-height: 92vh; display: flex; flex-direction: column; justify-content: center;
          padding-top: clamp(8rem, 16vh, 12rem); padding-bottom: clamp(4rem, 8vh, 7rem);
          background:
            radial-gradient(1200px 700px at 12% -8%, rgba(200,169,110,0.10), transparent 60%),
            radial-gradient(900px 600px at 95% 8%, rgba(200,169,110,0.05), transparent 55%);
        }
        .wk-eyebrow {
          display: flex; align-items: center; gap: 1rem; margin-bottom: clamp(1.8rem, 4vh, 3rem);
          font-family: ${SANS}; font-size: clamp(0.55rem, 0.65vw, 0.68rem); font-weight: 600;
          color: ${GOLD}; letter-spacing: 0.42em; text-transform: uppercase;
        }
        .wk-eyebrow .rule { display: inline-block; width: clamp(28px, 5vw, 64px); height: 1px; background: ${GOLD}; opacity: 0.5; }
        .wk-eyebrow .roman { color: rgba(255,255,255,0.32); letter-spacing: 0.3em; }

        .wk-title { margin: 0; }
        .wk-line { display: block; overflow: hidden; line-height: 0.92; }
        .wk-line > span {
          display: inline-block; font-family: ${DISPLAY}; font-weight: 300; font-style: italic; color: #fff;
          font-size: clamp(3.4rem, 13vw, 12rem); letter-spacing: -0.025em; will-change: transform;
        }
        .wk-line .gold { color: ${GOLD}; }
        .wk-accent { margin: clamp(0.6rem, 1.5vh, 1.2rem) 0 0; font-family: ${NUSRAT}; font-size: clamp(1.5rem, 3vw, 2.6rem); color: ${GOLD}; }
        .wk-lead { margin: clamp(1.8rem, 4vh, 2.8rem) 0 0; max-width: 34rem; font-family: ${SANS}; font-size: clamp(0.92rem, 1vw, 1.06rem); font-weight: 300; color: rgba(255,255,255,0.5); line-height: 1.85; }
        .wk-hero-foot { display: flex; align-items: center; flex-wrap: wrap; gap: clamp(1.2rem, 3vw, 2.2rem); margin-top: clamp(2.2rem, 5vh, 3.4rem); }
        .wk-hero-count { display: inline-flex; align-items: center; gap: 0.9rem; font-family: ${SANS}; font-size: 0.64rem; font-weight: 600; letter-spacing: 0.3em; text-transform: uppercase; color: rgba(255,255,255,0.3); }
        .wk-hero-count .dotsep { width: 4px; height: 4px; border-radius: 50%; background: ${GOLD}; opacity: 0.7; }
        .wk-cta {
          position: relative; overflow: hidden; padding: 1rem 2.6rem; cursor: pointer; background: transparent;
          border: 1px solid rgba(200,169,110,0.4); color: ${GOLD};
          font-family: ${SANS}; font-size: 0.64rem; font-weight: 600; letter-spacing: 0.3em; text-transform: uppercase;
        }
        .wk-cta > span { position: relative; z-index: 2; transition: color 0.4s ease; }
        .wk-cta::after { content: ''; position: absolute; inset: 0; background: ${GOLD}; transform: scaleX(0); transform-origin: left; transition: transform 0.5s cubic-bezier(0.16,0.84,0.44,1); }
        .wk-cta:hover::after { transform: scaleX(1); }
        .wk-cta:hover > span { color: #060F0B; }
        .wk-scrollcue { position: absolute; bottom: 2rem; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: 0.6rem; opacity: 0.4; }
        .wk-scrollcue .word { font-family: ${SANS}; font-size: 0.55rem; font-weight: 600; letter-spacing: 0.3em; text-transform: uppercase; color: #fff; }
        .wk-scrollcue .bar { width: 1px; height: 38px; background: linear-gradient(${GOLD}, transparent); animation: wkCue 2.2s ease-in-out infinite; }
        @keyframes wkCue { 0%,100% { transform: scaleY(0.4); opacity: 0.4; transform-origin: top; } 50% { transform: scaleY(1); opacity: 1; transform-origin: top; } }

        /* ── INTRO / THE IDEA ── */
        .wk-intro { padding: clamp(5rem, 12vh, 9rem) 0; }
        .wk-intro-grid { display: grid; grid-template-columns: 1fr; gap: clamp(2rem, 5vw, 4.5rem); }
        @media (min-width: 920px) { .wk-intro-grid { grid-template-columns: 1.1fr 1fr; align-items: end; } }
        .wk-intro h2 { margin: 0; font-family: ${DISPLAY}; font-weight: 300; font-style: italic; color: #fff; font-size: clamp(2rem, 4.2vw, 4rem); line-height: 1.12; letter-spacing: -0.02em; }
        .wk-intro h2 .gold { color: ${GOLD}; }
        .wk-intro p { margin: 0 0 1.4rem; font-family: ${SANS}; font-size: clamp(0.92rem, 1vw, 1.05rem); font-weight: 300; color: rgba(255,255,255,0.5); line-height: 1.9; }
        .wk-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(1rem, 3vw, 2.5rem); margin-top: clamp(3rem, 7vh, 5rem); border-top: 1px solid rgba(255,255,255,0.08); padding-top: clamp(2rem, 4vh, 3rem); }
        .wk-stat .k { font-family: ${DISPLAY}; font-weight: 300; font-style: italic; color: #fff; font-size: clamp(1.3rem, 2.2vw, 2rem); }
        .wk-stat .v { margin-top: 0.5rem; font-family: ${SANS}; font-size: clamp(0.66rem, 0.75vw, 0.78rem); font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(255,255,255,0.38); }
        @media (max-width: 640px) {
          .wk-stats { grid-template-columns: 1fr; gap: 0; }
          .wk-stat { display: flex; align-items: baseline; justify-content: space-between; gap: 1rem; padding: 1.1rem 0; border-bottom: 1px solid rgba(255,255,255,0.06); }
          .wk-stat .v { margin-top: 0; text-align: right; }
        }

        /* ── REVIEW ── */
        .wk-review { padding: clamp(4rem, 10vh, 8rem) 0; background: radial-gradient(900px 500px at 80% 30%, rgba(200,169,110,0.05), transparent 60%); }
        .wk-review-grid { display: grid; grid-template-columns: 1fr; gap: clamp(2.5rem, 5vw, 4.5rem); align-items: center; }
        @media (min-width: 920px) { .wk-review-grid { grid-template-columns: 1.05fr 1fr; } }
        .wk-video { position: relative; aspect-ratio: 16 / 10; border-radius: 4px; overflow: hidden; cursor: pointer; }
        .wk-video img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform 1.2s cubic-bezier(0.16,0.84,0.44,1); }
        .wk-video:hover img { transform: scale(1.04); }
        .wk-video .veil { position: absolute; inset: 0; background: linear-gradient(120deg, rgba(6,15,11,0.55), rgba(6,15,11,0.2)); z-index: 1; }
        .wk-play { position: absolute; inset: 0; z-index: 2; display: flex; align-items: center; justify-content: center; }
        .wk-play .ring { width: clamp(64px, 7vw, 92px); height: clamp(64px, 7vw, 92px); border-radius: 50%; border: 1px solid rgba(232,226,217,0.6); display: flex; align-items: center; justify-content: center; backdrop-filter: blur(6px); background: rgba(255,255,255,0.06); transition: transform 0.5s cubic-bezier(0.16,0.84,0.44,1), background 0.5s; }
        .wk-video:hover .ring { transform: scale(1.08); background: rgba(200,169,110,0.18); }
        .wk-play .tri { width: 0; height: 0; border-style: solid; border-width: 9px 0 9px 15px; border-color: transparent transparent transparent #E8E2D9; margin-left: 4px; }
        .wk-video .vcorner { position: absolute; width: 16px; height: 16px; z-index: 3; border-color: rgba(232,226,217,0.5); }
        .wk-video .vcorner.tl { top: 12px; left: 12px; border-top: 1px solid; border-left: 1px solid; }
        .wk-video .vcorner.br { bottom: 12px; right: 12px; border-bottom: 1px solid; border-right: 1px solid; }
        .wk-video .vlabel { position: absolute; bottom: 14px; left: 16px; z-index: 3; font-family: ${SANS}; font-size: 0.6rem; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase; color: rgba(232,226,217,0.7); }
        .wk-quote { margin: 0; font-family: ${DISPLAY}; font-weight: 300; font-style: italic; color: #fff; font-size: clamp(1.5rem, 2.6vw, 2.4rem); line-height: 1.4; letter-spacing: -0.01em; }
        .wk-quote .mark { color: ${GOLD}; }
        .wk-review-by { margin-top: clamp(1.6rem, 3vh, 2.4rem); }
        .wk-review-by .nm { font-family: ${SANS}; font-size: 0.82rem; font-weight: 600; letter-spacing: 0.12em; color: #fff; }
        .wk-review-by .rl { margin-top: 0.4rem; font-family: ${SANS}; font-size: 0.68rem; font-weight: 400; letter-spacing: 0.16em; text-transform: uppercase; color: ${GOLD}; }

        /* ── LEARN ── */
        .wk-learn { padding: clamp(4rem, 10vh, 8rem) 0; }
        .wk-learn-head { display: flex; flex-direction: column; gap: 0.8rem; margin-bottom: clamp(2.5rem, 6vh, 4rem); }
        .wk-learn-head h2 { margin: 0; font-family: ${DISPLAY}; font-weight: 300; font-style: italic; color: #fff; font-size: clamp(2rem, 4vw, 3.6rem); line-height: 1.1; }
        .wk-pillars { display: grid; grid-template-columns: 1fr; gap: 0; }
        @media (min-width: 760px) { .wk-pillars { grid-template-columns: 1fr 1fr; } }
        .wk-pillar { position: relative; padding: clamp(2rem, 4vh, 2.8rem) 0; border-top: 1px solid rgba(255,255,255,0.08); display: grid; grid-template-columns: clamp(3rem, 5vw, 5rem) 1fr; gap: clamp(1.2rem, 2.5vw, 2.2rem); }
        @media (min-width: 760px) { .wk-pillar { padding-right: clamp(2rem, 4vw, 4rem); } .wk-pillar:nth-child(odd) { border-right: 1px solid rgba(255,255,255,0.06); padding-right: clamp(2rem, 4vw, 4rem); } .wk-pillar:nth-child(even) { padding-left: clamp(2rem, 4vw, 4rem); } }
        .wk-pillar .pn { font-family: ${DISPLAY}; font-weight: 300; font-style: italic; color: ${GOLD}; font-size: clamp(1.4rem, 2vw, 2rem); line-height: 1; }
        .wk-pillar h3 { margin: 0 0 0.7rem; font-family: ${DISPLAY}; font-weight: 300; font-style: italic; color: #fff; font-size: clamp(1.4rem, 2vw, 1.9rem); }
        .wk-pillar p { margin: 0; font-family: ${SANS}; font-size: clamp(0.85rem, 0.95vw, 0.95rem); font-weight: 300; color: rgba(255,255,255,0.42); line-height: 1.8; }

        /* ── PROGRAMME header ── */
        .wk-programme { padding: clamp(4rem, 9vh, 7rem) 0 clamp(5rem, 11vh, 9rem); scroll-margin-top: 90px; }
        .wk-programme-head { display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: 1.5rem; margin-bottom: clamp(2rem, 4vh, 3rem); }
        .wk-programme-head h2 { margin: 0; font-family: ${DISPLAY}; font-weight: 300; font-style: italic; color: #fff; font-size: clamp(2rem, 4vw, 3.6rem); line-height: 1.1; }

        /* ── FILTER ── */
        .wk-filters { display: flex; flex-wrap: wrap; gap: clamp(1.2rem, 3vw, 2.4rem); margin-bottom: clamp(1.2rem, 2.5vh, 2rem); }
        .wk-filter { position: relative; background: none; border: none; padding: 0 0 0.5rem; cursor: pointer; font-family: ${SANS}; font-size: 0.68rem; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase; color: rgba(255,255,255,0.35); transition: color 0.4s ease; }
        .wk-filter:hover { color: rgba(255,255,255,0.7); }
        .wk-filter[data-active='true'] { color: ${GOLD}; }
        .wk-filter::after { content: ''; position: absolute; left: 0; bottom: 0; height: 1px; width: 0; background: ${GOLD}; transition: width 0.45s cubic-bezier(0.16,0.84,0.44,1); }
        .wk-filter[data-active='true']::after { width: 100%; }

        /* ── ROWS ── */
        .wk-row { position: relative; border-top: 1px solid rgba(255,255,255,0.07); opacity: 0; transform: translateY(38px); transition: opacity 0.9s cubic-bezier(0.16,0.84,0.44,1), transform 0.9s cubic-bezier(0.16,0.84,0.44,1); }
        .wk-row.in { opacity: 1; transform: translateY(0); }
        .wk-row::before { content: ''; position: absolute; top: -1px; left: 0; height: 1px; width: 0; background: ${GOLD}; transition: width 0.7s cubic-bezier(0.16,0.84,0.44,1); }
        .wk-row:hover::before { width: 100%; }
        .wk-glow { position: absolute; inset: 0; pointer-events: none; opacity: 0; background: radial-gradient(60% 120% at 20% 50%, rgba(200,169,110,0.07), transparent 70%); transition: opacity 0.6s ease; }
        .wk-row:hover .wk-glow, .wk-row[data-open='true'] .wk-glow { opacity: 1; }
        .wk-row-main { position: relative; display: grid; grid-template-columns: minmax(0, 1fr); gap: 1.2rem; padding: clamp(2.2rem, 4.5vh, 3.4rem) 0; }
        @media (min-width: 880px) { .wk-row-main { grid-template-columns: clamp(7rem, 11vw, 12rem) 1fr clamp(11rem, 16vw, 15rem); gap: clamp(1.5rem, 3vw, 3.5rem); align-items: start; } }
        .wk-num { font-family: ${DISPLAY}; font-weight: 300; font-style: italic; line-height: 0.8; font-size: clamp(3.2rem, 7vw, 7rem); letter-spacing: -0.02em; color: transparent; -webkit-text-stroke: 1px rgba(200,169,110,0.45); transition: color 0.5s ease, -webkit-text-stroke-color 0.5s ease; will-change: transform; }
        .wk-row:hover .wk-num, .wk-row[data-open='true'] .wk-num { color: rgba(200,169,110,0.92); -webkit-text-stroke-color: transparent; }
        .wk-cat { font-family: ${SANS}; font-size: 0.62rem; font-weight: 600; letter-spacing: 0.28em; text-transform: uppercase; color: ${GOLD}; margin-bottom: 0.9rem; }
        .wk-name { margin: 0; font-family: ${DISPLAY}; font-weight: 300; font-style: italic; color: #fff; font-size: clamp(1.7rem, 3vw, 2.7rem); line-height: 1.12; letter-spacing: -0.01em; }
        .wk-feature { display: inline-block; margin-left: 0.6rem; font-family: ${NUSRAT}; font-size: clamp(1.05rem, 1.5vw, 1.4rem); color: ${GOLD}; vertical-align: middle; }
        .wk-desc { margin: 1rem 0 0; max-width: 42rem; font-family: ${SANS}; font-size: clamp(0.85rem, 0.95vw, 0.96rem); font-weight: 300; color: rgba(255,255,255,0.42); line-height: 1.85; }
        .wk-meta { display: flex; flex-wrap: wrap; align-items: center; gap: 0.55rem 1.5rem; margin-top: 1.5rem; }
        .wk-meta span.m { font-family: ${SANS}; font-size: 0.72rem; font-weight: 400; letter-spacing: 0.06em; color: rgba(255,255,255,0.4); }
        .wk-level { display: inline-flex; align-items: center; gap: 0.4rem; }
        .wk-dot { width: 5px; height: 5px; border-radius: 50%; background: rgba(255,255,255,0.18); }
        .wk-dot[data-on='true'] { background: ${GOLD}; }
        .wk-level-label { font-family: ${SANS}; font-size: 0.72rem; color: rgba(255,255,255,0.4); margin-left: 0.15rem; }
        .wk-aside { display: flex; flex-direction: column; gap: 0.5rem; }
        @media (min-width: 880px) { .wk-aside { align-items: flex-end; text-align: right; } }
        .wk-price { font-family: ${DISPLAY}; font-weight: 300; color: #fff; font-size: clamp(1.4rem, 1.9vw, 1.9rem); }
        .wk-spots { font-family: ${SANS}; font-size: 0.66rem; font-weight: 500; letter-spacing: 0.16em; text-transform: uppercase; }
        .wk-spots[data-tone='full'] { color: rgba(220,120,100,0.75); }
        .wk-spots[data-tone='low'] { color: ${GOLD}; }
        .wk-spots[data-tone='ok'] { color: rgba(255,255,255,0.32); }
        .wk-reserve { margin-top: 1.1rem; background: none; border: none; padding: 0; cursor: pointer; display: inline-flex; align-items: center; gap: 0.8rem; }
        .wk-reserve .ln { display: inline-block; width: 1.4rem; height: 1px; background: ${GOLD}; transition: width 0.45s cubic-bezier(0.16,0.84,0.44,1); }
        .wk-reserve:hover .ln { width: 2.6rem; }
        .wk-reserve .lbl { font-family: ${SANS}; font-size: 0.64rem; font-weight: 600; letter-spacing: 0.26em; text-transform: uppercase; color: ${GOLD}; }

        .wk-expand { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 0.6s cubic-bezier(0.16,0.84,0.44,1); }
        .wk-expand[data-open='true'] { grid-template-rows: 1fr; }
        .wk-expand-inner { overflow: hidden; }
        .wk-expand-pad { padding: 0 0 clamp(2.4rem, 5vh, 3.4rem); }
        .wk-form { display: grid; grid-template-columns: 1fr; gap: 1.6rem; max-width: 46rem; }
        @media (min-width: 720px) { .wk-form { grid-template-columns: repeat(3, 1fr); } }
        .wk-field, .wk-form-actions { opacity: 0; transform: translateY(14px); }
        .wk-expand[data-open='true'] .wk-field, .wk-expand[data-open='true'] .wk-form-actions { animation: wkFieldIn 0.7s cubic-bezier(0.16,0.84,0.44,1) forwards; }
        @keyframes wkFieldIn { to { opacity: 1; transform: translateY(0); } }
        .wk-field input { width: 100%; background: transparent; padding: 0 0 0.7rem; outline: none; color: #fff; border: none; border-bottom: 1px solid rgba(255,255,255,0.12); font-family: ${SANS}; font-size: 0.98rem; font-weight: 300; transition: border-color 0.4s ease; }
        .wk-field input::placeholder { color: rgba(255,255,255,0.22); }
        .wk-field input:focus { border-bottom-color: ${GOLD}; }
        .wk-form-actions { grid-column: 1 / -1; display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap; }
        .wk-submit { position: relative; overflow: hidden; padding: 0.95rem 2.4rem; cursor: pointer; background: transparent; border: 1px solid rgba(200,169,110,0.35); color: ${GOLD}; font-family: ${SANS}; font-size: 0.62rem; font-weight: 600; letter-spacing: 0.3em; text-transform: uppercase; }
        .wk-submit:disabled { opacity: 0.6; cursor: wait; }
        .wk-submit > span { position: relative; z-index: 2; transition: color 0.4s ease; }
        .wk-submit::after { content: ''; position: absolute; inset: 0; background: ${GOLD}; transform: scaleX(0); transform-origin: left; transition: transform 0.5s cubic-bezier(0.16,0.84,0.44,1); }
        .wk-submit:not(:disabled):hover::after { transform: scaleX(1); }
        .wk-submit:not(:disabled):hover > span { color: #060F0B; }
        .wk-error { font-family: ${SANS}; font-size: 0.78rem; color: rgba(220,120,100,0.85); margin: 0; }
        .wk-success { padding: 0.5rem 0; }
        .wk-success-line { margin: 0; font-family: ${DISPLAY}; font-weight: 300; font-style: italic; color: #fff; font-size: clamp(1.2rem, 1.6vw, 1.6rem); }
        .wk-cursive { font-family: ${NUSRAT}; color: ${GOLD}; font-style: normal; }
        .wk-success-sub { margin: 0.6rem 0 0; font-family: ${SANS}; font-size: 0.85rem; font-weight: 300; color: rgba(255,255,255,0.4); }
        .wk-text-link { margin-top: 1rem; background: none; border: none; padding: 0; cursor: pointer; font-family: ${SANS}; font-size: 0.62rem; font-weight: 600; letter-spacing: 0.25em; text-transform: uppercase; color: ${GOLD}; }

        /* ── EMPTY ── */
        .wk-empty { border-top: 1px solid rgba(255,255,255,0.07); }
        .wk-empty-h { margin: 3rem 0 0; font-family: ${DISPLAY}; font-weight: 300; font-style: italic; color: rgba(255,255,255,0.55); font-size: clamp(1.4rem, 2.4vw, 2.2rem); }
        .wk-empty-p { margin: 1rem 0 0; font-family: ${SANS}; font-size: 0.9rem; font-weight: 300; color: rgba(255,255,255,0.32); }
        .wk-empty-p a { color: ${GOLD}; text-decoration: none; }

        /* ── CTA strip ── */
        .wk-cta-strip { padding: clamp(4rem, 10vh, 8rem) 0; border-top: 1px solid rgba(255,255,255,0.07); text-align: center; }
        .wk-cta-strip h2 { margin: 0 auto; max-width: 22ch; font-family: ${DISPLAY}; font-weight: 300; font-style: italic; color: #fff; font-size: clamp(1.8rem, 3.6vw, 3.2rem); line-height: 1.18; }
        .wk-cta-strip .sub { margin: 1.4rem auto 2.6rem; max-width: 38ch; font-family: ${SANS}; font-size: clamp(0.85rem, 0.95vw, 0.98rem); font-weight: 300; color: rgba(255,255,255,0.45); line-height: 1.8; }
        .wk-cta-link { display: inline-flex; align-items: center; gap: 1rem; text-decoration: none; }
        .wk-cta-link .ln { width: 1.6rem; height: 1px; background: ${GOLD}; transition: width 0.45s cubic-bezier(0.16,0.84,0.44,1); display: inline-block; }
        .wk-cta-link:hover .ln { width: 3rem; }
        .wk-cta-link .lbl { font-family: ${SANS}; font-size: 0.68rem; font-weight: 600; letter-spacing: 0.3em; text-transform: uppercase; color: ${GOLD}; }
      `}</style>

      <div className="wk-grain" />

      <div className="wk-content">
        {/* ── HERO ── */}
        <section className="wk-hero wk-pad">
          <div className="wk-wrap" style={{ width: '100%' }}>
            <div className="wk-eyebrow">
              <span className="rule" />
              The Neelakar Workshops
              <span className="roman">{ROMAN}</span>
            </div>
            <h1 className="wk-title">
              <span className="wk-line"><span>A season</span></span>
              <span className="wk-line"><span>of <em className="gold">craft.</em></span></span>
            </h1>
            <p className="wk-accent">small rooms, real craft.</p>
            <p className="wk-lead">
              Photography, film, and brand — taught the way we practise it. Working professionals,
              limited seats, and the kind of attention you can only give a room of a few.
            </p>
            <div className="wk-hero-foot">
              <button className="wk-cta" onClick={goToProgramme}><span>View the programme</span></button>
              {hasWorkshops && (
                <span className="wk-hero-count">
                  {workshops.length} {workshops.length === 1 ? 'session' : 'sessions'}
                  <span className="dotsep" /> One season
                </span>
              )}
            </div>
          </div>
          <div className="wk-scrollcue">
            <span className="word">Scroll</span>
            <span className="bar" />
          </div>
        </section>

        {/* ── THE IDEA ── */}
        <section className="wk-intro wk-pad">
          <div className="wk-wrap">
            <div className="wk-reveal wk-sec-label"><span className="rule" />The Idea</div>
            <div className="wk-intro-grid wk-reveal">
              <h2>Not a lecture. <br /><span className="gold">A working room.</span></h2>
              <div>
                <p>
                  Our workshops aren&rsquo;t slideshows. They&rsquo;re small cohorts in a real studio, with real
                  gear and real briefs — the same way we shoot for our clients.
                </p>
                <p>
                  You make things from the first hour. You get notes from people who do this for a
                  living. And you leave with work, not just notes.
                </p>
              </div>
            </div>
            <div className="wk-stats wk-reveal">
              <div className="wk-stat"><div className="k">Small cohorts</div><div className="v">Never a crowd</div></div>
              <div className="wk-stat"><div className="k">Working pros</div><div className="v">Taught by makers</div></div>
              <div className="wk-stat"><div className="k">Real gear</div><div className="v">Hands on, day one</div></div>
            </div>
          </div>
        </section>

        {/* ── REVIEW ── */}
        <section className="wk-review wk-pad">
          <div className="wk-wrap">
            <div className="wk-reveal wk-sec-label"><span className="rule" />From the room</div>
            <div className="wk-review-grid wk-reveal">
              <div className="wk-video" role="button" aria-label="Play attendee story">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://picsum.photos/id/1062/1280/800" alt="" />
                <div className="veil" />
                <span className="vcorner tl" />
                <span className="vcorner br" />
                <div className="wk-play"><div className="ring"><div className="tri" /></div></div>
                <span className="vlabel">Attendee story · 2 min</span>
              </div>
              <div>
                <p className="wk-quote">
                  <span className="mark">“</span>{featuredReview.quote}<span className="mark">”</span>
                </p>
                <div className="wk-review-by">
                  <div className="nm">{featuredReview.authorName}</div>
                  <div className="rl">{featuredReview.authorRole}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── LEARN ── */}
        <section className="wk-learn wk-pad">
          <div className="wk-wrap">
            <div className="wk-learn-head wk-reveal">
              <div className="wk-sec-label" style={{ marginBottom: 0 }}><span className="rule" />What you&rsquo;ll learn</div>
              <h2>The craft, end to end.</h2>
            </div>
            <div className="wk-pillars">
              {PILLARS.map((p) => (
                <div key={p.n} className="wk-pillar wk-reveal">
                  <div className="pn">{p.n}</div>
                  <div>
                    <h3>{p.title}</h3>
                    <p>{p.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PROGRAMME (admin-controlled) ── */}
        <section id="programme" className="wk-programme wk-pad">
          <div className="wk-wrap">
            <div className="wk-programme-head wk-reveal">
              <h2>The Programme</h2>
              <div className="wk-sec-label" style={{ marginBottom: 0 }}><span className="rule" />Upcoming sessions</div>
            </div>

            {categories.length > 2 && (
              <div className="wk-filters wk-reveal">
                {categories.map((c) => (
                  <button key={c} className="wk-filter" data-active={filter === c} onClick={() => { setFilter(c); setOpenId(null) }}>
                    {c}
                  </button>
                ))}
              </div>
            )}

            {hasWorkshops ? (
              <div className="wk-list">
                {visible.map((w, i) => {
                  const full = w.spotsLeft === 0
                  const open = openId === w.id
                  const tone = full ? 'full' : w.spotsLeft <= 5 ? 'low' : 'ok'
                  return (
                    <article key={w.id} className="wk-row" data-open={open}>
                      <div className="wk-glow" />
                      <div className="wk-row-main">
                        <div className="wk-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</div>
                        <div className="wk-body">
                          <div className="wk-cat">{w.category}</div>
                          <h3 className="wk-name">
                            {w.title}
                            {w.highlight && <span className="wk-feature">featured.</span>}
                          </h3>
                          {w.description && <p className="wk-desc">{w.description}</p>}
                          <div className="wk-meta">
                            <span className="m">{w.dateDisplay}</span>
                            <span className="m">{w.location}</span>
                            <span className="m">{w.duration}</span>
                            <LevelDots level={w.level} />
                            {w.instructor && <span className="m">Led by {w.instructor}</span>}
                          </div>
                        </div>
                        <div className="wk-aside">
                          <div className="wk-price">{w.priceDisplay}</div>
                          <div className="wk-spots" data-tone={tone}>
                            {full ? 'Fully booked' : `${w.spotsLeft} ${w.spotsLeft === 1 ? 'seat' : 'seats'} left`}
                          </div>
                          {!full && (
                            <button className="wk-reserve" aria-expanded={open} onClick={() => setOpenId(open ? null : w.id)}>
                              <span className="ln" />
                              <span className="lbl">{open ? 'Close' : 'Reserve'}</span>
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="wk-expand" data-open={open && !full}>
                        <div className="wk-expand-inner">
                          <div className="wk-expand-pad">
                            {open && !full && <RegisterForm workshop={w} onDone={() => setOpenId(null)} />}
                          </div>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            ) : (
              <div className="wk-empty wk-reveal">
                <p className="wk-empty-h">The next season is being written.</p>
                <p className="wk-empty-p">
                  New workshops are announced on{' '}
                  <a href="https://www.instagram.com/neelakar_house" target="_blank" rel="noopener noreferrer">@Neelakar_House</a> first.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="wk-cta-strip wk-pad">
          <div className="wk-wrap wk-reveal">
            <h2>Don&rsquo;t see your craft on the list?</h2>
            <p className="sub">Tell us what you want to learn. If there&rsquo;s a room for it, we&rsquo;ll build the session.</p>
            <a href="/create-with-us" className="wk-cta-link">
              <span className="ln" />
              <span className="lbl">Tell us</span>
            </a>
          </div>
        </section>

        <FooterSection />
      </div>
    </main>
  )
}
