import { createSupabaseLoadClient } from "@supabase/auth-helpers-sveltekit";
import type { Database } from "../DatabaseDefinitions";

export const load = async ({ fetch, data, depends }) => {
  depends("supabase:auth");

  const supabase = createSupabaseLoadClient<Database>({
    supabaseUrl: import.meta.env.VITE_PUBLIC_SUPABASE_URL,
    supabaseKey: import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY,
    event: { fetch },
    serverSession: data.session
  });

  const {
    data: { session }
  } = await supabase.auth.getSession();

  return { supabase, session };
};
