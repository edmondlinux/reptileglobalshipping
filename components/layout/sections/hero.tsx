
"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";

export const HeroSection = () => {
  const { theme } = useTheme();
  const [trackingNumber, setTrackingNumber] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Tracking functionality coming soon");
  };

  const carouselImages = [
    theme === "light" ? "/hero-image-light.jpeg" : "/hero-image-dark.jpeg",
    theme === "light" ? "/hero-image-light.jpeg" : "/hero-image-dark.jpeg",
    theme === "light" ? "/hero-image-light.jpeg" : "/hero-image-dark.jpeg",
  ];

  return (
    <section className="relative w-full overflow-hidden min-h-[600px] md:min-h-[800px]">
      {/* Background Carousel */}
      <div className="absolute inset-0 z-0">
        <div className="flex animate-carousel h-full">
          {/* First set of images */}
          {carouselImages.map((src, idx) => (
            <div key={`first-${idx}`} className="flex-shrink-0 w-screen min-h-[600px] md:min-h-[800px] relative">
              <Image
                src={src}
                alt={`Background ${idx + 1}`}
                fill
                className="object-cover opacity-20"
                priority={idx === 0}
              />
            </div>
          ))}
          {/* Duplicate set for seamless loop */}
          {carouselImages.map((src, idx) => (
            <div key={`second-${idx}`} className="flex-shrink-0 w-screen min-h-[600px] md:min-h-[800px] relative">
              <Image
                src={src}
                alt={`Background ${idx + 1}`}
                fill
                className="object-cover opacity-20"
                priority={false}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-background/80 via-background/60 to-background"></div>

      {/* Content */}
      <div className="relative z-20 container w-full">
        <div className="grid place-items-center lg:max-w-screen-xl gap-8 mx-auto py-20 md:py-32">
          <div className="text-center space-y-8">
            <div className="max-w-screen-md mx-auto text-center text-4xl md:text-6xl font-bold">
              <h1>
                Welcome to RapidWave Logistics
              </h1>
            </div>

            <h2 className="text-2xl md:text-3xl text-transparent bg-gradient-to-r from-[#D247BF] to-primary bg-clip-text font-bold">
              Your Trusted Partner in Global Shipping
            </h2>

            <p className="max-w-screen-sm mx-auto text-xl text-muted-foreground">
              We've been transporting goods for 5 years with reliability and excellence. Experience seamless logistics solutions tailored to your needs.
            </p>

            <div className="space-y-4 md:space-y-0 md:space-x-4">
              <form onSubmit={handleSubmit} className="space-y-4 md:w-1/2 mx-auto mt-8">
                <Input
                  type="text"
                  placeholder="Enter tracking number"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="text-lg h-14"
                />
                <Button 
                  type="submit"
                  className="w-5/6 md:w-1/4 font-bold group/arrow"
                >
                  Track Shipment
                  <ArrowRight className="size-5 ml-2 group-hover/arrow:translate-x-1 transition-transform" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
