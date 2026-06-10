import HomeCornerLogo from '@/components/home/HomeCornerLogo'
import MagazineCoverHero from '@/components/home/MagazineCoverHero'
import HandwrittenStatementSection from '@/components/home/HandwrittenStatementSection'
import ImageTextCollapseSection from '@/components/home/ImageTextCollapseSection'
import CampaignsSection from '@/components/home/CampaignsSection'
import WhatWeDoSection from '@/components/home/WhatWeDoSection'
import FooterSection from '@/components/shared/FooterSection'
import { COLORS } from '@/lib/theme'

export default function Home() {
  return (
    <main className="overflow-x-hidden" style={{ backgroundColor: COLORS.bg }}>
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
