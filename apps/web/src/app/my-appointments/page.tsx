"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "../../../context/auth-context";

type Appointment = {
  id: string;
  scheduled_for: string;
  status: string;
  agreed_price: number;
  global_services: { name: string } | null;
};

export default function MyAppointments() {
  const { user, accessToken, loading } = useAuth();
  const [result, setResult] = useState<{ token: string; appointments?: Appointment[]; error?: string }>();
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!user || !accessToken) return;
    const controller = new AbortController();
    const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    fetch(`${api}/bookings`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      signal: controller.signal,
      cache: "no-store",
    }).then(async (response) => {
      if (!response.ok) throw new Error();
      const { bookings } = await response.json();
      if (!controller.signal.aborted) setResult({ token: accessToken, appointments: bookings });
    }).catch(() => {
      if (!controller.signal.aborted) setResult({ token: accessToken, error: "Your appointments could not be loaded." });
    });
    return () => controller.abort();
  }, [user, accessToken, attempt]);

  const current = result?.token === accessToken ? result : undefined;

  return (
    <main className="qd-flow mx-auto w-full max-w-3xl space-y-6 px-6">
      <h1>My appointments</h1>
      {loading ? <p role="status">Checking your account…</p> : !user ? (
        <Link href="/login?from=/my-appointments" className="qd-cta">Sign in to see appointments</Link>
      ) : !current ? <p role="status">Loading appointments…</p> : current.error ? (
        <div><p role="alert">{current.error}</p><button className="mt-2 underline" onClick={() => { setResult(undefined); setAttempt(attempt + 1); }}>Try again</button></div>
      ) : current.appointments?.length ? (
        <ul className="divide-y rounded-2xl border bg-card px-6">
          {current.appointments.map((item) => (
            <li key={item.id} className="flex flex-wrap items-center justify-between gap-4 py-4">
              <div>
                <p className="font-semibold">{item.global_services?.name ?? "Home service"}</p>
                <time dateTime={item.scheduled_for}>{new Date(item.scheduled_for).toLocaleString()}</time>
              </div>
              <p className="capitalize">{item.status.toLowerCase()} · ₹{item.agreed_price}</p>
            </li>
          ))}
        </ul>
      ) : <p>You have no appointments yet. <Link href="/#services" className="underline">Explore services</Link></p>}
    </main>
  );
}
