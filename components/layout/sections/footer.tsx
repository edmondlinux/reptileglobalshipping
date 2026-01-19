"use client";
import { Separator } from "@/components/ui/separator";
import { ChevronsDownIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";

export const FooterSection = () => {
  const t = useTranslations("Footer");
  const currentYear = new Date().getFullYear();

  return (
    <footer id="footer" className="container py-24 sm:py-32">
      <div className="p-10 bg-card border border-secondary rounded-2xl">
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-x-12 gap-y-8">
          <div className="col-span-full xl:col-span-2">
            <Link href="/" className="flex font-bold items-center">
              <Image
                src="/logo.png"
                alt="Reptile Global"
                className="h-12 w-auto"
                width={100} 
                height={50} 
              />
            </Link>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg">{t("services")}</h3>
            <div>
              <Link href="/track" className="opacity-60 hover:opacity-100">
                {t("trackShipment")}
              </Link>
            </div>

            <div>
              <Link href="/#services" className="opacity-60 hover:opacity-100">
                {t("ourServices")}
              </Link>
            </div>

            <div>
              <Link href="/contact" className="opacity-60 hover:opacity-100">
                {t("getQuote")}
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg">{t("company")}</h3>
            <div>
              <Link href="/about" className="opacity-60 hover:opacity-100">
                {t("aboutUs")}
              </Link>
            </div>

            <div>
              <Link href="/team" className="opacity-60 hover:opacity-100">
                {t("ourTeam")}
              </Link>
            </div>

            <div>
              <Link href="/testimonials" className="opacity-60 hover:opacity-100">
                {t("testimonials")}
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg">{t("support")}</h3>
            <div>
              <Link href="/contact" className="opacity-60 hover:opacity-100">
                {t("contactUs")}
              </Link>
            </div>

            <div>
              <Link href="/#faq" className="opacity-60 hover:opacity-100">
                {t("faq")}
              </Link>
            </div>

            <div>
              <Link href="/contact" className="opacity-60 hover:opacity-100">
                {t("customerService")}
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg">{t("connect")}</h3>
            <div>
              <Link href="tel:+18007947878" className="opacity-60 hover:opacity-100">
                {t("call")}
              </Link>
            </div>

            <div>
              <Link href="mailto:support@reptileglobal.site" className="opacity-60 hover:opacity-100">
                {t("emailSupport")}
              </Link>
            </div>

            <div>
              <span className="opacity-60">
                {t("customerService247")}
              </span>
            </div>
          </div>
        </div>

        <Separator className="my-6" />
        <section className="">
          <h3 className="">
            &copy; {currentYear} Reptile Global. {t("rights")} | 
            <Link
              href="/contact"
              className="text-primary transition-all border-primary hover:border-b-2 ml-1"
            >
              {t("privacyPolicy")}
            </Link> | 
            <Link
              href="/contact"
              className="text-primary transition-all border-primary hover:border-b-2 ml-1"
            >
              {t("termsOfService")}
            </Link>
          </h3>
        </section>
      </div>
    </footer>
  );
};
