"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, Package, Globe, Zap } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";

export const HeroSection = () => {
  const { theme } = useTheme();
  const [trackingNumber, setTrackingNumber] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingNumber.trim()) {
      window.location.href = `/track?tn=${encodeURIComponent(trackingNumber.trim())}`;
    }
  };

  const carouselImages = [
    theme === "light" ? "/hero.png" : "/hero.png",
    theme === "light" ? "/hero1.png" : "/hero1.png",
    theme === "light" ? "/hero.png" : "/hero.png",
  ];

  return (
    <section className="relative w-full overflow-hidden min-h-[700px] md:min-h-[900px]">
      {/* Background Carousel with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="flex animate-carousel h-full">
          {/* First set of images */}
          {carouselImages.map((src, idx) => (
            <div key={`first-${idx}`} className="flex-shrink-0 w-screen min-h-[700px] md:min-h-[900px] relative">
              <Image
                src={src}
                alt={`Background ${idx + 1}`}
                fill
                className="object-cover"
                priority={idx === 0}
              />
            </div>
          ))}
          {/* Duplicate set for seamless loop */}
          {carouselImages.map((src, idx) => (
            <div key={`second-${idx}`} className="flex-shrink-0 w-screen min-h-[700px] md:min-h-[900px] relative">
              <Image
                src={src}
                alt={`Background ${idx + 1}`}
                fill
                className="object-cover"
                priority={false}
              />
            </div>
          ))}
        </div>
        {/* Enhanced gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/70 to-background/80"></div>
      </div>

      {/* Content */}
      <div className="relative z-20 container w-full h-full flex items-center">
        <div className="w-full max-w-5xl mx-auto py-24 md:py-32 space-y-12">

          {/* Main Heading with Animation */}
          <div className="text-center space-y-6 animate-fade-in">
            <div className="inline-block">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-6">
                <Zap className="w-4 h-4" />
                5 Years of Excellence
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              Welcome to{" "}
              <span className="text-transparent bg-gradient-to-r from-[#1E3A5F] via-primary to-[#0D9488] bg-clip-text">
                Reptile Global
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground font-light max-w-2xl mx-auto leading-relaxed">
              Your trusted partner in global shipping solutions
            </p>
          </div>

          {/* Tracking Form */}
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3 p-2 bg-background/80 backdrop-blur-md rounded-2xl shadow-2xl border border-border/50">
              <Input
                type="text"
                placeholder="Enter your tracking number..."
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="flex-1 h-14 text-lg border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-6"
              />
              <Button 
                
                size="lg"
                className="h-14 px-8 font-semibold group/arrow rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Track Shipment
                <ArrowRight className="w-5 h-5 ml-2 group-hover/arrow:translate-x-1 transition-transform" />
              </Button>
            </form>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 pt-8">
            <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-background/60 backdrop-blur-sm border border-border/50 shadow-lg hover:shadow-xl transition-shadow">
              <Globe className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Global Coverage</span>
            </div>
            <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-background/60 backdrop-blur-sm border border-border/50 shadow-lg hover:shadow-xl transition-shadow">
              <Package className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Secure Handling</span>
            </div>
            <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-background/60 backdrop-blur-sm border border-border/50 shadow-lg hover:shadow-xl transition-shadow">
              <Zap className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Fast Delivery</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10"></div>
    </section>
  );
};