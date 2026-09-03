import { createClient } from "@supabase/supabase-js";

import { publicEnv, serverEnv } from "@/config/env";

export function createSupabaseServiceClient() {
  if (!publicEnv.NEXT_PUBLIC_SUPABASE_URL || !serverEnv.SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Supabase server configuration is missing");
    throw new Error("Supabase server configuration is missing.");
  }

  if (publicEnv.NEXT_PUBLIC_SUPABASE_URL.includes("/rest/v1")) {
    console.error("Supabase project URL is invalid");
  }

  return createClient(publicEnv.NEXT_PUBLIC_SUPABASE_URL, serverEnv.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}