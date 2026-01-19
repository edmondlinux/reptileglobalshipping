import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface GalleryItem {
  title: string;
  description: string;
  category: string;
  image: string;
}

const galleryItems: GalleryItem[] = [
  {
    title: "CITES Documentation",
    description: "Expert handling of CITES documentation for shipping protected species worldwide.",
    category: "Documentation",
    image: "/gallery/cites.jpg",
  },
  {
    title: "Controlled Environments",
    description: "Specialized shipping containers for temperature-sensitive and controlled cargo.",
    category: "Shipping",
    image: "/gallery/controlled.png",
  },
  {
    title: "Transportation Delivery",
    description: "Seamless door-to-door transportation and delivery services for all cargo types.",
    category: "Transportation",
    image: "/gallery/delivery.jpg",
  },
  {
    title: "Protected Species",
    description: "Specialized logistics for the safe and legal transport of protected flora and fauna.",
    category: "Specialized",
    image: "/gallery/species.jpg",
  },
];

export const GallerySection = () => {
  return (
    <section id="gallery" className="container py-24 sm:py-32">
      <div className="text-center mb-12">
        <h2 className="text-lg text-primary text-center mb-2 tracking-wider uppercase">
          Portfolio
        </h2>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Our Shipping & Logistics Gallery
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Explore our expertise in specialized shipping, documentation, and global logistics.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {galleryItems.map(({ title, description, category, image }) => (
          <Card key={title} className="overflow-hidden group">
            <div className="relative h-48 w-full overflow-hidden">
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
            </div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <Badge variant="secondary" className="mb-2">
                  {category}
                </Badge>
              </div>
              <CardTitle className="text-xl">{title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
