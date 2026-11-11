import { Router, Response } from "express";
import { supabase } from "../lib/db";
import { requireAuth, AuthRequest } from "../middleware/requireAuth";
import { apiRateLimit } from "../middleware/authRateLimit";

const router: Router = Router();
const providerRateLimit = apiRateLimit(60);

// ─── Provider Onboarding ───────────────────────────────────────────────────
router.post("/onboard", requireAuth, providerRateLimit, async (req: AuthRequest, res: Response) => {
  const { location, bio, services } = req.body;
  
  if (!location || !services || !Array.isArray(services) || services.length === 0) { 
    res.status(400).json({ message: "Location and at least one service are required" }); 
    return; 
  }

  // 1. Update user role to 'provider' and set location
  const { error: userError } = await supabase
    .from("users")
    .update({ 
      role: "provider",
      location: location
    })
    .eq("id", req.userId);

  if (userError) {
    console.error("Failed to update user profile:", userError.message);
    res.status(500).json({ message: "Failed to update user profile" });
    return;
  }

  // 2. Prepare provider services records
  const providerServices = services.map((s: any) => ({
    provider_id: req.userId,
    service_id: s.service_id || null, 
    bundle_name: s.bundle_name || null,
    custom_price: s.custom_price,
    bio: bio || ""
  }));

  // 3. Insert provider services
  const { error: servicesError } = await supabase
    .from("provider_services")
    .insert(providerServices);

  if (servicesError) {
    console.error("Failed to save provider services:", servicesError.message);
    res.status(500).json({ message: "Failed to save provider services" });
    return;
  }

  res.status(201).json({ message: "Onboarding successful. You are now a provider!" });
});

// ─── Get Providers for a Service ───────────────────────────────────────────
router.get("/", providerRateLimit, async (req: AuthRequest, res: Response) => {
  const { service_id } = req.query;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  if (service_id && (typeof service_id !== "string" || !uuidRegex.test(service_id))) {
    res.status(400).json({ message: "Invalid service filter." });
    return;
  }

  let query = supabase
    .from("provider_services")
    .select(`
      id,
      custom_price,
      bundle_name,
      bio,
      users ( id, name, location, is_verified )
    `);

  if (service_id) {
    query = query.eq("service_id", service_id);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Failed to fetch providers:", error.message);
    res.status(500).json({ message: "Failed to fetch providers" });
    return;
  }

  res.json({ providers: data });
});

export default router;
