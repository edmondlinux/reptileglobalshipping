
"use client";

import { FooterSection } from "@/components/layout/sections/footer";

export default function TeamPage() {
  return (
    <>
      <section className="container py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Meet Our Team
          </h1>
          <p className="text-xl text-muted-foreground">
            The People Behind Your Shipments
          </p>
          <p className="text-lg text-muted-foreground mt-4">
            Our dedicated team of logistics professionals has been working together for 5 years to deliver exceptional service.
          </p>
        </div>
      </section>
      <FooterSection />
    </>
  );
}
