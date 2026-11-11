"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "../../../context/auth-context";

type AssignedBooking = {
  id: string;
  scheduled_for: string;
  status: string;
  agreed_price: number;
};

const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function ProviderBookingsPage() {
  const { user, accessToken, loading } = useAuth();
  const [result, setResult] = useState<{ bookings?: AssignedBooking[]; error?: string }>({});
  const [responding, setResponding] = useState<string | null>(null);
  const [responseError, setResponseError] = useState("");

  useEffect(() => {
    if (user?.role !== "provider" || !accessToken) return;
    const controller = new AbortController();
    fetch(`${api}/bookings/assigned`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Could not load your bookings.");
        setResult(await response.json());
      })
      .catch(() => {
        if (!controller.signal.aborted) setResult({ error: "Could not load your bookings." });
      });
    return () => controller.abort();
  }, [user?.role, accessToken]);

  async function respond(id: string, decision: "accept" | "decline") {
    if (!accessToken || responding) return;
    setResponding(id);
    setResponseError("");
    try {
      const response = await fetch(`${api}/bookings/${id}/response`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
        body: JSON.stringify({ decision }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setResult((previous) => ({
        ...previous,
        bookings: previous.bookings?.map((booking) =>
          booking.id === id ? { ...booking, status: data.booking.status } : booking),
      }));
    } catch (error) {
      setResponseError(error instanceof Error ? error.message : "Could not save your response.");
    } finally {
      setResponding(null);
    }
  }

  return (
    <main className="qd-flow mx-auto w-full max-w-3xl px-4">
      <h1>Assigned bookings</h1>
      {responseError && <p role="alert" className="mt-4 text-destructive">{responseError}</p>}
      <div className="mt-6 rounded-2xl border bg-card p-6">
        {loading ? <p>Checking your account…</p>
          : user?.role !== "provider" ? (
            <p>This page is for service providers. <Link className="underline" href="/">Back to home</Link></p>
          ) : result.error ? <p role="alert">{result.error}</p>
          : !result.bookings ? <p>Loading your bookings…</p>
          : result.bookings.length === 0 ? <p>You have no assigned bookings yet.</p>
          : (
            <ul className="divide-y">
              {result.bookings.map((booking) => (
                <li key={booking.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
                  <time dateTime={booking.scheduled_for}>{new Date(booking.scheduled_for).toLocaleString()}</time>
                  <span className="capitalize" aria-live="polite">{booking.status.toLowerCase()}</span>
                  <span>₹{booking.agreed_price}</span>
                  {booking.status === "PENDING" && (
                    <div className="flex gap-2">
                      <Button size="sm" disabled={responding !== null} onClick={() => void respond(booking.id, "accept")}>Accept</Button>
                      <Button size="sm" variant="outline" disabled={responding !== null} onClick={() => void respond(booking.id, "decline")}>Decline</Button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
      </div>
    </main>
  );
}
