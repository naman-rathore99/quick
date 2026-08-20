"use client";

import { motion } from "framer-motion";
import { Star, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const DIDIS = [
  {
    id: 1,
    name: "Sunita D.",
    location: "South Delhi",
    rating: 4.9,
    jobs: 142,
    skills: ["Dusting", "Deep Cleaning"],
    price: 150,
  },
  {
    id: 2,
    name: "Meena K.",
    location: "Vasant Kunj",
    rating: 4.8,
    jobs: 89,
    skills: ["Cooking", "Chopping"],
    price: 200,
  },
  {
    id: 3,
    name: "Aarti S.",
    location: "Gurgaon Sec 14",
    rating: 5.0,
    jobs: 312,
    skills: ["All-rounder"],
    price: 300,
  },
];

export function MeetDidisSection() {
  return (
    <section className="py-20 md:py-28 bg-muted/20 border-t border-border/40">
      <div className="w-full max-w-[min(100%,1200px)] mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Meet our Top Rated Didis
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse through our verified partners, read their reviews, and book the one that fits your needs perfectly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {DIDIS.map((didi, i) => (
            <motion.div
              key={didi.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-shadow flex flex-col"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="h-16 w-16 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-xl">
                  {didi.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold">{didi.name}</h3>
                  <div className="flex items-center text-sm text-muted-foreground gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {didi.location}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm font-medium mb-6 bg-muted/50 p-3 rounded-xl">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span>{didi.rating}</span>
                </div>
                <div className="w-px h-4 bg-border/60" />
                <div className="text-muted-foreground">
                  {didi.jobs} jobs completed
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {didi.skills.map((skill) => (
                  <span key={skill} className="bg-primary/10 text-primary text-xs font-semibold px-2.5 py-1 rounded-md">
                    {skill}
                  </span>
                ))}
              </div>

              <div className="mt-auto flex items-center justify-between pt-4 border-t border-border/40">
                <div>
                  <div className="text-xs text-muted-foreground font-medium">Starts at</div>
                  <div className="font-bold text-lg">₹{didi.price}</div>
                </div>
                <Button variant="outline" className="rounded-full border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground">
                  View Profile
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button size="lg" variant="default" className="rounded-full px-8">
            See all available partners
          </Button>
        </div>
      </div>
    </section>
  );
}
