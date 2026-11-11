"use client";

import { Hero } from "@/features/home/components/Hero";
import { MeetDidisSection } from "@/features/home/components/MeetDidisSection";
import { ServicesSection } from "@/features/services/components/ServicesSection";

import { surfacePage } from "@/lib/design-system";

export default function HomePage() {
  return (
    <main className={`min-h-screen flex flex-col ${surfacePage} text-foreground`}>
      <Hero />
      <ServicesSection />
      <MeetDidisSection />
      <section id="how-it-works" className="mx-auto w-full max-w-6xl px-6 py-16">
        <h2 className="text-4xl">How it works</h2>
        <ol className="mt-6 list-decimal space-y-3 pl-5">
          <li>Choose a service and open your cart.</li>
          <li>At checkout, select a provider and request an appointment.</li>
          <li>Sign in to My appointments to check your request status.</li>
        </ol>
      </section>
    </main>
  );
}