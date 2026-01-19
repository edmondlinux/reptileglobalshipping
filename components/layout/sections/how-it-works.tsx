import { useTranslations } from "next-intl";
import { Package, Truck, CheckCircle, ShieldCheck } from "lucide-react";

export const HowItWorks = () => {
  const t = useTranslations("HowItWorks");
  
  const steps = [
    {
      icon: <Package className="w-12 h-12 text-primary" />,
      title: t("step1.title"),
      description: t("step1.description"),
    },
    {
      icon: <Truck className="w-12 h-12 text-primary" />,
      title: t("step2.title"),
      description: t("step2.description"),
    },
    {
      icon: <ShieldCheck className="w-12 h-12 text-primary" />,
      title: t("step3.title"),
      description: t("step3.description"),
    },
    {
      icon: <CheckCircle className="w-12 h-12 text-primary" />,
      title: t("step4.title"),
      description: t("step4.description"),
    },
  ];

  return (
    <section className="container py-24 sm:py-32">
      <div className="text-center mb-12">
        <h2 className="text-lg text-primary tracking-wider mb-2">{t("badge")}</h2>
        <h2 className="text-3xl md:text-4xl font-bold">{t("title")}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center text-center p-6 bg-muted/50 rounded-lg">
            <div className="mb-4">{step.icon}</div>
            <h3 className="text-xl font-bold mb-2">{step.title}</h3>
            <p className="text-muted-foreground">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
