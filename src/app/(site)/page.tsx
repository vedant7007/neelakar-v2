import Image from 'next/image'
import MagazineCoverHero from '@/components/sections/MagazineCoverHero'
import HandwrittenStatementSection from '@/components/sections/HandwrittenStatementSection'
import ImageTextCollapseSection from '@/components/sections/ImageTextCollapseSection'
import CampaignsSection from '@/components/sections/CampaignsSection'
import WhatWeDoSection from '@/components/sections/WhatWeDoSection'
import FooterSection from '@/components/sections/FooterSection'

export default function Home() {
  return (
    <main className="overflow-x-hidden" style={{ backgroundColor: '#060F0B' }}>
      {/* Fixed corner logo */}
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

      <MagazineCoverHero />
      <HandwrittenStatementSection />
      <ImageTextCollapseSection />
      <CampaignsSection />
      <WhatWeDoSection />
      <FooterSection />
    </main>
  )
}
