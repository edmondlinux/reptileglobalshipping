
"use client";

import { ContactSection } from "@/components/layout/sections/contact";
import { FooterSection } from "@/components/layout/sections/footer";

export default function ContactPage() {
  return (
    <>
      <section className="container py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Get in Touch
          </h1>
          <p className="text-xl text-muted-foreground">
            We're here to help with your shipping needs
          </p>
        </div>
      </section>
      <ContactSection />
      <FooterSection />
    </>
  );
}
