'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const BG = '#060F0B'
const GOLD = '#C8A96E'
const SANS = "var(--font-dm-sans), 'DM Sans', sans-serif"
const DISPLAY = "var(--font-neel-display), 'Playfair Display', serif"

const img = (id: string, w = 1920, h = 1080) =>
  `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&q=90`

interface Project {
  id: number
  title: string
  category: string
  image: string
  client?: string
}

const PROJECTS: Project[] = [
  { id: 1, title: 'Meridian Collection', category: 'Editorial', image: 'photo-1509631179647-0177331693ae', client: 'Sabyasachi' },
  { id: 2, title: 'Velvet Hour', category: 'Portrait', image: 'photo-1534528741775-53994a69daeb' },
  { id: 3, title: 'The Radiance Edit', category: 'Jewellery', image: 'photo-1602751584552-8ba73aad10e1', client: 'Tanishq' },
  { id: 4, title: 'Urban Symmetry', category: 'Architecture', image: 'photo-1487958449943-2429e8be8625' },
  { id: 5, title: 'Gilded', category: 'Jewellery', image: 'photo-1515562141589-67f0d569b6f5', client: 'Krishna Pearls' },
  { id: 6, title: 'Front Row', category: 'Editorial', image: 'photo-1469334031218-e382a71b716b', client: 'Rahul Mishra' },
  { id: 7, title: 'Silhouette', category: 'Editorial', image: 'photo-1558618666-fcd25c85f82e' },
  { id: 8, title: 'Essence', category: 'Product', image: 'photo-1581044777550-4cfa60707998' },
  { id: 9, title: 'Lumière', category: 'Portrait', image: 'photo-1531746020798-e6953c6e8e04' },
  { id: 10, title: 'Chrono', category: 'Product', image: 'photo-1523275335684-37898b6baf30' },
  { id: 11, title: 'Horizon', category: 'Editorial', image: 'photo-1505765050516-f72dcac9c60e' },
  { id: 12, title: 'Atelier No. 4', category: 'Editorial', image: 'photo-1583391733956-6c78276477e2', client: 'Raw Mango' },
  { id: 13, title: 'RETINA', category: 'Product', image: 'photo-1606800052052-a08af7148866' },
  { id: 14, title: 'The Pearl', category: 'Jewellery', image: 'photo-1617038220319-276d3cfab638', client: 'Kalyan' },
  { id: 15, title: 'Steps That Leave No Trace', category: 'Portrait', image: 'photo-1494790108377-be9c29b29330' },
  { id: 16, title: 'Dust & Gold', category: 'Editorial', image: 'photo-1558171813-4c088753af8f' },
]

const CATEGORIES = ['All', 'Editorial', 'Portrait', 'Jewellery', 'Product', 'Architecture']

export default function PhotographyPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showArchive, setShowArchive] = useState(false)
  const [activeFilter, setActiveFilter] = useState('All')
  const [detailsOpen, setDetailsOpen] = useState(false)
  const viewerRef = useRef<HTMLDivElement>(null)
  const archiveRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)

  const filtered = activeFilter === 'All'
    ? PROJECTS
    : PROJECTS.filter((p) => p.category === activeFilter)

  const current = showArchive ? filtered[0] : PROJECTS[currentIndex]

  const goTo = useCallback((idx: number) => {
    if (!imageRef.current) return
    gsap.to(imageRef.current, {
      opacity: 0,
      scale: 1.03,
      duration: 0.35,
      ease: 'power2.in',
      onComplete: () => {
        setCurrentIndex(idx)
        gsap.fromTo(imageRef.current, { opacity: 0, scale: 0.97 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' })
      },
    })
  }, [])

  const prev = useCallback(() => {
    goTo(currentIndex <= 0 ? PROJECTS.length - 1 : currentIndex - 1)
  }, [currentIndex, goTo])

  const next = useCallback(() => {
    goTo(currentIndex >= PROJECTS.length - 1 ? 0 : currentIndex + 1)
  }, [currentIndex, goTo])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (showArchive) return
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [prev, next, showArchive])

  useEffect(() => {
    if (!showArchive || !archiveRef.current) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.archive-row').forEach((el, i) => {
        gsap.fromTo(el,
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.4, delay: i * 0.03, ease: 'power2.out' }
        )
      })
    }, archiveRef.current)
    return () => ctx.revert()
  }, [showArchive, activeFilter])

  const selectFromArchive = (project: Project) => {
    const idx = PROJECTS.findIndex((p) => p.id === project.id)
    if (idx >= 0) {
      setCurrentIndex(idx)
      setShowArchive(false)
    }
  }

  return (
    <div className="fixed inset-0 flex flex-col" style={{ backgroundColor: BG }}>

      {/* ═══ TOP NAV ═══ */}
      <nav className="relative z-50 flex items-center justify-between px-5 md:px-8 py-4"
        style={{ backgroundColor: 'rgba(6,15,11,0.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(200,169,110,0.06)' }}>
        <Link href="/production" className="flex items-center gap-3 group" style={{ textDecoration: 'none' }}>
          <svg className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1"
            style={{ color: 'rgba(255,255,255,0.3)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" />
          </svg>
          <span style={{
            fontFamily: DISPLAY, fontSize: 'clamp(0.9rem, 1.2vw, 1.1rem)',
            fontWeight: 400, fontStyle: 'italic', color: '#fff',
          }}>Neelakar</span>
        </Link>

        <div className="flex items-center gap-6 md:gap-8">
          <button onClick={() => setShowArchive(!showArchive)}
            className="cursor-pointer transition-colors duration-300 hover:!text-white"
            style={{
              fontFamily: SANS, fontSize: 'clamp(0.55rem, 0.65vw, 0.68rem)',
              fontWeight: 500, color: showArchive ? GOLD : 'rgba(255,255,255,0.4)',
              letterSpacing: '0.3em', textTransform: 'uppercase',
              background: 'none', border: 'none',
            }}>Archive</button>
          <Link href="/production/videography"
            className="transition-colors duration-300 hover:!text-white"
            style={{
              fontFamily: SANS, fontSize: 'clamp(0.55rem, 0.65vw, 0.68rem)',
              fontWeight: 500, color: 'rgba(255,255,255,0.4)',
              letterSpacing: '0.3em', textTransform: 'uppercase', textDecoration: 'none',
            }}>Film</Link>
          <Link href="/create-with-us"
            className="transition-colors duration-300 hover:!text-white"
            style={{
              fontFamily: SANS, fontSize: 'clamp(0.55rem, 0.65vw, 0.68rem)',
              fontWeight: 500, color: 'rgba(255,255,255,0.4)',
              letterSpacing: '0.3em', textTransform: 'uppercase', textDecoration: 'none',
            }}>Contact</Link>
        </div>
      </nav>

      {/* ═══ MAIN CONTENT ═══ */}
      {!showArchive ? (
        /* ─── FULLSCREEN VIEWER ─── */
        <div ref={viewerRef} className="relative flex-1 overflow-hidden">
          {/* Image */}
          <div ref={imageRef} className="absolute inset-0">
            <Image
              src={img(current.image)}
              alt={current.title}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0" style={{
              background: 'linear-gradient(to top, rgba(6,15,11,0.7) 0%, rgba(6,15,11,0.1) 30%, rgba(6,15,11,0.05) 60%, rgba(6,15,11,0.3) 100%)',
            }} />
          </div>

          {/* Prev / Next controls */}
          <button onClick={prev}
            className="absolute left-0 top-0 bottom-0 w-1/4 z-20 cursor-w-resize group"
            style={{ background: 'none', border: 'none' }}>
            <div className="absolute left-5 md:left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <svg className="h-6 w-6" style={{ color: '#fff' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </div>
          </button>
          <button onClick={next}
            className="absolute right-0 top-0 bottom-0 w-1/4 z-20 cursor-e-resize group"
            style={{ background: 'none', border: 'none' }}>
            <div className="absolute right-5 md:right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <svg className="h-6 w-6" style={{ color: '#fff' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </div>
          </button>

          {/* Bottom bar — title + counter + details toggle */}
          <div className="absolute bottom-0 left-0 right-0 z-30 px-5 md:px-8 pb-6 md:pb-8 flex items-end justify-between">
            <div>
              {current.client && (
                <span className="block mb-1" style={{
                  fontFamily: SANS, fontSize: '0.58rem', fontWeight: 500,
                  color: GOLD, letterSpacing: '0.35em', textTransform: 'uppercase',
                }}>{current.client}</span>
              )}
              <h2 style={{
                fontFamily: DISPLAY, fontSize: 'clamp(1.6rem, 3vw, 2.8rem)',
                fontWeight: 300, fontStyle: 'italic', color: '#fff', lineHeight: 1.1,
              }}>{current.title}</h2>
              <span className="block mt-2" style={{
                fontFamily: SANS, fontSize: '0.6rem', fontWeight: 400,
                color: 'rgba(255,255,255,0.3)', letterSpacing: '0.2em', textTransform: 'uppercase',
              }}>{current.category}</span>
            </div>

            <div className="flex items-center gap-6">
              <button onClick={() => setDetailsOpen(!detailsOpen)}
                className="cursor-pointer transition-colors duration-300 hover:!text-white"
                style={{
                  fontFamily: SANS, fontSize: '0.6rem', fontWeight: 500,
                  color: detailsOpen ? GOLD : 'rgba(255,255,255,0.4)',
                  letterSpacing: '0.25em', textTransform: 'uppercase',
                  background: 'none', border: 'none',
                }}>{detailsOpen ? 'Close' : 'Details'}</button>

              <span style={{
                fontFamily: SANS, fontSize: '0.7rem', fontWeight: 300,
                color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em',
                fontVariantNumeric: 'tabular-nums',
              }}>
                {String(currentIndex + 1).padStart(2, '0')}/{String(PROJECTS.length).padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* Details panel */}
          <div className="absolute bottom-20 md:bottom-24 right-5 md:right-8 z-30 transition-all duration-500"
            style={{
              opacity: detailsOpen ? 1 : 0,
              transform: detailsOpen ? 'translateY(0)' : 'translateY(12px)',
              pointerEvents: detailsOpen ? 'auto' : 'none',
            }}>
            <div className="p-5 md:p-6 max-w-xs" style={{
              backgroundColor: 'rgba(6,15,11,0.85)', backdropFilter: 'blur(20px)',
              border: '1px solid rgba(200,169,110,0.08)',
            }}>
              <span className="block mb-3" style={{
                fontFamily: SANS, fontSize: '0.55rem', fontWeight: 600,
                color: GOLD, letterSpacing: '0.4em', textTransform: 'uppercase',
              }}>Project Details</span>
              <h3 style={{
                fontFamily: DISPLAY, fontSize: '1.1rem', fontWeight: 400,
                fontStyle: 'italic', color: '#fff',
              }}>{current.title}</h3>
              {current.client && (
                <p className="mt-2" style={{
                  fontFamily: SANS, fontSize: '0.75rem', fontWeight: 300,
                  color: 'rgba(255,255,255,0.4)',
                }}>Client: {current.client}</p>
              )}
              <p className="mt-1" style={{
                fontFamily: SANS, fontSize: '0.75rem', fontWeight: 300,
                color: 'rgba(255,255,255,0.4)',
              }}>Category: {current.category}</p>
              <div className="mt-4">
                <Link href="/create-with-us"
                  className="inline-flex items-center gap-2 transition-colors duration-300 hover:!text-white"
                  style={{
                    fontFamily: SANS, fontSize: '0.6rem', fontWeight: 600,
                    color: GOLD, letterSpacing: '0.25em', textTransform: 'uppercase',
                    textDecoration: 'none',
                  }}>
                  Inquire
                  <span className="inline-block h-px w-4" style={{ backgroundColor: GOLD }} />
                </Link>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 z-40 h-[2px]" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
            <div className="h-full transition-all duration-500 ease-out" style={{
              width: `${((currentIndex + 1) / PROJECTS.length) * 100}%`,
              backgroundColor: GOLD, opacity: 0.5,
            }} />
          </div>
        </div>
      ) : (
        /* ─── ARCHIVE LIST ─── */
        <div ref={archiveRef} className="flex-1 overflow-y-auto" style={{ backgroundColor: BG }}>
          {/* Category filters */}
          <div className="sticky top-0 z-20 px-5 md:px-8 py-4 flex items-center gap-5 overflow-x-auto"
            style={{ backgroundColor: 'rgba(6,15,11,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(200,169,110,0.06)' }}>
            {CATEGORIES.map((cat) => (
              <button key={cat} onClick={() => setActiveFilter(cat)}
                className="cursor-pointer whitespace-nowrap transition-colors duration-200"
                style={{
                  fontFamily: SANS, fontSize: '0.6rem', fontWeight: activeFilter === cat ? 600 : 400,
                  color: activeFilter === cat ? GOLD : 'rgba(255,255,255,0.35)',
                  letterSpacing: '0.25em', textTransform: 'uppercase',
                  background: 'none', border: 'none',
                }}>{cat}</button>
            ))}
          </div>

          {/* Numbered list */}
          <div className="px-5 md:px-8 py-4">
            {filtered.map((project, i) => (
              <div key={project.id}
                className="archive-row group flex items-center gap-5 md:gap-8 py-3 md:py-4 cursor-pointer transition-all duration-300 hover:pl-2"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}
                onClick={() => selectFromArchive(project)}>
                <span className="shrink-0 w-8 text-right" style={{
                  fontFamily: SANS, fontSize: '0.65rem', fontWeight: 300,
                  color: 'rgba(255,255,255,0.15)', fontVariantNumeric: 'tabular-nums',
                }}>{String(i + 1).padStart(2, '0')}</span>

                <div className="shrink-0 relative w-12 h-12 md:w-16 md:h-16 overflow-hidden opacity-50 group-hover:opacity-100 transition-opacity duration-300">
                  <Image src={img(project.image, 128, 128)} alt="" fill className="object-cover" sizes="64px" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="truncate transition-colors duration-300 group-hover:!text-white" style={{
                    fontFamily: DISPLAY, fontSize: 'clamp(0.95rem, 1.2vw, 1.15rem)',
                    fontWeight: 400, fontStyle: 'italic', color: 'rgba(255,255,255,0.55)',
                  }}>{project.title}</h3>
                  {project.client && (
                    <span className="block mt-0.5" style={{
                      fontFamily: SANS, fontSize: '0.58rem', fontWeight: 400,
                      color: 'rgba(255,255,255,0.2)', letterSpacing: '0.15em',
                    }}>{project.client}</span>
                  )}
                </div>

                <span className="shrink-0 hidden md:block" style={{
                  fontFamily: SANS, fontSize: '0.58rem', fontWeight: 400,
                  color: 'rgba(255,255,255,0.15)', letterSpacing: '0.2em', textTransform: 'uppercase',
                }}>{project.category}</span>

                <span className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ color: GOLD }}>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                  </svg>
                </span>
              </div>
            ))}
          </div>

          {/* Archive footer */}
          <div className="px-5 md:px-8 py-8 mt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            <div className="flex items-center justify-between">
              <span style={{
                fontFamily: SANS, fontSize: '0.6rem', fontWeight: 300,
                color: 'rgba(255,255,255,0.15)', letterSpacing: '0.15em',
              }}>{filtered.length} {filtered.length === 1 ? 'project' : 'projects'}</span>
              <Link href="/create-with-us"
                className="inline-flex items-center gap-2 transition-colors duration-300 hover:!text-white"
                style={{
                  fontFamily: SANS, fontSize: '0.6rem', fontWeight: 500,
                  color: GOLD, letterSpacing: '0.25em', textTransform: 'uppercase',
                  textDecoration: 'none',
                }}>
                Work with us
                <span className="inline-block h-px w-4" style={{ backgroundColor: GOLD }} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
