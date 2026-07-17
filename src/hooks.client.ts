import type { HandleClientError } from "@sveltejs/kit";
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from "$env/static/public";

// Set fallback before any other imports. If getSupabase() is called before initSupabase
// (e.g. load runs before hooks), the lib can use this to recover.
(globalThis as any).__TUTORS_TIME_SUPABASE_INIT__ = {
  url: PUBLIC_SUPABASE_URL,
  key: PUBLIC_SUPABASE_ANON_KEY
};

import { initSupabase } from "@tutors/tutors-time-lib";

// Run before any load functions. Hooks modules load at app startup.
initSupabase(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

export const handleError: HandleClientError = ({ error }) => {
  console.error("Client error:", error);
  return {
    message: "An unexpected error occurred"
  };
};
