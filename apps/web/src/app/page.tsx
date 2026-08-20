"use client";

import { Hero } from "@/features/home/components/Hero";
import { HowItWorksSection } from "@/features/home/components/HowItWorksSection";
import { WhyChooseUsSection } from "@/features/home/components/WhyChooseUsSection";
import { TestimonialsSection } from "@/features/home/components/TestimonialsSection";
import { CtaSection } from "@/features/home/components/CtaSection";
import { MeetDidisSection } from "@/features/home/components/MeetDidisSection";
import { ServicesSection } from "@/features/services/components/ServicesSection";

import { surfacePage } from "@/lib/design-system";

export default function HomePage() {
  return (
    <main className={`min-h-screen flex flex-col ${surfacePage} text-foreground`}>
      <Hero />
      <MeetDidisSection />
      <ServicesSection />
      <HowItWorksSection />
      <WhyChooseUsSection />
      <TestimonialsSection />
      <CtaSection />
    </main>
  );
}