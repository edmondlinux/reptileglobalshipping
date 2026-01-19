
import { ContactSection } from "@/components/layout/sections/contact";
import { FooterSection } from "@/components/layout/sections/footer";

import { getMessages } from "next-intl/server";
import { Metadata } from "next";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const messages: any = await getMessages();
  const t = messages.Metadata.contact;
  return {
    title: t.title,
    description: t.description,
    keywords: t.keywords,
  };
}

export default function ContactPage() {
  return (
    <>
      <section className="container py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Contact Us for International Reptile Shipping
          </h1>
          <p className="text-xl text-muted-foreground">
            Email us today for a free quote on international reptile courier and transport services.
          </p>

        </div>
      </section>
      <ContactSection />
      <FooterSection />
    </>
  );
}
