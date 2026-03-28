/**
 * Composed Tailwind patterns — single source for spacing, type, and surfaces.
 * Keeps pages consistent (Urban Co. / delivery-app polish) without scattered one-offs.
 */

/** 1200px rail + responsive horizontal padding */
export const layoutContainer =
  "w-full max-w-[min(100%,1200px)] mx-auto px-4 sm:px-6";

/** Section vertical rhythm (large bands) */
export const sectionY = "py-20 md:py-28";

/** Standard section padding (≥ py-16) */
export const sectionPadding = "py-16 md:py-24 lg:py-28";

/** Page background (behind hero + bands) */
export const surfacePage = "bg-background";

/** Soft band for alternating sections */
export const surfaceMutedBand = "bg-muted/40";

/** Hero: soft radial + base wash */
export const heroBackdrop =
  "pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_85%_55%_at_50%_-18%,#f4f4f5,transparent_58%)]";

export const heroBackdropBase =
  "pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-muted/50 via-background to-background";

/** Typography — hero */
export const textHeroDisplay =
  "text-[2.35rem] font-bold tracking-[-0.03em] text-foreground sm:text-5xl lg:text-6xl xl:text-[3.5rem] leading-[1.06]";

export const textHeroAccent =
  "mt-2 block text-xl font-semibold tracking-[-0.02em] text-muted-foreground sm:text-2xl lg:text-3xl";

export const textHeroBody =
  "mt-6 max-w-[34rem] text-base leading-relaxed text-muted-foreground sm:text-lg";

/** Section headers */
export const textSectionTitle =
  "text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl";

export const textSectionSubtitle =
  "mt-3 text-base leading-relaxed text-muted-foreground sm:text-lg";

/** Trust / meta chips */
export const trustChip =
  "inline-flex items-center gap-2 rounded-full border border-border/80 bg-muted/50 px-3 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-sm sm:text-sm";

/** Primary CTA (fills; use with Button default variant + size lg) */
export const ctaRow = "mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center";

/** Service card shell (includes `group` for icon hover) */
export const cardService =
  "group relative h-full overflow-hidden rounded-2xl border border-border/70 bg-card text-card-foreground shadow-[0_1px_0_0_rgba(0,0,0,0.04),0_8px_24px_-6px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-border hover:shadow-[0_16px_48px_-12px_rgba(0,0,0,0.14)]";

/** Hero visual (placeholder frame) */
export const heroVisualFrame =
  "relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-br from-muted via-background to-muted/80 shadow-[0_24px_64px_-16px_rgba(0,0,0,0.14)] ring-1 ring-black/[0.04]";

export const heroVisualInner =
  "absolute inset-[1px] rounded-[15px] bg-gradient-to-t from-muted/30 to-transparent";

/** Navbar chrome */
export const navBar =
  "sticky top-0 z-50 border-b border-border/70 bg-background/85 shadow-[0_1px_0_0_rgba(0,0,0,0.04)] backdrop-blur-xl backdrop-saturate-150";

export const navLink =
  "text-[15px] font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground";
