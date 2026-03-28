"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CartSheet } from "@/features/cart/components/CartSheet";

import { layoutContainer, navBar, navLink } from "@/lib/design-system";

import { PRIMARY_NAV_LINKS } from "./nav-links";

export default function Navbar() {
  return (
    <header className={navBar}>
      <div
        className={`${layoutContainer} flex h-14 items-center justify-between gap-3 md:h-[4.25rem]`}
      >
        <Link
          href="/"
          className="text-lg font-bold tracking-[-0.03em] text-foreground md:text-[1.35rem]"
        >
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
          <CartSheet />
          <Button variant="outline" size="default" type="button">
            Login
          </Button>
          <Button size="default" type="button">
            Book Now
          </Button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <CartSheet />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="border-border/80 p-6">
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

              <div className="mt-6 flex flex-col gap-2.5 border-t border-border pt-6">
                <Button variant="outline" type="button" className="w-full">
                  Login
                </Button>
                <Button type="button" className="w-full">
                  Book Now
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
