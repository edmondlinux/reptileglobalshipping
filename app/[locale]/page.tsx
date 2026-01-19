
"use client";

import { HeroSection } from "@/components/layout/sections/hero";
import { SponsorsSection } from "@/components/layout/sections/sponsors";
import { BenefitsSection } from "@/components/layout/sections/benefits";
import { FeaturesSection } from "@/components/layout/sections/features";
import { ServicesSection } from "@/components/layout/sections/services";
import { HowItWorks } from "@/components/layout/sections/how-it-works";
import { ShippingKits } from "@/components/layout/sections/shipping-kits";
import { GallerySection } from "@/components/layout/sections/gallery";
import { FAQSection } from "@/components/layout/sections/faq";
import { FooterSection } from "@/components/layout/sections/footer";

export default function Home() {
  return (
    <>
      <HeroSection />
      <SponsorsSection />
      <BenefitsSection />
      <FeaturesSection />
      <HowItWorks />
      <ServicesSection />
      <ShippingKits />
      <GallerySection />
      <FAQSection />
      <FooterSection />
    </>
  );
}
