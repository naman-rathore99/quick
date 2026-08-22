"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Wallet, Clock, ShieldCheck, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PartnerLandingPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative px-4 pt-24 pb-32 md:pt-32 md:pb-40 overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 -z-10" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />
        
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground"
          >
            Your Work. <span className="text-primary">Your Price.</span> <br className="hidden md:block" /> Your Schedule.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Join QuickDidi as a verified professional. Be your own boss, set your own rates, and connect with thousands of customers looking for your exact skills.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/partner-signup">
              <Button size="lg" className="h-14 px-8 text-lg rounded-full font-semibold group">
                Start Earning Today
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground sm:ml-4">Takes 2 minutes to apply.</p>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-4 py-24 bg-card border-y border-border/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Partner With Us?</h2>
            <p className="text-muted-foreground text-lg">We built QuickDidi to put the power back in your hands.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Benefit 1 */}
            <div className="p-8 rounded-3xl bg-background border border-border/50 shadow-sm space-y-4 hover:border-primary/50 transition-colors">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <Wallet className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold">You keep what you earn</h3>
              <p className="text-muted-foreground leading-relaxed">
                Set your own custom prices for every service. You deserve to be paid fairly for your hard work, with transparent, industry-low platform fees.
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="p-8 rounded-3xl bg-background border border-border/50 shadow-sm space-y-4 hover:border-primary/50 transition-colors">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <Clock className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold">Total flexibility</h3>
              <p className="text-muted-foreground leading-relaxed">
                Work when you want, where you want. Only accept bookings that fit your schedule. No minimum hours, no forced shifts.
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="p-8 rounded-3xl bg-background border border-border/50 shadow-sm space-y-4 hover:border-primary/50 transition-colors">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold">Trust & Protection</h3>
              <p className="text-muted-foreground leading-relaxed">
                We verify our customers just like we verify you. Enjoy 24/7 support and secure, automatic weekly payouts directly to your bank account.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Motivational Quote / Testimonial */}
      <section className="px-4 py-24 bg-primary text-primary-foreground text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <Star className="w-12 h-12 mx-auto text-primary-foreground/80 fill-current" />
          <blockquote className="text-2xl md:text-4xl font-medium leading-tight">
            "Before QuickDidi, I struggled to find consistent clients. Now, I control my rates, I have regulars who respect my time, and my income has doubled. I'm finally my own boss."
          </blockquote>
          <div>
            <div className="font-bold text-lg">Anita S.</div>
            <div className="text-primary-foreground/80">Premium Housekeeper (2+ years)</div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 py-24 text-center space-y-8">
        <h2 className="text-3xl md:text-5xl font-bold">Ready to take control?</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Join hundreds of independent professionals who are building their business on QuickDidi.
        </p>
        <Link href="/partner-signup" className="inline-block mt-4">
          <Button size="lg" className="h-14 px-10 text-lg rounded-full font-semibold">
            Become a Partner Now
          </Button>
        </Link>
      </section>
    </main>
  );
}
