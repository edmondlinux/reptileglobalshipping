"use client";
import { Separator } from "@/components/ui/separator";
import { ChevronsDownIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const FooterSection = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="footer" className="container py-24 sm:py-32">
      <div className="p-10 bg-card border border-secondary rounded-2xl">
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-x-12 gap-y-8">
          <div className="col-span-full xl:col-span-2">
            <Link href="/" className="flex font-bold items-center">
              <Image
                src="/logo.png"
                alt="SwiftTrust Transport"
                className="h-12 w-auto"
                width={100} 
                height={50} 
              />
            </Link>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg">Services</h3>
            <div>
              <Link href="/track" className="opacity-60 hover:opacity-100">
                Track Shipment
              </Link>
            </div>

            <div>
              <Link href="/#services" className="opacity-60 hover:opacity-100">
                Our Services
              </Link>
            </div>

            <div>
              <Link href="/contact" className="opacity-60 hover:opacity-100">
                Get a Quote
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg">Company</h3>
            <div>
              <Link href="/about" className="opacity-60 hover:opacity-100">
                About Us
              </Link>
            </div>

            <div>
              <Link href="/team" className="opacity-60 hover:opacity-100">
                Our Team
              </Link>
            </div>

            <div>
              <Link href="/testimonials" className="opacity-60 hover:opacity-100">
                Testimonials
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg">Support</h3>
            <div>
              <Link href="/contact" className="opacity-60 hover:opacity-100">
                Contact Us
              </Link>
            </div>

            <div>
              <Link href="/#faq" className="opacity-60 hover:opacity-100">
                FAQ
              </Link>
            </div>

            <div>
              <Link href="/contact" className="opacity-60 hover:opacity-100">
                Customer Service
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg">Connect</h3>
            <div>
              <Link href="tel:+18007947878" className="opacity-60 hover:opacity-100">
                Call: 1-800-SWIFT
              </Link>
            </div>

            <div>
              <Link href="mailto:support@swifttrusttransport.com" className="opacity-60 hover:opacity-100">
                Email Support
              </Link>
            </div>

            <div>
              <span className="opacity-60">
                24/7 Customer Service
              </span>
            </div>
          </div>
        </div>

        <Separator className="my-6" />
        <section className="">
          <h3 className="">
            &copy; {currentYear} SwiftTrust Transport. All rights reserved. | 
            <Link
              href="/contact"
              className="text-primary transition-all border-primary hover:border-b-2 ml-1"
            >
              Privacy Policy
            </Link> | 
            <Link
              href="/contact"
              className="text-primary transition-all border-primary hover:border-b-2 ml-1"
            >
              Terms of Service
            </Link>
          </h3>
        </section>
      </div>
    </footer>
  );
};