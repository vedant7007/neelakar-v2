import HomeCornerLogo from '@/components/HomeCornerLogo'
import MagazineCoverHero from '@/components/sections/MagazineCoverHero'
import HandwrittenStatementSection from '@/components/sections/HandwrittenStatementSection'
import ImageTextCollapseSection from '@/components/sections/ImageTextCollapseSection'
import CampaignsSection from '@/components/sections/CampaignsSection'
import WhatWeDoSection from '@/components/sections/WhatWeDoSection'
import FooterSection from '@/components/sections/FooterSection'

export default function Home() {
  return (
    <main className="overflow-x-hidden" style={{ backgroundColor: '#060F0B' }}>
      {/* Fixed corner logo — hides when Navbar takes over */}
      <HomeCornerLogo />

      <MagazineCoverHero />
      <HandwrittenStatementSection />
      <ImageTextCollapseSection />
      <CampaignsSection />
      <WhatWeDoSection />
      <FooterSection />
    </main>
  )
}
