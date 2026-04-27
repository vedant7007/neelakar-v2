'use client'

const BG_COLOR = '#060F0B'

export default function PlaceholderSection() {
  return (
    <div
      className="relative z-[4] w-full h-screen flex items-center justify-center"
      style={{ backgroundColor: BG_COLOR }}
    >
      <div className="text-center">
        <h2
          className="font-display text-[clamp(2.5rem,5vw,5rem)] font-light italic text-white/10 mb-4 tracking-wide"
        >
          More to come
        </h2>
        <p className="font-sans text-sm text-white/15 tracking-[0.3em] uppercase font-light">
          Stay tuned
        </p>
      </div>
    </div>
  )
}
