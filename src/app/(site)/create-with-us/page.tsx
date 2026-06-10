'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import Shuffle from '@/components/Shuffle'

const BG = '#060F0B'
const GOLD = '#C8A96E'
const SANS = "var(--font-dm-sans), 'DM Sans', sans-serif"
const DISPLAY = "var(--font-neel-display), 'Playfair Display', serif"
const NUSRAT = "'Nusrat', cursive"

const ACT_IMAGES = [
  'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&h=1800&fit=crop&q=85',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=1800&fit=crop&q=85',
  'https://images.unsplash.com/photo-1470723710355-95304d8aece4?w=1200&h=1800&fit=crop&q=85',
  'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=1200&h=1800&fit=crop&q=85',
]

const ACTS = [
  { num: 'I', title: 'The Opening Scene', accent: 'curiosity.' },
  { num: 'II', title: 'Beneath The Surface', accent: 'transparency.' },
  { num: 'III', title: 'The Resolution', accent: 'momentum.' },
  { num: 'IV', title: 'Fin.', accent: 'beginning.' },
]

const HOW_FOUND = ['Social media', 'Word of mouth', 'Google search', 'Saw our work', 'Happy accident']
const SERVICES = ['Brand & Creative Strategy', 'Campaign & Film', 'Visual & Photography', 'Growth & Partnerships', 'Full experience']
const CHALLENGES = ["Brand doesn't convert", 'Invisible in culture', 'Content feels lifeless', 'No visual identity', 'Growth flatlined', 'Launches lack gravity']
const FLAVORS = ['Bold', 'Minimal', 'Cinematic', 'Heritage', 'Internet-native', 'Raw & unfiltered', 'Culturally-aware', 'Quiet luxury']
const AUDIENCES = ['Customers', 'Culture at large', 'Investors', 'Your own team', 'Press & media']
const PRIORITIES = ['Speed to market', 'Scale', 'Cultural impact', 'Craft & quality', 'Long-term equity']
const TIMELINES = ['Yesterday', 'This quarter', 'Next quarter', 'Planning ahead']
const BUDGETS = ['Under 5L', '5L — 15L', '15L — 50L', '50L+', 'Figuring it out']
const SUCCESS = ['Press & cultural noise', 'Community that compounds', 'Revenue', 'Investor confidence', 'Category ownership', 'One unforgettable moment']

interface FormData {
  name: string; company: string; email: string; howFound: string
  services: string[]; challenges: string[]; flavors: string[]
  audiences: string[]; priorities: string[]; timeline: string
  budget: string; success: string[]; note: string
}

const INIT: FormData = {
  name: '', company: '', email: '', howFound: '',
  services: [], challenges: [], flavors: [],
  audiences: [], priorities: [], timeline: '',
  budget: '', success: [], note: '',
}

/* ── MOUSE GLOW ── */
function MouseGlow() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const move = (e: MouseEvent) => {
      gsap.to(el, { x: e.clientX, y: e.clientY, duration: 0.6, ease: 'power2.out' })
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])
  return (
    <div ref={ref} className="fixed pointer-events-none z-[1] -translate-x-1/2 -translate-y-1/2"
      style={{ width: 600, height: 600, background: 'radial-gradient(circle, rgba(200,169,110,0.04) 0%, transparent 70%)', filter: 'blur(40px)' }} />
  )
}

/* ── CHIPS ── */
function Chips({ options, selected, onToggle, max }: {
  options: string[]; selected: string[]; onToggle: (v: string) => void; max?: number
}) {
  return (
    <div className="flex flex-wrap gap-2.5 mt-4">
      {options.map((o) => {
        const on = selected.includes(o)
        const locked = !on && max !== undefined && selected.length >= max
        return (
          <button key={o} type="button" onClick={() => !locked && onToggle(o)}
            className="group relative px-5 py-3 transition-all duration-400 overflow-hidden"
            style={{
              fontFamily: SANS, fontSize: 'clamp(0.72rem, 0.78vw, 0.82rem)',
              fontWeight: on ? 600 : 400, letterSpacing: '0.04em',
              border: `1px solid ${on ? 'rgba(200,169,110,0.6)' : 'rgba(255,255,255,0.06)'}`,
              backgroundColor: on ? 'rgba(200,169,110,0.15)' : 'transparent',
              color: on ? GOLD : locked ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.5)',
              cursor: locked ? 'not-allowed' : 'pointer',
              backdropFilter: 'blur(8px)',
            }}>
            <span className="relative z-10">{o}</span>
            {on && <span className="absolute inset-0 opacity-20"
              style={{ background: `radial-gradient(circle at 50% 50%, ${GOLD}, transparent 70%)` }} />}
            {!on && !locked && (
              <span className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full transition-all duration-500"
                style={{ backgroundColor: GOLD, opacity: 0.4 }} />
            )}
          </button>
        )
      })}
    </div>
  )
}

/* ── RADIOS ── */
function Radios({ options, selected, onSelect }: {
  options: string[]; selected: string; onSelect: (v: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-2.5 mt-4">
      {options.map((o) => {
        const on = selected === o
        return (
          <button key={o} type="button" onClick={() => onSelect(o)}
            className="group relative px-5 py-3 transition-all duration-400 overflow-hidden"
            style={{
              fontFamily: SANS, fontSize: 'clamp(0.72rem, 0.78vw, 0.82rem)',
              fontWeight: on ? 600 : 400, letterSpacing: '0.04em',
              border: `1px solid ${on ? 'rgba(200,169,110,0.6)' : 'rgba(255,255,255,0.06)'}`,
              backgroundColor: on ? 'rgba(200,169,110,0.15)' : 'transparent',
              color: on ? GOLD : 'rgba(255,255,255,0.5)',
              cursor: 'pointer',
              backdropFilter: 'blur(8px)',
            }}>
            <span className="relative z-10">{o}</span>
            {on && <span className="absolute inset-0 opacity-20"
              style={{ background: `radial-gradient(circle at 50% 50%, ${GOLD}, transparent 70%)` }} />}
            {!on && (
              <span className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full transition-all duration-500"
                style={{ backgroundColor: GOLD, opacity: 0.4 }} />
            )}
          </button>
        )
      })}
    </div>
  )
}

/* ── FIELD ── */
function Field({ label, value, onChange, placeholder, type = 'text' }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string
}) {
  const [focused, setFocused] = useState(false)
  return (
    <div className="mb-9 q-block">
      <label className="block mb-3" style={{
        fontFamily: SANS, fontSize: 'clamp(0.6rem, 0.65vw, 0.7rem)',
        fontWeight: 600, color: GOLD, letterSpacing: '0.35em', textTransform: 'uppercase',
      }}>{label}</label>
      <div className="relative">
        <input type={type} value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className="w-full bg-transparent pb-4 pt-1 outline-none placeholder:text-white/10"
          style={{
            fontFamily: SANS, fontSize: 'clamp(1.05rem, 1.2vw, 1.3rem)',
            fontWeight: 300, color: '#fff',
          }} />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/[0.06]" />
        <div className="absolute bottom-0 left-0 h-[2px] transition-all duration-700 ease-out"
          style={{
            width: focused || value ? '100%' : '0%',
            backgroundColor: GOLD,
            boxShadow: focused ? '0 0 12px rgba(200,169,110,0.3)' : 'none',
          }} />
      </div>
    </div>
  )
}

/* ── QUESTION ── */
function Q({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="mb-11 q-block">
      <p style={{
        fontFamily: DISPLAY, fontSize: 'clamp(1.05rem, 1.3vw, 1.4rem)',
        fontWeight: 400, fontStyle: 'italic', color: '#fff', lineHeight: 1.5,
      }}>{label}</p>
      {hint && <p className="mt-1" style={{
        fontFamily: SANS, fontSize: 'clamp(0.7rem, 0.75vw, 0.8rem)',
        fontWeight: 300, color: 'rgba(255,255,255,0.22)',
      }}>{hint}</p>}
      {children}
    </div>
  )
}

/* ══════════════════════════════════════════
   MAIN
   ══════════════════════════════════════════ */
function composeMessage(f: FormData): string {
  return [
    f.company && `Company / Role: ${f.company}`,
    f.howFound && `Found us via: ${f.howFound}`,
    f.challenges.length > 0 && `Challenges: ${f.challenges.join(', ')}`,
    f.flavors.length > 0 && `Brand personality: ${f.flavors.join(', ')}`,
    f.audiences.length > 0 && `Audiences: ${f.audiences.join(', ')}`,
    f.priorities.length > 0 && `Priorities: ${f.priorities.join(', ')}`,
    f.timeline && `Timeline: ${f.timeline}`,
    f.budget && `Budget: ${f.budget}`,
    f.success.length > 0 && `Success looks like: ${f.success.join(', ')}`,
    f.note && `Note: ${f.note}`,
  ].filter(Boolean).join('\n').slice(0, 5000)
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function CreateWithUsPage() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormData>(INIT)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const formRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const imageRefs = useRef<(HTMLDivElement | null)[]>([])
  const stepRef = useRef(0)
  const imagePanelRef = useRef<HTMLDivElement>(null)
  const formPanelRef = useRef<HTMLDivElement>(null)

  stepRef.current = step

  const toggle = useCallback((key: keyof FormData, val: string, max?: number) => {
    setForm((p) => {
      const arr = p[key] as string[]
      if (arr.includes(val)) return { ...p, [key]: arr.filter(v => v !== val) }
      if (max && arr.length >= max) return p
      return { ...p, [key]: [...arr, val] }
    })
  }, [])

  useEffect(() => {
    if (!formRef.current) return
    const blocks = formRef.current.querySelectorAll('.q-block')
    if (!blocks.length) return
    gsap.fromTo(blocks,
      { opacity: 0, y: 50, filter: 'blur(6px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6, ease: 'power2.out', stagger: 0.1, delay: 0.25 }
    )
  }, [step])

  useEffect(() => {
    if (!heroRef.current) return
    const els = heroRef.current.querySelectorAll('.h-anim')
    gsap.fromTo(els,
      { opacity: 0, y: 40, filter: 'blur(4px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7, ease: 'power3.out', stagger: 0.08, delay: 0.1 }
    )
  }, [step])

  const go = useCallback((next: number) => {
    const current = stepRef.current
    const tl = gsap.timeline()

    if (formRef.current) {
      tl.to(formRef.current, { opacity: 0, y: -40, filter: 'blur(6px)', duration: 0.3, ease: 'power2.in' }, 0)
    }
    if (heroRef.current) {
      tl.to(heroRef.current, { opacity: 0, y: -20, filter: 'blur(3px)', duration: 0.25, ease: 'power2.in' }, 0)
    }

    const prevImg = imageRefs.current[current]
    const nextImg = imageRefs.current[next]
    if (prevImg && nextImg) {
      tl.to(prevImg, { opacity: 0, scale: 1.05, duration: 0.5, ease: 'power1.inOut' }, 0.15)
      tl.fromTo(nextImg, { opacity: 0, scale: 1.1 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'power1.inOut' }, 0.2)
    }

    const vw = window.innerWidth
    if (vw >= 768 && imagePanelRef.current && formPanelRef.current) {
      const panelW = vw * 0.42
      const nextImageX = next % 2 === 0 ? 0 : vw - panelW
      const nextFormX = next % 2 === 0 ? 0 : -panelW
      tl.to(imagePanelRef.current, { x: nextImageX, duration: 0.75, ease: 'power3.inOut' }, 0.1)
      tl.to(formPanelRef.current, { x: nextFormX, duration: 0.75, ease: 'power3.inOut' }, 0.1)
    }

    tl.call(() => {
      setStep(next)
      if (heroRef.current) gsap.set(heroRef.current, { opacity: 1, y: 0, filter: 'blur(0px)' })
      if (formRef.current) gsap.set(formRef.current, { opacity: 1, y: 0, filter: 'blur(0px)' })
      setTimeout(() => {
        const lenis = (window as Window & { __lenis?: { scrollTo: (t: number, o?: { immediate?: boolean }) => void; resize: () => void } }).__lenis
        if (lenis) {
          lenis.scrollTo(0, { immediate: true })
          lenis.resize()
        } else {
          window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
        }
      }, 50)
    }, undefined, 0.6)
  }, [])

  const formStateRef = useRef(form)
  formStateRef.current = form
  const submittingRef = useRef(false)
  submittingRef.current = submitting

  const advance = useCallback(async () => {
    const s = stepRef.current
    const f = formStateRef.current
    if (submittingRef.current) return

    if (s === 0) {
      if (!f.name.trim()) { setFormError('Tell us your name before we begin.'); return }
      if (!EMAIL_RE.test(f.email.trim())) { setFormError('We need a valid email to reach you.'); return }
      setFormError('')
      go(1)
      return
    }
    if (s === 1) { setFormError(''); go(2); return }
    if (s === 2) {
      setFormError('')
      setSubmitting(true)
      try {
        const res = await fetch('/api/submissions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'general',
            name: f.name.trim(),
            email: f.email.trim(),
            serviceInterest: f.services.join(', ').slice(0, 100) || undefined,
            message: composeMessage(f) || undefined,
          }),
        })
        if (!res.ok) throw new Error(`Submission failed (${res.status})`)
        go(3)
      } catch {
        setFormError('Something broke on the way. Try again — or write to us directly.')
      } finally {
        setSubmitting(false)
      }
    }
  }, [go])

  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey && stepRef.current < 3) {
        if (document.activeElement?.tagName === 'TEXTAREA') return
        advance()
      }
    }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [advance])

  const progress = ((step + 1) / ACTS.length) * 100
  const imageOnLeft = step % 2 === 0

  useEffect(() => {
    const handleResize = () => {
      const vw = window.innerWidth
      const s = stepRef.current
      if (vw < 768) {
        if (imagePanelRef.current) gsap.set(imagePanelRef.current, { x: 0 })
        if (formPanelRef.current) gsap.set(formPanelRef.current, { x: 0 })
      } else {
        const panelW = vw * 0.42
        const imgX = s % 2 === 0 ? 0 : vw - panelW
        const frmX = s % 2 === 0 ? 0 : -panelW
        if (imagePanelRef.current) gsap.set(imagePanelRef.current, { x: imgX })
        if (formPanelRef.current) gsap.set(formPanelRef.current, { x: frmX })
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="relative w-full min-h-screen" style={{ backgroundColor: BG }}>
      <div className="fixed top-0 left-0 right-0 z-50 h-[2px]" style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
        <div className="h-full transition-all duration-1000 ease-out"
          style={{ width: `${progress}%`, backgroundColor: GOLD, boxShadow: '0 0 15px rgba(200,169,110,0.35)' }} />
      </div>
      <div className="hidden md:block"><MouseGlow /></div>

      {/* ── IMAGE PANEL ── */}
      <div ref={imagePanelRef} className="hidden md:block fixed left-0 top-0 w-[42vw] h-screen z-10 overflow-hidden">
        {ACT_IMAGES.map((src, i) => (
          <div key={i} ref={el => { imageRefs.current[i] = el }}
            className="absolute inset-0"
            style={{ opacity: i === 0 ? 1 : 0, willChange: 'opacity, transform' }}>
            <Image src={src} alt="" fill className="object-cover" sizes="42vw" priority={i === 0} />
          </div>
        ))}

        <div className="absolute inset-0" style={{
          background: 'linear-gradient(135deg, rgba(6,15,11,0.15) 0%, rgba(6,15,11,0.45) 50%, rgba(6,15,11,0.85) 100%)',
        }} />
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at 30% 50%, transparent 40%, rgba(6,15,11,0.5) 100%)',
        }} />

        <div className="absolute top-6 left-7 z-10 pointer-events-none">
          <div className="relative w-10 h-10">
            <Image src="/NCH_logo_white.png" alt="Neelakar" fill className="object-contain opacity-70" sizes="40px" />
          </div>
        </div>

        <div className="absolute bottom-6 left-8 pointer-events-none select-none">
          <span style={{
            fontFamily: DISPLAY, fontSize: 'clamp(8rem, 12vw, 12rem)',
            fontWeight: 300, fontStyle: 'italic',
            color: 'rgba(200,169,110,0.05)', lineHeight: 0.8,
          }}>{ACTS[step].num}</span>
        </div>

        <div className="absolute top-[12%] bottom-[12%] w-px"
          style={{ right: imageOnLeft ? 0 : 'auto', left: imageOnLeft ? 'auto' : 0, backgroundColor: GOLD, opacity: 0.1 }} />

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
          {ACTS.map((_, i) => (
            <div key={i} className="transition-all duration-600" style={{
              width: i === step ? '28px' : '6px',
              height: '6px',
              borderRadius: '3px',
              backgroundColor: i === step ? GOLD : i < step ? 'rgba(200,169,110,0.3)' : 'rgba(255,255,255,0.06)',
              boxShadow: i === step ? '0 0 10px rgba(200,169,110,0.25)' : 'none',
            }} />
          ))}
        </div>
      </div>

      {/* ── FORM PANEL ── */}
      <div ref={formPanelRef} className="relative md:ml-[42vw] min-h-screen">
        <div className="md:hidden absolute top-0 left-0 right-0 h-[30vh] z-0 overflow-hidden pointer-events-none">
          <Image src={ACT_IMAGES[step]} alt="" fill className="object-cover" sizes="100vw"
            style={{ opacity: 0.04 }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, ${BG} 0%, transparent 30%, ${BG} 100%)` }} />
        </div>

        <div className="px-6 md:px-14 lg:px-20 py-10 md:py-14 relative z-[2]">
          <div className="md:hidden mb-6">
            <div className="relative w-9 h-9">
              <Image src="/NCH_logo_white.png" alt="Neelakar" fill className="object-contain opacity-70" sizes="36px" />
            </div>
          </div>

          <div ref={heroRef} className="mb-8">
            <div className="h-anim flex items-center gap-4 mb-7">
              <div className="h-px w-8" style={{ backgroundColor: GOLD, opacity: 0.3 }} />
              <span style={{
                fontFamily: SANS, fontSize: 'clamp(0.55rem, 0.62vw, 0.65rem)',
                fontWeight: 600, color: GOLD, letterSpacing: '0.45em', textTransform: 'uppercase',
              }}>Act {ACTS[step].num}</span>
              <div className="h-px flex-1 max-w-[60px]" style={{ backgroundColor: GOLD, opacity: 0.1 }} />
            </div>

            <div className="h-anim">
              {step < 3 ? (
                <Shuffle
                  key={step}
                  text={ACTS[step].title}
                  tag="h1"
                  textAlign="left"
                  shuffleDirection="up"
                  animationMode="random"
                  maxDelay={2}
                  duration={1}
                  ease="sine.inOut"
                  shuffleTimes={1}
                  triggerOnce
                  triggerOnHover={false}
                  rootMargin="0px"
                  style={{
                    fontFamily: DISPLAY, fontSize: 'clamp(2.6rem, 4.5vw, 4.2rem)',
                    fontWeight: 300, fontStyle: 'italic', color: '#fff',
                    lineHeight: 1.1, letterSpacing: '-0.02em',
                  }}
                  className="font-[inherit] !leading-[1.1]"
                />
              ) : (
                <h1 style={{
                  fontFamily: DISPLAY, fontSize: 'clamp(2.6rem, 4.5vw, 4.2rem)',
                  fontWeight: 300, fontStyle: 'italic', color: '#fff', lineHeight: 1.1,
                }}>Fin.</h1>
              )}
            </div>

            <div className="h-anim mt-2">
              <span style={{
                fontFamily: NUSRAT, fontSize: 'clamp(1.3rem, 2vw, 1.8rem)',
                color: GOLD,
              }}>{ACTS[step].accent}</span>
            </div>

            <div className="h-anim mt-7 relative">
              <div className="h-px w-full" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }} />
              <div className="absolute left-0 top-0 h-px w-[60px]" style={{ backgroundColor: GOLD, opacity: 0.15 }} />
            </div>
          </div>

          {/* ── QUESTIONS ── */}
          <div ref={formRef} className="pt-2">
            {step === 0 && (
              <>
                <Field label="Your name" value={form.name} onChange={v => setForm({ ...form, name: v })} placeholder="What should we call you?" />
                <Field label="Company + Role" value={form.company} onChange={v => setForm({ ...form, company: v })} placeholder="Where do you build?" />
                <Field label="Email" value={form.email} onChange={v => setForm({ ...form, email: v })} placeholder="How do we reach you?" type="email" />
                <Q label="How did you find your way here?">
                  <Radios options={HOW_FOUND} selected={form.howFound} onSelect={v => setForm({ ...form, howFound: v })} />
                </Q>
                <Q label="What are you looking for?" hint="Select all that apply">
                  <Chips options={SERVICES} selected={form.services} onToggle={v => toggle('services', v)} />
                </Q>
              </>
            )}

            {step === 1 && (
              <>
                <Q label="What's the real challenge right now?" hint="Select everything that resonates">
                  <Chips options={CHALLENGES} selected={form.challenges} onToggle={v => toggle('challenges', v)} />
                </Q>
                <Q label="If your brand had a personality — what would it be?" hint="Pick up to two">
                  <Chips options={FLAVORS} selected={form.flavors} onToggle={v => toggle('flavors', v, 2)} max={2} />
                </Q>
                <Q label="Who needs to feel the shift?" hint="Select all that matter">
                  <Chips options={AUDIENCES} selected={form.audiences} onToggle={v => toggle('audiences', v)} />
                </Q>
              </>
            )}

            {step === 2 && (
              <>
                <Q label="What matters more to you right now?" hint="Pick up to two">
                  <Chips options={PRIORITIES} selected={form.priorities} onToggle={v => toggle('priorities', v, 2)} max={2} />
                </Q>
                <Q label="When do you want to begin?">
                  <Radios options={TIMELINES} selected={form.timeline} onSelect={v => setForm({ ...form, timeline: v })} />
                </Q>
                <Q label="What kind of investment are you thinking?">
                  <Radios options={BUDGETS} selected={form.budget} onSelect={v => setForm({ ...form, budget: v })} />
                </Q>
                <Q label="What does winning look like?" hint="Pick up to two">
                  <Chips options={SUCCESS} selected={form.success} onToggle={v => toggle('success', v, 2)} max={2} />
                </Q>
                <div className="q-block mb-8">
                  <p style={{
                    fontFamily: DISPLAY, fontSize: 'clamp(1.05rem, 1.3vw, 1.4rem)',
                    fontWeight: 400, fontStyle: 'italic', color: '#fff',
                  }}>Anything else we should know?</p>
                  <p className="mt-1 mb-4" style={{
                    fontFamily: SANS, fontSize: 'clamp(0.7rem, 0.75vw, 0.8rem)',
                    fontWeight: 300, color: 'rgba(255,255,255,0.22)',
                  }}>Dreams, deadlines, deal-breakers.</p>
                  <div className="relative">
                    <textarea value={form.note} onChange={e => setForm({ ...form, note: e.target.value })}
                      rows={3} placeholder="Write freely..."
                      className="w-full bg-transparent pb-4 pt-2 outline-none resize-none placeholder:text-white/8"
                      style={{ fontFamily: SANS, fontSize: 'clamp(1rem, 1.1vw, 1.15rem)', fontWeight: 300, color: '#fff' }} />
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-white/[0.06]" />
                  </div>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div className="q-block">
                  <p style={{
                    fontFamily: DISPLAY, fontSize: 'clamp(1.3rem, 1.8vw, 2rem)',
                    fontWeight: 300, fontStyle: 'italic', color: 'rgba(255,255,255,0.65)',
                    lineHeight: 1.6, maxWidth: '36ch',
                  }}>
                    We review every submission with intention. If there&rsquo;s alignment — this is where things start to move.
                  </p>
                </div>
                <div className="q-block mt-8">
                  <p style={{
                    fontFamily: SANS, fontSize: 'clamp(0.82rem, 0.9vw, 0.95rem)',
                    fontWeight: 300, color: 'rgba(255,255,255,0.28)', lineHeight: 1.9,
                  }}>
                    Expect to hear back within 48 hours.<br />
                    Until then —{' '}
                    <a href="https://www.instagram.com/neelakar_house" target="_blank" rel="noopener noreferrer"
                      className="transition-opacity duration-300 hover:opacity-70"
                      style={{ color: GOLD, textDecoration: 'none' }}>@Neelakar_House</a>
                  </p>
                </div>
                <div className="q-block mt-12">
                  <a href="/" className="inline-flex items-center gap-4 group" style={{ textDecoration: 'none' }}>
                    <span className="h-px w-6 transition-all duration-500 group-hover:w-12"
                      style={{ backgroundColor: GOLD, display: 'inline-block' }} />
                    <span style={{
                      fontFamily: SANS, fontSize: 'clamp(0.65rem, 0.72vw, 0.75rem)',
                      fontWeight: 600, color: GOLD, letterSpacing: '0.3em', textTransform: 'uppercase',
                    }}>Back to home</span>
                  </a>
                </div>
              </>
            )}
          </div>

          {/* ── NAVIGATION ── */}
          {step < 3 && formError && (
            <p className="pt-4" style={{
              fontFamily: SANS, fontSize: 'clamp(0.72rem, 0.78vw, 0.82rem)',
              fontWeight: 400, color: 'rgba(220,120,100,0.85)', letterSpacing: '0.04em',
            }}>{formError}</p>
          )}
          {step < 3 && (
            <div className="flex items-center justify-between pt-8 mt-4 border-t"
              style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
              {step > 0 ? (
                <button onClick={() => go(step - 1)}
                  className="group flex items-center gap-3"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  <span className="inline-block h-px w-5 transition-all duration-400 group-hover:w-10"
                    style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
                  <span style={{
                    fontFamily: SANS, fontSize: 'clamp(0.62rem, 0.68vw, 0.7rem)',
                    fontWeight: 500, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.25em', textTransform: 'uppercase',
                  }}>Back</span>
                </button>
              ) : <div />}

              <button onClick={advance} disabled={submitting}
                className="group relative overflow-hidden px-10 py-4 transition-all duration-300"
                style={{
                  fontFamily: SANS, fontSize: 'clamp(0.62rem, 0.68vw, 0.7rem)',
                  fontWeight: 600, letterSpacing: '0.35em', textTransform: 'uppercase',
                  backgroundColor: 'transparent', color: GOLD,
                  border: '1px solid rgba(200,169,110,0.3)',
                  cursor: submitting ? 'wait' : 'pointer',
                  opacity: submitting ? 0.6 : 1,
                }}>
                <span className="relative z-10 transition-colors duration-400 group-hover:text-[#060F0B]">
                  {step === 2 ? (submitting ? 'Sending…' : 'Submit') : 'Continue'}
                </span>
                <span className="absolute inset-0 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out"
                  style={{ backgroundColor: GOLD }} />
              </button>
            </div>
          )}

          <div className="h-6" />
        </div>
      </div>

      {/* Mobile step dots */}
      <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex gap-2.5">
        {ACTS.map((_, i) => (
          <div key={i} className="transition-all duration-500" style={{
            width: i === step ? '24px' : '6px',
            height: '6px', borderRadius: '3px',
            backgroundColor: i === step ? GOLD : i < step ? 'rgba(200,169,110,0.3)' : 'rgba(255,255,255,0.06)',
          }} />
        ))}
      </div>
    </div>
  )
}
