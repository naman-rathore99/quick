import { createClient } from "@supabase/supabase-js";

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error("❌ FATAL: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing in environment variables!");
}

export const supabase = createClient(
  process.env.SUPABASE_URL || "https://placeholder.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder",
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// We don't need a persistent connection like mongoose, so this is just for startup checks if needed
export async function connectDB() {
  console.log("✅ Supabase client initialized");
}