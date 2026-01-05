"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button, buttonVariants } from "@/components/ui/button";
import { Menu, LogOut } from "lucide-react";
import { ModeToggle } from "./toogle-theme";
import { useAuth } from "@/contexts/AuthContext";
import { AuthDialog } from "@/components/auth/AuthDialog";
import Image from "next/image";

import { useTranslations } from "next-intl";

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

import { LanguageSwitcher } from "./language-switcher";

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
                  <span className="hidden sm:inline-block font-black text-xl tracking-tighter text-primary">REPTILE GLOBAL</span>
                </Link>
              </NavigationMenuItem>

            {/* mobile */}
            <span className="flex md:hidden gap-2">
              <LanguageSwitcher />
              <ModeToggle />

              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger className="px-2">
                  <Menu
                    className="flex md:hidden h-5 w-5"
                    onClick={() => setIsOpen(true)}
                  />
                </SheetTrigger>

                <SheetContent side={"left"}>
                  <SheetHeader>
                    <SheetTitle className="font-bold text-xl flex items-center gap-2">
                      <Image
                        src="/logo.png"
                        alt="Reptile Global"
                        width={36}
                        height={36}
                      />
                    </SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col justify-center items-center gap-2 mt-4">
                    {routeList.map(({ href, labelKey }: RouteProps) => (
                      <Link
                        key={labelKey}
                        href={href}
                        onClick={() => setIsOpen(false)}
                        className={buttonVariants({ variant: "ghost" })}
                      >
                        {t(labelKey)}
                      </Link>
                    ))}
                    {user?.role === "admin" && (
                      <Link
                        href="/admin-dashboard"
                        onClick={() => setIsOpen(false)}
                        className={buttonVariants({ variant: "ghost" })}
                      >
                        {t("dashboard")}
                      </Link>
                    )}
                    {!isLoading && (
                      <>
                        {user ? (
                          <Button onClick={signout} variant="ghost">
                            <LogOut className="mr-2 h-4 w-4" />
                            {t("signOut")}
                          </Button>
                        ) : (
                          <Button onClick={() => {
                            window.history.pushState({}, '', '/?auth=signin');
                            setShowAuthDialog(true);
                            setIsOpen(false);
                          }} variant="default">
                            {t("signIn")}
                          </Button>
                        )}
                      </>
                    )}
                  </nav>
                </SheetContent>
              </Sheet>
            </span>

            {/* desktop */}
            <nav className="hidden md:flex gap-2">
              {routeList.map((route: RouteProps, i) => (
                <Link
                  href={route.href}
                  key={i}
                  className={`text-[17px] ${buttonVariants({
                    variant: "ghost",
                  })}`}
                >
                  {t(route.labelKey)}
                </Link>
              ))}
              {user?.role === "admin" && (
                <NavigationMenuItem>
                  <Link href="/admin-dashboard" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      {t("dashboard")}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              )}
            </nav>

            <div className="hidden md:flex gap-2 items-center">
              <LanguageSwitcher />
              {!isLoading && (
                <>
                  {user ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {user.name}
                      </span>
                      <Button onClick={signout} variant="ghost" size="sm">
                        <LogOut className="mr-2 h-4 w-4" />
                        {t("signOut")}
                      </Button>
                    </div>
                  ) : (
                    <Button onClick={() => {
                      window.history.pushState({}, '', '/?auth=signin');
                      setShowAuthDialog(true);
                    }} variant="default" size="sm">
                      {t("signIn")}
                    </Button>
                  )}
                </>
              )}
              <ModeToggle />
            </div>
          </NavigationMenuList>
        </NavigationMenu>
      </header>

      <AuthDialog isOpen={showAuthDialog} onClose={() => setShowAuthDialog(false)} />
    </>
  );
};