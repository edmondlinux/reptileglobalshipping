import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { icons } from "lucide-react";

interface FeaturesProps {
  icon: string;
  title: string;
  description: string;
}

const featureList: FeaturesProps[] = [
  {
    icon: "MapPin",
    title: "Real-Time Tracking",
    description:
      "Track your shipments in real-time with GPS-enabled monitoring and receive instant notifications at every milestone.",
  },
  {
    icon: "Globe",
    title: "Global Network",
    description:
      "Access to worldwide shipping routes with established partnerships across continents for seamless international delivery.",
  },
  {
    icon: "PackageCheck",
    title: "Careful Handling",
    description:
      "Professional packaging services and trained handlers ensure your cargo arrives in perfect condition every time.",
  },
  {
    icon: "Truck",
    title: "Fleet Management",
    description:
      "Modern, well-maintained fleet with specialized vehicles for different cargo types from standard to temperature-controlled.",
  },
  {
    icon: "FileText",
    title: "Easy Documentation",
    description:
      "Streamlined customs clearance and digital documentation for hassle-free international shipping compliance.",
  },
  {
    icon: "TrendingUp",
    title: "Scalable Solutions",
    description:
      "Flexible shipping options that grow with your business, from single packages to full container loads.",
  },
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="container py-24 sm:py-32">
      <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
        Features
      </h2>

      <h2 className="text-3xl md:text-4xl text-center font-bold mb-4">
        What Makes Us Different
      </h2>

      <h3 className="md:w-1/2 mx-auto text-xl text-center text-muted-foreground mb-8">
        Advanced technology meets personalized service. Discover the features that make Reptile Global the preferred choice for businesses worldwide.
      </h3>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {featureList.map(({ icon, title, description }) => (
          <div key={title}>
           
            <Card className="h-full bg-background border-0 shadow-none">
              <CardHeader className="flex justify-center items-center">
                <div className="bg-primary/20 p-2 rounded-full ring-8 ring-primary/10 mb-4">
                  <Icon
                    name={icon as keyof typeof icons}
                    size={24}
                    color="hsl(var(--primary))"
                    className="text-primary"
                  />
                </div>

                <CardTitle>{title}</CardTitle>
              </CardHeader>

              <CardContent className="text-muted-foreground text-center">
                {description}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
};
