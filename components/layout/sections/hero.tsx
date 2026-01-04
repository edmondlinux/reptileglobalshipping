"use client";
import { useState } from "react";
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingNumber.trim()) {
      window.location.href = `/track?tn=${encodeURIComponent(trackingNumber.trim())}`;
    }
  };

  // Single image (change path if needed)
  const heroImage = theme === "light" ? "/hero.png" : "/hero.png";

  return (
    <section className="relative w-full overflow-hidden min-h-[700px] md:min-h-[900px]">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="relative w-full h-full">
          <Image
            src={heroImage}
            alt="Hero Background"
            fill
            className="object-cover"
            priority
          />
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