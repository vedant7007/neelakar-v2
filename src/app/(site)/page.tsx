import Image from 'next/image'
import LogoRevealSection from '@/components/sections/LogoRevealSection'
import HandwrittenStatementSection from '@/components/sections/HandwrittenStatementSection'
import ImageTextCollapseSection from '@/components/sections/ImageTextCollapseSection'
import CampaignsSection from '@/components/sections/CampaignsSection'
import WhatWeDoSection from '@/components/sections/WhatWeDoSection'
import PlaceholderSection from '@/components/sections/PlaceholderSection'

export default function Home() {
  return (
    <main className="overflow-x-hidden" style={{ backgroundColor: '#060F0B' }}>
      <div className="fixed top-5 left-5 z-[100] pointer-events-none mix-blend-difference">
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

      <LogoRevealSection />
      <HandwrittenStatementSection />
      <ImageTextCollapseSection />
      <CampaignsSection />
      <WhatWeDoSection />
      <PlaceholderSection />
    </main>
  )
}
