
"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Star } from "lucide-react";

interface ReviewProps {
  image: string;
  name: string;
  userName: string;
  comment: string;
  rating: number;
}

const testimonialList: ReviewProps[] = [
  {
    image: "https://i.pravatar.cc/150?img=12",
    name: "Sarah Mitchell",
    userName: "@sarahmitchell",
    comment: "We've been using Reptile Global for our monthly shipments to Europe for the past year. The tracking is always accurate, and our packages arrive on time. Their customer service team actually responds quickly when we have questions!",
    rating: 5.0
  },
  {
    image: "https://i.pravatar.cc/150?img=33",
    name: "Marcus Chen",
    userName: "@marcusc_logistics",
    comment: "Switched from our previous carrier after a friend recommended Reptile Global. Best decision we made for our e-commerce business. They handle our international shipments with care, and we've had zero lost packages in 8 months.",
    rating: 4.8
  },
  {
    image: "https://i.pravatar.cc/150?img=47",
    name: "Elena Rodriguez",
    userName: "@elena_r",
    comment: "As a small business owner, I need reliable shipping that won't break the bank. Reptile Global delivers on both fronts. Their rates are competitive and my customers always receive their orders in perfect condition.",
    rating: 4.9
  },
  {
    image: "https://i.pravatar.cc/150?img=68",
    name: "David Thompson",
    userName: "@d_thompson_tech",
    comment: "Been working with Reptile Global since they started. Watched them grow and improve their service year after year. The personal touch they bring to logistics is rare these days. Highly recommend for anyone shipping overseas.",
    rating: 5.0
  },
  {
    image: "https://i.pravatar.cc/150?img=25",
    name: "Amara Okafor",
    userName: "@amara_ok",
    comment: "What impressed me most was how they handled a delay caused by customs. They kept me updated every step of the way and worked to resolve it quickly. That's the kind of service that keeps customers coming back.",
    rating: 4.9
  },
  {
    image: "https://i.pravatar.cc/150?img=52",
    name: "James Wilson",
    userName: "@jwilson_imports",
    comment: "Our company ships fragile electronics internationally. Reptile Global's packaging recommendations and careful handling have resulted in a 99% safe delivery rate. They understand what businesses need from a shipping partner.",
    rating: 5.0
  }
];

export const TestimonialSection = () => {
  return (
    <section id="testimonials" className="container py-24 sm:py-32">
      <div className="text-center mb-8">
        <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
          What Our Customers Say
        </h2>

        <h2 className="text-3xl md:text-4xl text-center font-bold mb-4">
          Hear What Our 1000+ Clients Say
        </h2>
      </div>

      <Carousel
        opts={{
          align: "start",
        }}
        className="relative w-[80%] sm:w-[90%] lg:max-w-screen-xl mx-auto"
      >
        <CarouselContent>
          {testimonialList.map((review, index) => (
            <CarouselItem
              key={review.name}
              className="md:basis-1/2 lg:basis-1/3"
            >
              <Card className="bg-muted/50 dark:bg-card">
                <CardContent className="pt-6 pb-0">
                  <div className="flex gap-1 pb-6">
                    <Star className="size-4 fill-primary text-primary" />
                    <Star className="size-4 fill-primary text-primary" />
                    <Star className="size-4 fill-primary text-primary" />
                    <Star className="size-4 fill-primary text-primary" />
                    <Star className="size-4 fill-primary text-primary" />
                  </div>
                  {`"${review.comment}"`}
                </CardContent>

                <CardHeader>
                  <div className="flex flex-row items-center gap-4">
                    <Avatar>
                      <AvatarImage
                        src={review.image}
                        alt="User Avatar"
                      />
                      <AvatarFallback>
                        {review.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col">
                      <CardTitle className="text-lg">{review.name}</CardTitle>
                      <CardDescription>{review.userName}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
};
