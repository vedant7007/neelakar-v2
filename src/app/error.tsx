'use client'

const GOLD = '#C8A96E'
const DISPLAY = "var(--font-neel-display), 'Playfair Display', serif"
const SANS = "var(--font-dm-sans), 'DM Sans', sans-serif"

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ backgroundColor: '#060F0B' }}
    >
      <span
        style={{
          fontFamily: SANS, fontSize: 'clamp(0.6rem, 0.7vw, 0.75rem)', fontWeight: 600,
          color: GOLD, letterSpacing: '0.45em', textTransform: 'uppercase',
        }}
      >
        Interlude
      </span>
      <h1
        className="mt-6"
        style={{
          fontFamily: DISPLAY, fontSize: 'clamp(2.4rem, 5vw, 4.5rem)', fontWeight: 300,
          fontStyle: 'italic', color: '#fff', lineHeight: 1.1, letterSpacing: '-0.02em',
        }}
      >
        Something went off-script.
      </h1>
      <p
        className="mt-5 max-w-md"
        style={{
          fontFamily: SANS, fontSize: 'clamp(0.85rem, 0.95vw, 1rem)', fontWeight: 300,
          color: 'rgba(255,255,255,0.4)', lineHeight: 1.8,
        }}
      >
        An unexpected error interrupted the show. One more take usually fixes it.
      </p>
      <button
        onClick={reset}
        className="group relative overflow-hidden px-10 py-4 mt-12 transition-all duration-300"
        style={{
          fontFamily: SANS, fontSize: 'clamp(0.62rem, 0.68vw, 0.7rem)', fontWeight: 600,
          letterSpacing: '0.35em', textTransform: 'uppercase',
          backgroundColor: 'transparent', color: GOLD,
          border: '1px solid rgba(200,169,110,0.3)', cursor: 'pointer',
        }}
      >
        <span className="relative z-10 transition-colors duration-400 group-hover:text-[#060F0B]">Try again</span>
        <span
          className="absolute inset-0 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out"
          style={{ backgroundColor: GOLD }}
        />
      </button>
    </main>
  )
}
