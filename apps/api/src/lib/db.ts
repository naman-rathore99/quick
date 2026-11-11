import { createClient } from "@supabase/supabase-js";

export const createAuthClient = () => createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  }
);

export const supabase = createAuthClient();

// We don't need a persistent connection like mongoose, so this is just for startup checks if needed
export async function connectDB() {
  console.log("✅ Supabase client initialized");
}