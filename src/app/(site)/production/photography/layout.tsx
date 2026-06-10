import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Photography — Neelakar Creative House',
  description:
    'Editorial fashion, jewellery, and campaign photography by Neelakar Creative House — a visual portfolio of light, texture, and story.',
  openGraph: {
    title: 'Photography — Neelakar Creative House',
    description:
      'Editorial fashion, jewellery, and campaign photography — a visual portfolio of light, texture, and story.',
  },
}

export default function PhotographyLayout({ children }: { children: React.ReactNode }) {
  return children
}
