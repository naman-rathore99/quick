import type { LucideIcon } from "lucide-react";
import {
  CalendarCheck,
  CheckCircle2,
  IndianRupee,
  UserCheck,
  BadgeCheck,
  Zap,
  Headphones,
} from "lucide-react";

/* =========================
   HOW IT WORKS
========================= */

export type HowItWorksStep = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export const howItWorksSteps: HowItWorksStep[] = [
  {
    title: "Book Instantly",
    description:
      "Select your service, choose a time slot, and confirm in just a few taps.",
    icon: CalendarCheck,
  },
  {
    title: "Secure Payment",
    description:
      "Pay safely online with clear, upfront pricing and zero surprises.",
    icon: IndianRupee,
  },
  {
    title: "Professional Service",
    description:
      "A trained and verified Didi arrives on time and gets the job done right.",
    icon: UserCheck,
  },
  {
    title: "Share Feedback",
    description:
      "Rate your experience and help us keep improving our service quality.",
    icon: CheckCircle2,
  },
];

/* =========================
   WHY CHOOSE US
========================= */

export type WhyFeature = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export const whyChooseUsFeatures: WhyFeature[] = [
  {
    title: "Verified professionals",
    description: "Every Didi is background-checked and trained for quality.",
    icon: BadgeCheck,
  },
  {
    title: "Affordable pricing",
    description: "Transparent rates with no hidden fees.",
    icon: IndianRupee,
  },
  {
    title: "Fast response",
    description: "Same-day bookings available in select areas.",
    icon: Zap,
  },
  {
    title: "Support that cares",
    description: "Quick help whenever you need it.",
    icon: Headphones,
  },
];

/* =========================
   TESTIMONIALS
========================= */

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
};

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Priya Sharma",
    role: "Working parent, Bengaluru",
    quote:
      "Booking cleaning was effortless. The Didi arrived on time and did a fantastic job.",
    rating: 5,
  },
  {
    id: "2",
    name: "Rahul Mehta",
    role: "IT professional, Mumbai",
    quote:
      "Clear pricing and smooth experience. Everything works perfectly.",
    rating: 5,
  },
  {
    id: "3",
    name: "Ananya Iyer",
    role: "Home maker, Hyderabad",
    quote:
      "Very reliable service. Makes my daily routine much easier.",
    rating: 4,
  },
];

/* =========================
   CTA
========================= */

export const ctaCopy = {
  title: "Ready for a calmer home?",
  subtitle:
    "Book trusted help today — verified Didis, fair prices, and support when you need it.",
  buttonLabel: "Book Now",
};