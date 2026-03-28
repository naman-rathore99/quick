"use client";

import { Hero } from "@/features/home/components/Hero";
import { HowItWorksSection } from "@/features/home/components/HowItWorksSection";
import { WhyChooseUsSection } from "@/features/home/components/WhyChooseUsSection";
import { TestimonialsSection } from "@/features/home/components/TestimonialsSection";
import { CtaSection } from "@/features/home/components/CtaSection";
import { ServicesSection } from "@/features/services/components/ServicesSection";
import { Footer } from "@/components/layout/Footer";

import { surfacePage } from "@/lib/design-system";

export default function HomePage() {
  return (
    <main className={`min-h-screen flex flex-col ${surfacePage} text-foreground`}>
      <Hero />
      <ServicesSection />
      <HowItWorksSection />
      <WhyChooseUsSection />
      <TestimonialsSection />
      <CtaSection />
    </main>
  );
}