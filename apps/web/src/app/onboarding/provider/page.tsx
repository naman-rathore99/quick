"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../../context/auth-context";
import { Button } from "@/components/ui/button";

export default function ProviderOnboardingPage() {
  const router = useRouter();
  const { accessToken, loading: authLoading } = useAuth();
  
  const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const [catalog, setCatalog] = useState<{ id: string; name: string }[]>([]);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [services, setServices] = useState<{ service_id: string; custom_price: number }[]>([
    { service_id: "", custom_price: 0 }
  ]);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${api}/services`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error();
        setCatalog((await response.json()).services);
      })
      .catch(() => {
        if (!controller.signal.aborted) setError("The service catalog is temporarily unavailable.");
      });
    return () => controller.abort();
  }, [api]);

  const handleAddService = () => {
    setServices([...services, { service_id: "", custom_price: 0 }]);
  };

  const handleServiceChange = (index: number, field: "service_id" | "custom_price", value: string) => {
    const newServices = [...services];
    if (field === "custom_price") {
      newServices[index][field] = parseInt(value, 10) || 0;
    } else {
      newServices[index][field] = value;
    }
    setServices(newServices);
  };

  const handleSubmit = async () => {
    if (!accessToken) {
      router.push("/login?from=/onboarding/provider");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${api}/providers/onboard`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          location,
          phone,
          bio,
          services
        })
      });

      if (res.ok) {
        window.location.assign("/provider-bookings");
      } else {
        const err = await res.json();
        setError(err.message || "Something went wrong.");
      }
    } catch {
      setError("Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="qd-flow flex flex-col items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-lg bg-card border border-border/60 rounded-3xl p-8 shadow-sm">
        
        {error && <p role="alert" className="mb-4 text-destructive">{error}</p>}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">Welcome! Where do you work?</h2>
              <p className="text-sm text-muted-foreground">Let customers know which areas you serve.</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Your City / Neighborhood</label>
              <input 
                type="text" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. South Delhi, Vasant Kunj"
                className="w-full rounded-lg border border-border/60 bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            
            <label className="block space-y-2 text-sm font-medium">
              Phone number
              <input type="tel" autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)}
                className="w-full rounded-lg border bg-background px-4 py-3" />
            </label>
            <Button className="w-full" onClick={() => setStep(2)} disabled={!location.trim() || !/^\+?[0-9]{7,15}$/.test(phone.trim())}>
              Next Step
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">Set Your Services & Prices</h2>
              <p className="text-sm text-muted-foreground">Choose the services you offer and enter your price for each.</p>
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {services.map((service, index) => (
                <div key={index} className="p-4 border border-border/60 rounded-xl space-y-3 bg-muted/20">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Service</label>
                    <select
                      aria-label={`Service ${index + 1}`}
                      value={service.service_id}
                      onChange={(e) => handleServiceChange(index, "service_id", e.target.value)}
                      className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                    >
                      <option value="">Choose a service</option>
                      {catalog.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Your Price (₹)</label>
                    <input 
                      type="number" 
                      value={service.custom_price || ""}
                      onChange={(e) => handleServiceChange(index, "custom_price", e.target.value)}
                      placeholder="e.g. 500"
                      className="w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <Button type="button" variant="outline" className="w-full" onClick={handleAddService}>
              + Add another service
            </Button>

            <div className="flex gap-3 pt-4">
              <Button variant="secondary" className="w-1/3" onClick={() => setStep(1)}>Back</Button>
              <Button className="w-2/3" onClick={() => setStep(3)} disabled={services.some((service) => !service.service_id || service.custom_price <= 0) || new Set(services.map((service) => service.service_id)).size !== services.length}>
                Next Step
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">Tell us about yourself</h2>
              <p className="text-sm text-muted-foreground">Customers love knowing who they are hiring.</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Bio</label>
              <textarea 
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="I have 5 years of experience in housekeeping..."
                rows={4}
                className="w-full rounded-lg border border-border/60 bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button variant="secondary" className="w-1/3" onClick={() => setStep(2)}>Back</Button>
              <Button className="w-2/3" onClick={handleSubmit} disabled={authLoading || loading || !bio.trim()}>
                {loading ? "Saving..." : "Complete Profile"}
              </Button>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
