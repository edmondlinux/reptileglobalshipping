
"use client";

import { TestimonialSection } from "@/components/layout/sections/testimonial";
import { FooterSection } from "@/components/layout/sections/footer";

export default function TestimonialsPage() {
  return (
    <>
      <section className="container py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            What Our Customers Say
          </h1>
          <p className="text-xl text-muted-foreground">
            Real experiences from real customers
          </p>
        </div>
      </section>
      <TestimonialSection />
      <FooterSection />
    </>
  );
}
