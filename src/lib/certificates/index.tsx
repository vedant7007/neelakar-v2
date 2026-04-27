import ReactPDF from '@react-pdf/renderer'
import { ClassicTemplate } from './templates/classic'
import { ModernTemplate } from './templates/modern'
import { MinimalTemplate } from './templates/minimal'
import { CreativeTemplate } from './templates/creative'
import { DarkTemplate } from './templates/dark'

export type CertificateData = {
  template: string
  participantName: string
  workshopTitle: string
  title: string
  body: string
  instructor: string
  dates: string
  location: string
  customLine?: string
}

const TEMPLATES: Record<string, React.FC<CertificateData>> = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  minimal: MinimalTemplate,
  creative: CreativeTemplate,
  dark: DarkTemplate,
}

export async function generateCertificatePdf(data: CertificateData): Promise<Buffer> {
  const Template = TEMPLATES[data.template] || TEMPLATES.classic
  const stream = await ReactPDF.renderToStream(<Template {...data} />)

  const chunks: Uint8Array[] = []
  for await (const chunk of stream) {
    chunks.push(chunk as Uint8Array)
  }
  return Buffer.concat(chunks)
}

export const TEMPLATE_OPTIONS = [
  { key: 'classic', name: 'Classic', description: 'Clean and formal with cream background' },
  { key: 'modern', name: 'Modern', description: 'Bold typography with geometric accents' },
  { key: 'minimal', name: 'Minimal', description: 'Elegant whitespace with thin lines' },
  { key: 'creative', name: 'Creative', description: 'Artistic layout with organic elements' },
  { key: 'dark', name: 'Dark', description: 'Dark charcoal with gold accents' },
]
