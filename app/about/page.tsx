
"use client";

import { FooterSection } from "@/components/layout/sections/footer";

export default function AboutPage() {
  return (
    <>
      <section className="container py-24 sm:py-32">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              About RapidWave Logistics
            </h1>
            <p className="text-xl text-muted-foreground">
              5 Years of Excellence in Transportation
            </p>
          </div>

          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg leading-relaxed mb-8">
              RapidWave Logistics has been transporting goods for 5 years, and we recently launched our website to serve more customers worldwide. Our commitment to reliability, speed, and customer satisfaction has made us a trusted name in the logistics industry.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <div className="p-6 border rounded-lg">
                <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                <p className="text-muted-foreground">
                  To provide world-class shipping solutions that connect businesses and individuals across the globe with efficiency and care.
                </p>
              </div>

              <div className="p-6 border rounded-lg">
                <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
                <p className="text-muted-foreground">
                  To be the leading logistics provider known for innovation, sustainability, and exceptional service quality.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <FooterSection />
    </>
  );
}
