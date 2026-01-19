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
import Script from 'next/script';

const inter = Inter({ subsets: ["latin"] });

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const messages: any = await getMessages();
  const t = messages.Metadata.home;

  return {
    title: t.title,
    description: t.description,
    icons: {
      icon: "/logo.png",
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
              
              <Script
                id="smartsupp-livechat"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                  __html: `
                    var _smartsupp = _smartsupp || {};
                    _smartsupp.key = '638908575fda9112fede8b068509f6e55d4c8507';
                    _smartsupp.language = '${locale}';
                    
                    if (window.smartsupp) {
                      window.smartsupp('set', 'language', '${locale}');
                      window.smartsupp('html:apply');
                    } else {
                      window.smartsupp || (function(d) {
                        var s, c, o = smartsupp = function(){ o._.push(arguments) };
                        o._ = [];
                        s = d.getElementsByTagName('script')[0];
                        c = d.createElement('script');
                        c.type = 'text/javascript';
                        c.charset = 'utf-8';
                        c.async = true;
                        c.src = 'https://www.smartsuppchat.com/loader.js?';
                        s.parentNode.insertBefore(c, s);
                      })(document);
                    }
                  `,
                }}
              />
            </AuthProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}