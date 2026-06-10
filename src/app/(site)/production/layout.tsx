import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Production — Neelakar Creative House',
  description:
    'Full-spectrum production for fashion, jewellery, and culture-defining brands — photography, films, and campaigns crafted in Hyderabad.',
  openGraph: {
    title: 'Production — Neelakar Creative House',
    description:
      'Full-spectrum production for fashion, jewellery, and culture-defining brands — photography, films, and campaigns.',
  },
}

export default function ProductionLayout({ children }: { children: React.ReactNode }) {
  return children
}
