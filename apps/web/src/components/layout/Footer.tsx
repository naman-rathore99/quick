"use client";

import Link from "next/link";
import { FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

import { layoutContainer } from "@/lib/design-system";
import { PRIMARY_NAV_LINKS } from "./nav-links";

const social = [
  { href: "https://twitter.com", label: "Twitter", icon: FaTwitter },
  { href: "https://instagram.com", label: "Instagram", icon: FaInstagram },
  { href: "https://linkedin.com", label: "LinkedIn", icon: FaLinkedinIn },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-muted/30 backdrop-blur-sm">
      <div className={`${layoutContainer} py-12 md:py-16`}>

        {/* Top Section */}
        <div className="flex flex-col gap-10 md:flex-row md:justify-between md:gap-12">

          {/* Brand */}
          <div className="max-w-xs">
            <Link
              href="/"
              className="text-xl font-semibold tracking-tight text-foreground"
            >
              QuickDidi
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Trusted home services — cleaning, cooking, and daily help on your schedule.
            </p>
          </div>

          {/* Links */}
          <nav aria-label="Footer">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Quick links
            </p>
            <ul className="mt-4 flex flex-col gap-3">
              {PRIMARY_NAV_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm font-medium text-foreground transition-colors hover:text-primary"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Social */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Connect
            </p>
            <ul className="mt-4 flex gap-3">
              {social.map(({ href, label, icon: Icon }) => (
                <li key={href}>
                  <Link
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="group flex h-10 w-10 items-center justify-center rounded-xl border border-border/60 bg-background/80 backdrop-blur-sm text-muted-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary hover:shadow-md"
                  >
                    <Icon className="h-4 w-4 transition-transform group-hover:scale-110" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col gap-3 border-t border-border/60 pt-8 text-center text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p>&copy; {new Date().getFullYear()} QuickDidi. All rights reserved.</p>
          <p className="sm:text-right">Made for modern Indian homes.</p>
        </div>
      </div>
    </footer>
  );
}