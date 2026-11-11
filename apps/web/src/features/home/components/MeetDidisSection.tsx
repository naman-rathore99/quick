"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";

type Listing = {
  id: string;
  custom_price: number;
  bio: string | null;
  users: { id: string; name: string; location: string; is_verified: boolean } | null;
};

export function MeetDidisSection() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [message, setMessage] = useState("Looking for service providers…");

  useEffect(() => {
    const controller = new AbortController();
    const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    fetch(`${api}/providers`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error();
        const { providers }: { providers: Listing[] } = await response.json();
        const profiles = new Map<string, Listing>();
        for (const listing of providers) {
          if (!listing.users) continue;
          const current = profiles.get(listing.users.id);
          if (!current || Number(listing.custom_price) < Number(current.custom_price)) {
            profiles.set(listing.users.id, listing);
          }
        }
        setListings([...profiles.values()]);
        setMessage(profiles.size ? "" : "No providers are listed yet.");
      })
      .catch(() => {
        if (!controller.signal.aborted) setMessage("Provider listings are temporarily unavailable.");
      });
    return () => controller.abort();
  }, []);

  return (
    <section className="border-t bg-muted/20 px-4 py-16" aria-labelledby="didi-listings">
      <div className="mx-auto max-w-6xl">
        <h2 id="didi-listings" className="mb-6 text-4xl">Meet the Didis</h2>
        {message && <p role="status" className="text-muted-foreground">{message}</p>}
        <div className="grid gap-4 md:grid-cols-3">
          {listings.map(({ id, users, bio, custom_price }) => (
            <article key={id} className="space-y-3 rounded-2xl border bg-card p-6">
              <h3 className="text-lg font-semibold">{users?.name}</h3>
              {users?.location && <p className="flex items-center gap-2"><MapPin size={16} aria-hidden="true" />{users.location}</p>}
              {users?.is_verified && <p className="text-sm font-medium text-primary">Verified provider</p>}
              {bio && <p className="text-sm text-muted-foreground">{bio}</p>}
              {Number(custom_price) > 0 && <p>From ₹{custom_price}</p>}
            </article>
          ))}
        </div>
        <Link href="#services" className="qd-cta mt-6">Choose a service</Link>
      </div>
    </section>
  );
}
