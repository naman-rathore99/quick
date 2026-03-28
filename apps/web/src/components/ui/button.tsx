"use client";

import React from "react";

import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost" | string;
  size?: "default" | "sm" | "lg" | "icon" | string;
  className?: string;
};

export function Button({
  variant = "default",
  size = "default",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-2 font-semibold transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        size !== "icon" && "active:scale-[0.98]",
        variant === "default" &&
          "rounded-xl bg-primary text-primary-foreground shadow-sm hover:bg-primary/92 hover:shadow-md",
        variant === "outline" &&
          "rounded-xl border border-input bg-background text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground",
        variant === "ghost" &&
          "rounded-xl text-foreground hover:bg-accent hover:text-accent-foreground",
        variant !== "default" &&
          variant !== "outline" &&
          variant !== "ghost" &&
          "rounded-xl bg-primary text-primary-foreground shadow-sm",
        size === "icon" && "h-10 w-10 p-0",
        size !== "icon" && size === "sm" && "h-9 px-3.5 text-sm",
        size !== "icon" && size === "default" && "h-11 px-5 text-sm",
        size !== "icon" && size === "lg" && "h-12 px-8 text-base",
        className
      )}
    >
      {children}
    </button>
  );
}

export default Button;
