import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create With Us — Neelakar Creative House',
  description:
    'Start a project with Neelakar Creative House. Tell us about your brand, your ambitions, and the story you want the world to feel.',
  openGraph: {
    title: 'Create With Us — Neelakar Creative House',
    description:
      'Start a project with Neelakar Creative House. Tell us about your brand and the story you want the world to feel.',
  },
}

export default function CreateWithUsLayout({ children }: { children: React.ReactNode }) {
  return children
}
