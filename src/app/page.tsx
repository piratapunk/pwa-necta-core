import { AbiSection } from '@/components/sections/AbiSection'
import { CapabilitiesSection } from '@/components/sections/CapabilitiesSection'
import { CrmSection } from '@/components/sections/CrmSection'
import { CtaSection } from '@/components/sections/CtaSection'
import { FaqSection } from '@/components/sections/FaqSection'
import { HeroSection } from '@/components/sections/HeroSection'
import { HowItWorksSection } from '@/components/sections/HowItWorksSection'
import { IntegrationsSection } from '@/components/sections/IntegrationsSection'
import { PainSection } from '@/components/sections/PainSection'
import { PricingSection } from '@/components/sections/PricingSection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <PainSection />
      <HowItWorksSection />
      <AbiSection />
      <CapabilitiesSection />
      <CrmSection />
      <IntegrationsSection />
      <PricingSection />
      <FaqSection />
      <CtaSection />
    </>
  )
}
