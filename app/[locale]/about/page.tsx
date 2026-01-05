
"use client";

import { FooterSection } from "@/components/layout/sections/footer";
import { useTranslations } from "next-intl";

export default function AboutPage() {
  const t = useTranslations("About");
  return (
    <>
      <section className="container py-24 sm:py-32">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t("title")}
            </h1>
            <p className="text-xl text-muted-foreground">
              {t("subtitle")}
            </p>
          </div>

          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg leading-relaxed mb-8">
              {t("description")}
            </p>

            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <div className="p-6 border rounded-lg">
                <h2 className="text-2xl font-bold mb-4">{t("mission.title")}</h2>
                <p className="text-muted-foreground">
                  {t("mission.description")}
                </p>
              </div>

              <div className="p-6 border rounded-lg">
                <h2 className="text-2xl font-bold mb-4">{t("vision.title")}</h2>
                <p className="text-muted-foreground">
                  {t("vision.description")}
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
