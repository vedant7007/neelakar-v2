import Image from 'next/image'
import LogoRevealSection from '@/components/sections/LogoRevealSection'
import HandwrittenStatementSection from '@/components/sections/HandwrittenStatementSection'
import ImageTextCollapseSection from '@/components/sections/ImageTextCollapseSection'
import CampaignsSection from '@/components/sections/CampaignsSection'
import WhatWeDoSection from '@/components/sections/WhatWeDoSection'
import PlaceholderSection from '@/components/sections/PlaceholderSection'

function SectionFade({ from, to }: { from: string; to: string }) {
  return (
    <div
      className="relative w-full h-[15vh] -mt-[1px]"
      style={{ background: `linear-gradient(to bottom, ${from}, ${to})` }}
    />
  )
}

export default function Home() {
  return (
    <main className="overflow-x-hidden" style={{ backgroundColor: '#060F0B' }}>
      <div className="fixed top-5 left-5 z-[100] pointer-events-none mix-blend-difference">
        <div className="relative w-[34px] h-[34px]">
          <Image
            src="/NCH_logo_white.png"
            alt="Neelakar"
            fill
            className="object-contain opacity-70"
            sizes="34px"
          />
        </div>
      </div>

      <LogoRevealSection />
      <SectionFade from="#060F0B" to="#C7C7C7" />
      <HandwrittenStatementSection />
      <SectionFade from="#C7C7C7" to="#060F0B" />
      <ImageTextCollapseSection />
      <CampaignsSection />
      <SectionFade from="#060F0B" to="#F5F5F0" />
      <WhatWeDoSection />
      <SectionFade from="#F5F5F0" to="#060F0B" />
      <PlaceholderSection />
    </main>
  )
}
