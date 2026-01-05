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
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter">
              {t("welcome")}{" "}
              <span className="text-transparent bg-gradient-to-br from-primary via-blue-600 to-cyan-500 bg-clip-text">
                Reptile Global
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-foreground/80 font-medium max-w-3xl mx-auto leading-relaxed">
              {t("partner")}
            </p>
          </div>

          {/* Tracking Form */}
          <div className="max-w-3xl mx-auto px-4">
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-0 p-1 bg-background/95 backdrop-blur-xl rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] border border-primary/20 overflow-hidden">
              <div className="flex-1 flex items-center px-6">
                <Package className="w-5 h-5 text-muted-foreground mr-3" />
                <Input
                  type="text"
                  placeholder={t("trackPlaceholder")}
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="flex-1 h-14 text-lg border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/50"
                />
              </div>
              <Button 
                size="lg"
                className="h-14 px-10 font-bold text-lg group/arrow rounded-xl shadow-lg hover:shadow-primary/25 transition-all bg-primary hover:bg-primary/90"
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