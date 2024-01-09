import { redirect } from "@sveltejs/kit";

/**
 * Is the next URL a safe URL? (relative to our domain)
 */
function isSafe(nextUrl: string | null | undefined): nextUrl is string {
  // Prevent protocol-relative URLs - test for `//foo.bar`
  return (nextUrl && nextUrl[0] === "/" && nextUrl[1] !== "/") || false;
}

export const GET = async ({ url, locals: { supabase } }) => {
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next");

  if (!code) {
    redirect(303, "/auth/error");
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    console.log(error);
    redirect(303, "/auth/error");
  }

  redirect(303, isSafe(next) ? next : "/");
};
