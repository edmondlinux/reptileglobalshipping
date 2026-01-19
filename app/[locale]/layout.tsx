import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/navbar";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/contexts/AuthContext";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import SmartsuppScript from '@/components/SmartsuppScript';

const inter = Inter({ subsets: ["latin"] });

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const messages: any = await getMessages();
  const t = messages.Metadata.home;

  const ogUrl = "https://ik.imagekit.io/14iir4o77/IMG_0678.jpeg";

  return {
    title: t.title,
    description: t.description,
    icons: {
      icon: [
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/logo.png" },
      ],
      apple: [
        { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      ],
      other: [
        {
          rel: "manifest",
          url: "/site.webmanifest",
        },
      ],
    },
    openGraph: {
      title: t.title,
      description: t.description,
      images: [
        {
          url: ogUrl,
          width: 1200,
          height: 630,
          alt: t.title,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t.title,
      description: t.description,
      images: [ogUrl],
    },
  };
}

export default async function RootLayout({
  children,
  params: { locale }
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background", inter.className)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={messages} locale={locale}>
            <AuthProvider>
              <Navbar />
              {children}
              <Toaster
                position="top-center"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: 'hsl(var(--background))',
                    color: 'hsl(var(--foreground))',
                    border: '1px solid hsl(var(--border))',
                  },
                  success: {
                    iconTheme: {
                      primary: 'hsl(var(--primary))',
                      secondary: 'hsl(var(--primary-foreground))',
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: 'hsl(var(--destructive))',
                      secondary: 'hsl(var(--destructive-foreground))',
                    },
                  },
                }}
              />
              <SmartsuppScript />
            </AuthProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}