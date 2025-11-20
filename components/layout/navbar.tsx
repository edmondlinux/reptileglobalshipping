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

interface RouteProps {
  href: string;
  label: string;
}

const routeList: RouteProps[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/team", label: "Team" },
  { href: "/track", label: "Track" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/contact", label: "Contact" },
];

export const Navbar = () => {
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
      <header className="sticky border-b-[1px] top-0 z-40 w-full bg-white dark:border-b-slate-700 dark:bg-background">
        <NavigationMenu className="mx-auto">
          <NavigationMenuList className="container h-14 px-4 w-screen flex justify-between ">
            <NavigationMenuItem className="font-bold flex">
              <Link href="/" className="ml-2 font-bold text-xl flex items-center">
                <img src="/logo.png" alt="RapidWave Logistics" className="h-11 w-auto" />
              </Link>
            </NavigationMenuItem>

            {/* mobile */}
            <span className="flex md:hidden">
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
                      <img src="/logo.png" alt="RapidWave Logistics" className="h-8 w-auto" />
                    </SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col justify-center items-center gap-2 mt-4">
                    {routeList.map(({ href, label }: RouteProps) => (
                      <Link
                        key={label}
                        href={href}
                        onClick={() => setIsOpen(false)}
                        className={buttonVariants({ variant: "ghost" })}
                      >
                        {label}
                      </Link>
                    ))}
                    {user?.role === "admin" && (
                      <Link
                        href="/admin-dashboard"
                        onClick={() => setIsOpen(false)}
                        className={buttonVariants({ variant: "ghost" })}
                      >
                        Dashboard
                      </Link>
                    )}
                    {!isLoading && (
                      <>
                        {user ? (
                          <Button onClick={signout} variant="ghost">
                            <LogOut className="mr-2 h-4 w-4" />
                            Sign Out
                          </Button>
                        ) : (
                          <Button onClick={() => {
                            window.history.pushState({}, '', '/?auth=signin');
                            setShowAuthDialog(true);
                            setIsOpen(false);
                          }} variant="default">
                            Sign In
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
                  {route.label}
                </Link>
              ))}
              {user?.role === "admin" && (
                <NavigationMenuItem>
                  <Link href="/admin-dashboard" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Dashboard
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              )}
            </nav>

            <div className="hidden md:flex gap-2 items-center">
              {!isLoading && (
                <>
                  {user ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {user.name}
                      </span>
                      <Button onClick={signout} variant="ghost" size="sm">
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <Button onClick={() => {
                      window.history.pushState({}, '', '/?auth=signin');
                      setShowAuthDialog(true);
                    }} variant="default" size="sm">
                      Sign In
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