import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="home-hero">
      <div className="home-hero-grid">
        <div className="home-hero-copy">
          <h1>Book help for your home</h1>
          <p>Browse home services, choose a Didi, and request an appointment that suits your schedule.</p>
          <div className="hero-actions">
            <Link href="#services" className="qd-cta">Explore services <ArrowRight size={18} /></Link>
            <Link href="#how-it-works" className="hero-secondary">How it works</Link>
          </div>
        </div>
        <div className="home-hero-art">
          <Image src="/Hero_image.png" alt="Two Didis caring for a bright, welcoming home" fill sizes="(max-width: 850px) 95vw, 52vw" priority />
        </div>
      </div>
    </section>
  );
}
