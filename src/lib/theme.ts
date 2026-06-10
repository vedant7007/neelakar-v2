// Brand design tokens — the single source of truth for colours and font stacks.
// Components import these instead of re-declaring the hex/font strings locally.

export const COLORS = {
  bg: '#060F0B',     // dark green-black — primary background
  gold: '#C8A96E',   // warm gold — accent
  cream: '#E8E2D9',  // light cream — inverted sections
  ink: '#141414',    // near-black — admin surfaces
} as const

export const FONTS = {
  display: "var(--font-neel-display), 'Playfair Display', serif", // headings
  sans: "var(--font-dm-sans), 'DM Sans', sans-serif",             // body
  nusrat: "'Nusrat', cursive",                                    // handwritten accent
} as const
