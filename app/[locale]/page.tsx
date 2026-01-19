
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

import { getMessages } from "next-intl/server";
import { Metadata } from "next";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const messages: any = await getMessages();
  const t = messages.Metadata.home;
  return {
    title: t.title,
    description: t.description,
    keywords: t.keywords,
  };
}

export default function Home() {
  return (
    <>
      <HeroSection />
      <SponsorsSection />
      <GallerySection />
      <BenefitsSection />
      <FeaturesSection />
      <HowItWorks />
      <ServicesSection />
      <ShippingKits />
      <FAQSection />
      <FooterSection />
    </>
  );
}
