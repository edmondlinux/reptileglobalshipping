"use client";

import { FooterSection } from "@/components/layout/sections/footer";
import { TeamSection } from "@/components/layout/sections/team";
import { useTranslations } from "next-intl";

export default function TeamPage() {
  const t = useTranslations("Team");
  return (
    <>
      <section className="container py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t("pageTitle")}
          </h1>
          <p className="text-xl text-muted-foreground">
            {t("pageSubtitle")}
          </p>
          <p className="text-lg text-muted-foreground mt-4">
            {t("pageDescription")}
          </p>
        </div>
        <TeamSection />
      </section>
      <FooterSection />
    </>
  );
}
