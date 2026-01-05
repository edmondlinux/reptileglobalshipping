"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, LogOut, Package } from "lucide-react";
import { ModeToggle } from "./toogle-theme";
import { useAuth } from "@/contexts/AuthContext";
import { AuthDialog } from "@/components/auth/AuthDialog";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "./language-switcher";

interface RouteProps {
  href: string;
  labelKey: string;
}

const routeList: RouteProps[] = [
  { href: "/", labelKey: "home" },
  { href: "/about", labelKey: "about" },
  { href: "/team", labelKey: "team" },
  { href: "/track", labelKey: "track" },
  { href: "/testimonials", labelKey: "testimonials" },
  { href: "/contact", labelKey: "contact" },
];

export const Navbar = () => {
  const t = useTranslations("Navbar");
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showAuthDialog, setShowAuthDialog] = useState<boolean>(false);
  const { user, signout, isLoading } = useAuth();

  useEffect(() => {
    const authParam = searchParams.get("auth");
    if (authParam === "signin" || authParam === "signup") {
      setShowAuthDialog(true);
    }
  }, [searchParams]);

  return (
    <>
      <header className="sticky top-4 z-50 w-full px-4">
        <div className="mx-auto max-w-7xl">
          <NavigationMenu className="mx-auto">
            <NavigationMenuList className="h-16 px-6 w-full flex justify-between bg-white/80 dark:bg-background/80 backdrop-blur-lg border border-border/50 rounded-2xl shadow-lg">
              <NavigationMenuItem className="font-bold flex">
                <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  <Image
                    src="/logo.png"
                    alt="Reptile Global"
                    width={40}
                    height={40}
                    className="rounded-lg"
                  />
                  <span className="hidden sm:inline-block font-black text-xl tracking-tighter text-primary uppercase">REPTILE GLOBAL</span>
                </Link>
              </NavigationMenuItem>

              {/* desktop nav */}
              <div className="hidden md:flex items-center gap-1">
                {routeList.map((route: RouteProps, i) => (
                  <NavigationMenuItem key={i} className="list-none">
                    <Link
                      href={route.href}
                      className={buttonVariants({
                        variant: "ghost",
                        className: "text-[15px] font-medium rounded-xl"
                      })}
                    >
                      {t(route.labelKey)}
                    </Link>
                  </NavigationMenuItem>
                ))}
                {user?.role === "admin" && (
                  <NavigationMenuItem className="list-none">
                    <Link
                      href="/admin-dashboard"
                      className={buttonVariants({
                        variant: "ghost",
                        className: "text-[15px] font-medium rounded-xl"
                      })}
                    >
                      {t("dashboard")}
                    </Link>
                  </NavigationMenuItem>
                )}
              </div>

              <div className="flex items-center gap-2">
                <div className="hidden md:flex items-center gap-2">
                  <LanguageSwitcher />
                  {!isLoading && (
                    <>
                      {user ? (
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-muted-foreground mr-2">
                            {user.name}
                          </span>
                          <Button onClick={signout} variant="secondary" size="sm" className="rounded-xl">
                            <LogOut className="mr-2 h-4 w-4" />
                            {t("signOut")}
                          </Button>
                        </div>
                      ) : (
                        <Button onClick={() => {
                          window.history.pushState({}, '', '/?auth=signin');
                          setShowAuthDialog(true);
                        }} variant="default" size="sm" className="rounded-xl px-6 font-bold shadow-md hover:shadow-primary/20 transition-all">
                          {t("signIn")}
                        </Button>
                      )}
                    </>
                  )}
                  <ModeToggle />
                </div>

                {/* mobile toggle */}
                <div className="flex md:hidden items-center gap-2">
                  <LanguageSwitcher />
                  <ModeToggle />
                  <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-xl">
                        <Menu className="h-6 w-6" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[300px] sm:w-[400px] rounded-l-3xl">
                      <SheetHeader>
                        <SheetTitle className="font-bold text-xl flex items-center gap-2">
                          <Image
                            src="/logo.png"
                            alt="Reptile Global"
                            width={36}
                            height={36}
                            className="rounded-lg"
                          />
                          <span className="font-black tracking-tighter text-primary">REPTILE GLOBAL</span>
                        </SheetTitle>
                      </SheetHeader>
                      <nav className="flex flex-col gap-4 mt-8">
                        {routeList.map(({ href, labelKey }: RouteProps) => (
                          <Link
                            key={labelKey}
                            href={href}
                            onClick={() => setIsOpen(false)}
                            className="text-lg font-medium px-4 py-3 hover:bg-accent rounded-2xl transition-all flex items-center justify-between group"
                          >
                            {t(labelKey)}
                            <Package className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                          </Link>
                        ))}
                        {user?.role === "admin" && (
                          <Link
                            href="/admin-dashboard"
                            onClick={() => setIsOpen(false)}
                            className="text-lg font-medium px-4 py-3 hover:bg-accent rounded-2xl transition-all flex items-center justify-between group"
                          >
                            {t("dashboard")}
                            <Package className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                          </Link>
                        )}
                        <hr className="my-4 opacity-50" />
                        {!isLoading && (
                          user ? (
                            <Button onClick={signout} variant="destructive" className="w-full rounded-2xl h-12 text-lg font-bold">
                              <LogOut className="mr-2 h-5 w-5" />
                              {t("signOut")}
                            </Button>
                          ) : (
                            <Button onClick={() => {
                              window.history.pushState({}, '', '/?auth=signin');
                              setShowAuthDialog(true);
                              setIsOpen(false);
                            }} className="w-full rounded-2xl h-12 text-lg font-bold shadow-lg shadow-primary/20">
                              {t("signIn")}
                            </Button>
                          )
                        )}
                      </nav>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </header>

      <AuthDialog isOpen={showAuthDialog} onClose={() => setShowAuthDialog(false)} />
    </>
  );
};