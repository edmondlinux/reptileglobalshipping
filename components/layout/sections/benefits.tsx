import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { icons } from "lucide-react";

interface BenefitsProps {
  icon: string;
  title: string;
  description: string;
}

const benefitList: BenefitsProps[] = [
  {
    icon: "Shield",
    title: "Secure Transportation",
    description:
      "Your cargo is protected with comprehensive insurance coverage and real-time security monitoring throughout the entire journey.",
  },
  {
    icon: "Clock",
    title: "On-Time Delivery",
    description:
      "We guarantee 98% on-time delivery rate with precise scheduling and efficient route optimization for your shipments.",
  },
  {
    icon: "DollarSign",
    title: "Cost-Effective Solutions",
    description:
      "Competitive pricing without compromising quality. Get transparent quotes with no hidden fees for all your shipping needs.",
  },
  {
    icon: "Headphones",
    title: "24/7 Customer Support",
    description:
      "Our dedicated support team is available around the clock to assist with tracking, updates, and any shipping inquiries.",
  },
];

export const BenefitsSection = () => {
  return (
    <section id="benefits" className="container py-24 sm:py-32">
      <div className="grid lg:grid-cols-2 place-items-center lg:gap-24">
        <div>
          <h2 className="text-lg text-primary mb-2 tracking-wider">Benefits</h2>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose Reptile Global
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Experience reliable, efficient, and secure logistics solutions designed to meet your business needs with excellence in every delivery.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 w-full">
          {benefitList.map(({ icon, title, description }, index) => (
            <Card
              key={title}
              className="bg-muted/50 dark:bg-card hover:bg-background transition-all delay-75 group/number"
            >
              <CardHeader>
                <div className="flex justify-between">
                  <Icon
                    name={icon as keyof typeof icons}
                    size={32}
                    color="hsl(var(--primary))"
                    className="mb-6 text-primary"
                  />
                  <span className="text-5xl text-muted-foreground/15 font-medium transition-all delay-75 group-hover/number:text-muted-foreground/30">
                    0{index + 1}
                  </span>
                </div>

                <CardTitle>{title}</CardTitle>
              </CardHeader>

              <CardContent className="text-muted-foreground">
                {description}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
