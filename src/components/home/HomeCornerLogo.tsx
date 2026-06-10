'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Visible only while the Navbar is hidden (before 80vh) — inverse of Navbar's trigger,
// so exactly one logo occupies the top-left corner at any scroll position.
export default function HomeCornerLogo() {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: document.documentElement,
      start: '80vh top',
      onEnter: () => setHidden(true),
      onLeaveBack: () => setHidden(false),
    })
    return () => st.kill()
  }, [])

  return (
    <div
      className="fixed top-5 left-5 z-[100] pointer-events-none mix-blend-difference transition-opacity duration-700"
      style={{ opacity: hidden ? 0 : 1 }}
    >
      <div className="relative w-[44px] h-[44px]">
        <Image
          src="/NCH_logo_white.png"
          alt="Neelakar"
          fill
          className="object-contain opacity-80"
          sizes="44px"
        />
      </div>
    </div>
  )
}
