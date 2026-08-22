"use client";

import Link from "next/link";
import { Menu, Sun, Moon, LogOut, LayoutDashboard, User } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CartSheet } from "@/features/cart/components/CartSheet";
import { useAuth } from "../../../../context/auth-context";

import { layoutContainer, navBar, navLink } from "@/lib/design-system";
import { PRIMARY_NAV_LINKS } from "./nav-links";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  
  const getDashboardLink = () => {
    if (user?.role === "provider") return "/dashboard/provider";
    if (user?.role === "admin") return "/admin";
    return "/dashboard";
  };

  return (
    <header className={navBar}>
      <div className={`${layoutContainer} flex h-14 items-center justify-between gap-3 md:h-[4.25rem]`}>
        <Link href="/" className="text-lg font-bold tracking-[-0.03em] text-foreground md:text-[1.35rem]">
          QuickDidi
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {PRIMARY_NAV_LINKS.map(({ href, label }) => (
            <Link key={href} href={href} className={navLink}>
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2.5 md:flex">
          <ThemeToggle />
          <CartSheet />
          
          {user ? (
            <>
              <Link href={getDashboardLink()}>
                <Button variant="outline" size="default" className="gap-2">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Button>
              </Link>
              <Button variant="ghost" size="icon" onClick={() => logout()} title="Logout" className="text-muted-foreground hover:text-destructive transition-colors">
                <LogOut className="w-5 h-5" />
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline" size="default" type="button">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="default" type="button">
                  Sign up
                </Button>
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <CartSheet />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="border-border/80 p-6 flex flex-col">
              <nav className="mt-4 flex flex-col gap-1" aria-label="Mobile">
                {PRIMARY_NAV_LINKS.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className="rounded-xl px-3 py-3 text-base font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    {label}
                  </Link>
                ))}
              </nav>

              <div className="mt-auto mb-6 flex flex-col gap-2.5 border-t border-border pt-6">
                {user ? (
                  <>
                    <div className="px-3 py-2 text-sm text-muted-foreground flex items-center gap-2 mb-2">
                      <User className="w-4 h-4" />
                      {user.name || user.email}
                    </div>
                    <Link href={getDashboardLink()} className="w-full">
                      <Button variant="outline" type="button" className="w-full gap-2 justify-start">
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </Button>
                    </Link>
                    <Button variant="ghost" type="button" onClick={() => logout()} className="w-full gap-2 justify-start text-destructive hover:text-destructive hover:bg-destructive/10">
                      <LogOut className="w-4 h-4" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="w-full">
                      <Button variant="outline" type="button" className="w-full">
                        Login
                      </Button>
                    </Link>
                    <Link href="/signup" className="w-full">
                      <Button type="button" className="w-full">
                        Sign up
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
