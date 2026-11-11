"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useServicesCatalog } from "@/features/services/hooks/use-services-catalog";
import { useCartView } from "@/features/cart/hooks/use-cart";
import { useCartStore } from "@/stores/cart-store";
import { useAuth } from "../../../context/auth-context";

const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

type Offer = {
  id: string;
  custom_price: number;
  users: { id: string; name: string } | null;
};

export default function CheckoutPage() {
  const { user, accessToken, loading } = useAuth();
  const { enrichedLines } = useCartView();
  const removeLine = useCartStore((state) => state.removeLine);
  const { items: services, status: catalogState } = useServicesCatalog();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [offerId, setOfferId] = useState("");
  const [offerState, setOfferState] = useState("");
  const [error, setError] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [saving, setSaving] = useState(false);
  const request = useRef<{ payload: string; id: string } | null>(null);
  const line = enrichedLines[0];
  const normalize = (name: string) => name.trim().toLowerCase().replace(/^house cleaning$/, "home cleaning");
  const service = line && services.find((item) => item.id === line.serviceId || normalize(item.name) === normalize(line.name));
  const serviceId = service?.id;
  const offer = offers.find((item) => item.id === offerId);
  const field = "w-full rounded-lg border bg-background p-3";

  useEffect(() => {
    setOffers([]);
    setOfferId("");
    if (!serviceId) return;

    const controller = new AbortController();
    setOfferState("Loading providers…");
    fetch(`${api}/providers?service_id=${encodeURIComponent(serviceId)}`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error();
        const result: { providers: Offer[] } = await response.json();
        const available = result.providers
          .filter((item) => item.users && item.users.id !== user?.id && Number(item.custom_price) > 0)
          .sort((a, b) => Number(a.custom_price) - Number(b.custom_price));
        const distinct = Array.from(new Map(available.reverse().map((item) => [item.users!.id, item])).values());
        setOffers(distinct);
        setOfferState(distinct.length ? "" : "No providers currently list this service.");
      })
      .catch(() => {
        if (!controller.signal.aborted) setOfferState("Providers could not be loaded. Reload to try again.");
      });
    return () => controller.abort();
  }, [serviceId, user?.id]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving || !accessToken || !serviceId || !line || !offer?.users) return;
    setError("");
    const form = new FormData(event.currentTarget);
    const appointment = new Date(String(form.get("appointment")));
    if (!Number.isFinite(appointment.getTime()) || appointment.getTime() <= Date.now()) {
      setError("Choose a time in the future.");
      return;
    }
    const payload = JSON.stringify({
      serviceId,
      providerId: offer.users.id,
      quantity: line.quantity,
      scheduledFor: appointment.toISOString(),
      contactName: form.get("name"),
      phone: form.get("phone"),
      address: form.get("address"),
    });
    if (request.current?.payload !== payload) request.current = { payload, id: crypto.randomUUID() };
    setSaving(true);
    try {
      const response = await fetch(`${api}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ ...JSON.parse(payload), requestId: request.current.id }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Booking could not be saved.");
      setConfirmation(`Request ${result.booking.id} saved for ${line.name}. Status: ${result.booking.status}. No payment was collected.`);
      removeLine(line.serviceId);
      request.current = null;
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Booking could not be saved.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="qd-flow mx-auto w-full max-w-3xl space-y-6 px-6">
      <h1>Checkout</h1>
      {confirmation && <p role="status" className="rounded-xl border bg-card p-4">{confirmation} <Link className="underline" href="/my-appointments">View appointments</Link></p>}
      {!line ? <p>Your cart is empty. <Link className="underline" href="/#services">Explore services</Link></p> : (
        <form onSubmit={submit} className="space-y-5 rounded-2xl border bg-card p-6">
          <div>
            <h2 className="text-2xl">{line.name} × {line.quantity}</h2>
            <p className="text-sm text-muted-foreground">Request one service at a time. Your other services stay in the cart.</p>
          </div>
          {(catalogState || !service) && <p role="status">{catalogState || "This service is unavailable in the live catalog."}</p>}
          {service && (
            <label className="block">Service provider
              <select className={field} value={offerId} required onChange={(event) => setOfferId(event.target.value)}>
                <option value="">Choose a provider</option>
                {offers.map((item) => <option key={item.id} value={item.id}>{item.users?.name} · ₹{item.custom_price} each</option>)}
              </select>
            </label>
          )}
          {service && offerState && <p role="status">{offerState}</p>}
          <label className="block">Full name<input className={field} name="name" autoComplete="name" maxLength={100} required /></label>
          <label className="block">Phone number<input className={field} name="phone" type="tel" autoComplete="tel" maxLength={20} required /></label>
          <label className="block">Service address<textarea className={field} name="address" autoComplete="street-address" maxLength={500} required /></label>
          <label className="block">Appointment date and time<input className={field} name="appointment" type="datetime-local" required /></label>
          {offer && <p>Estimated total <strong>₹{Number(offer.custom_price) * line.quantity}</strong></p>}
          {error && <p role="alert" className="text-destructive">{error}</p>}
          {loading ? <p>Checking your account…</p> : accessToken ? (
            <Button type="submit" disabled={saving || !offer || !serviceId}>{saving ? "Saving…" : "Request booking"}</Button>
          ) : <Link className="qd-cta" href="/login?from=/checkout">Sign in to request booking</Link>}
        </form>
      )}
    </main>
  );
}
