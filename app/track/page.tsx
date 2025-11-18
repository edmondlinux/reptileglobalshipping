
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FooterSection } from "@/components/layout/sections/footer";
import { Package } from "lucide-react";

export default function TrackPage() {
  const [trackingNumber, setTrackingNumber] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Tracking functionality coming soon");
  };

  return (
    <>
      <section className="container py-24 sm:py-32">
        <div className="mx-auto max-w-2xl">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <Package className="h-16 w-16 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Track Your Shipment
            </h1>
            <p className="text-xl text-muted-foreground">
              Enter your tracking number to see real-time updates
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Enter tracking number"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="text-lg h-14"
            />
            <Button type="submit" size="lg" className="w-full">
              Track Shipment
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Tracking functionality coming soon
          </p>
        </div>
      </section>
      <FooterSection />
    </>
  );
}
