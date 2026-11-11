import { supabase } from "./db";

export async function getUserRole(userId: string) {
  const { data, error } = await supabase.from("users").select("role").eq("id", userId).maybeSingle();
  if (error) throw error;
  return data?.role?.toLowerCase() === "provider" ? "provider" : "customer";
}
