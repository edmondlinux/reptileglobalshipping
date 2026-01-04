import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

enum ProService {
  YES = 1,
  NO = 0,
}

import { useTranslations } from "next-intl";

export const ServicesSection = () => {
  const t = useTranslations("Services");
  
  const serviceList = [
    {
      title: t("tracking.title"),
      description: t("tracking.description"),
      pro: false,
    },
    {
      title: t("fleet.title"),
      description: t("fleet.description"),
      pro: false,
    },
    {
      title: t("route.title"),
      description: t("route.description"),
      pro: false,
    },
    {
      title: t("analytics.title"),
      description: t("analytics.description"),
      pro: true,
    },
    {
      title: t("warehouse.title"),
      description: t("warehouse.description"),
      pro: true,
    },
    {
      title: t("billing.title"),
      description: t("billing.description"),
      pro: true,
    },
  ];

  return (
    <section id="services" className="container py-24 sm:py-32">
      <div className="text-center mb-12">
        <h2 className="text-lg text-primary mb-2 tracking-wider uppercase">
          {t("badge")}
        </h2>

        <h3 className="text-3xl md:text-4xl font-bold mb-4">
          {t("title")}
        </h3>

        <p className="md:w-2/3 mx-auto text-lg text-muted-foreground">
          {t("description")}
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {serviceList.map(({ title, description, pro }) => (
          <Card
            key={title}
            className="bg-muted/50 dark:bg-card h-full relative border-none shadow-sm hover:shadow-md transition"
          >
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                {title}
              </CardTitle>
              <CardDescription className="text-sm mt-2 leading-relaxed">
                {description}
              </CardDescription>
            </CardHeader>

            <Badge
              data-pro={pro}
              variant="secondary"
              className="absolute -top-2 -right-3 data-[pro=false]:hidden"
            >
              PRO
            </Badge>
          </Card>
        ))}
      </div>
    </section>
  );
};