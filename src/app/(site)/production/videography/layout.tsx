import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Films — Neelakar Creative House',
  description:
    'Brand films, campaign videos, and cinematic storytelling by Neelakar Creative House — motion work for fashion, jewellery, and culture.',
  openGraph: {
    title: 'Films — Neelakar Creative House',
    description:
      'Brand films, campaign videos, and cinematic storytelling — motion work for fashion, jewellery, and culture.',
  },
}

export default function VideographyLayout({ children }: { children: React.ReactNode }) {
  return children
}
