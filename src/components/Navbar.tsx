'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const GOLD = '#C8A96E'
const SANS = "var(--font-dm-sans), 'DM Sans', sans-serif"

const LINKS = [
  { label: 'Production', href: '/production' },
  { label: 'Create With Us', href: '/create-with-us' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [show, setShow] = useState(false)
  const isHome = pathname === '/'
  const hide = pathname === '/create-with-us'

  useEffect(() => {
    if (hide) return
    if (!isHome) {
      setShow(true)
      return
    }
    const st = ScrollTrigger.create({
      trigger: document.documentElement,
      start: '80vh top',
      onEnter: () => setShow(true),
      onLeaveBack: () => setShow(false),
    })
    return () => st.kill()
  }, [isHome, hide])

  if (hide) return null

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-[100] transition-all duration-700"
      style={{
        opacity: show ? 1 : 0,
        transform: show ? 'translateY(0)' : 'translateY(-100%)',
        pointerEvents: show ? 'auto' : 'none',
      }}
    >
      <div
        className="flex items-center justify-between px-6 md:px-10 py-4"
        style={{
          backdropFilter: 'blur(20px)',
          backgroundColor: 'rgba(6,15,11,0.7)',
          borderBottom: '1px solid rgba(200,169,110,0.06)',
        }}
      >
        <Link href="/" className="relative w-8 h-8 shrink-0 opacity-80 hover:opacity-100 transition-opacity">
          <Image src="/NCH_logo_white.png" alt="Neelakar" fill className="object-contain" sizes="32px" />
        </Link>
        <div className="flex items-center gap-7 md:gap-10">
          {LINKS.map(({ label, href }) => {
            const active = pathname === href
            return (
              <Link key={href} href={href} className="group relative" style={{ textDecoration: 'none' }}>
                <span
                  className="transition-colors duration-300 group-hover:!text-white"
                  style={{
                    fontFamily: SANS,
                    fontSize: 'clamp(0.6rem, 0.7vw, 0.75rem)',
                    fontWeight: active ? 600 : 400,
                    color: active ? GOLD : 'rgba(255,255,255,0.5)',
                    letterSpacing: '0.25em',
                    textTransform: 'uppercase',
                  }}
                >
                  {label}
                </span>
                <span
                  className="absolute -bottom-1 left-0 h-px transition-all duration-500"
                  style={{
                    width: active ? '100%' : '0%',
                    backgroundColor: GOLD,
                    opacity: 0.5,
                  }}
                />
                {!active && (
                  <span
                    className="absolute -bottom-1 left-0 h-px w-0 group-hover:w-full transition-all duration-500"
                    style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                  />
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
