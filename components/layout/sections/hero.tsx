"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, Package, Globe, Zap } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";

import { useTranslations } from "next-intl";

export const HeroSection = () => {
  const t = useTranslations("Hero");
  const { theme } = useTheme();
  const [trackingNumber, setTrackingNumber] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = ["/hero.png", "/hero1.png"];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingNumber.trim()) {
      window.location.href = `/track?tn=${encodeURIComponent(trackingNumber.trim())}`;
    }
  };

  return (
    <section className="relative w-full overflow-hidden min-h-[700px] md:min-h-[900px]">
      {/* Background Image Carousel with Sliding Snap Switch */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div 
          className="relative w-full h-full flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
        >
          {images.map((src, index) => (
            <div
              key={src}
              className="relative min-w-full h-full"
            >
              <Image
                src={src}
                alt={`Hero Background ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
              />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/70 to-background/80"></div>
      </div>

      {/* Content */}
      <div className="relative z-20 container w-full h-full flex items-center">
        <div className="w-full max-w-5xl mx-auto py-24 md:py-32 space-y-12">
          {/* Main Heading */}
          <div className="text-center space-y-6 animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              {t("welcome")}{" "}
              <span className="text-transparent bg-gradient-to-r from-[#1E3A5F] via-primary to-[#0D9488] bg-clip-text">
                Reptile Global
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white font-light max-w-2xl mx-auto leading-relaxed">
              {t("partner")}
            </p>
          </div>

          {/* Tracking Form */}
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3 p-2 bg-background/80 backdrop-blur-md rounded-2xl shadow-2xl border border-border/50">
              <Input
                type="text"
                placeholder={t("trackPlaceholder")}
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="flex-1 h-14 text-lg border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-6"
              />
              <Button 
                size="lg"
                className="h-14 px-8 font-semibold group/arrow rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                {t("trackButton")}
                <ArrowRight className="w-5 h-5 ml-2 group-hover/arrow:translate-x-1 transition-transform" />
              </Button>
            </form>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 pt-8">
            <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-background/60 backdrop-blur-sm border border-border/50 shadow-lg hover:shadow-xl transition-shadow">
              <Globe className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">{t("globalCoverage")}</span>
            </div>
            <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-background/60 backdrop-blur-sm border border-border/50 shadow-lg hover:shadow-xl transition-shadow">
              <Package className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">{t("secureHandling")}</span>
            </div>
            <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-background/60 backdrop-blur-sm border border-border/50 shadow-lg hover:shadow-xl transition-shadow">
              <Zap className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">{t("fastDelivery")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Gradient at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10"></div>
    </section>
  );
};