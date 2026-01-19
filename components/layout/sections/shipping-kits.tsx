import { useTranslations } from "next-intl";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export const ShippingKits = () => {
  const t = useTranslations("ShippingKits");

  const kits = [
    {
      title: t("kit1.title"),
      description: t("kit1.description"),
      price: "$24.99",
      image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=300&h=200&auto=format&fit=crop",
    },
    {
      title: t("kit2.title"),
      description: t("kit2.description"),
      price: "$34.99",
      image: "https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?q=80&w=300&h=200&auto=format&fit=crop",
    },
    {
      title: t("kit3.title"),
      description: t("kit3.description"),
      price: "$14.99",
      image: "https://images.unsplash.com/photo-1620912189865-1e8a33da4c5e?q=80&w=300&h=200&auto=format&fit=crop",
    },
  ];

  return (
    <section className="container py-24 sm:py-32 bg-muted/30">
      <div className="text-center mb-12">
        <h2 className="text-lg text-primary tracking-wider mb-2">{t("badge")}</h2>
        <h2 className="text-3xl md:text-4xl font-bold">{t("title")}</h2>
        <p className="text-xl text-muted-foreground mt-4">{t("subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {kits.map((kit, index) => (
          <Card key={index} className="overflow-hidden">
            <Image 
              src={kit.image} 
              alt={kit.title} 
              width={300} 
              height={200} 
              className="w-full h-48 object-cover"
            />
            <CardHeader>
              <CardTitle>{kit.title}</CardTitle>
              <CardDescription>{kit.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-between items-center">
              <span className="text-2xl font-bold text-primary">{kit.price}</span>
              <Button variant="outline">{t("buyNow")}</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
