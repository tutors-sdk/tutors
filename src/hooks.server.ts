import { SvelteKitAuth } from "@auth/sveltekit";
import { PRIVATE_AUTH_GITHUB_SECRET, PRIVATE_AUTH_GITHUB_ID, PRIVATE_AUTH_SECRET } from "$env/static/private";
import GithubProvider from "@auth/core/providers/github";
import type { Handle } from "@sveltejs/kit";

// Auth.js requires a secret. If it (or the GitHub OAuth credentials) aren't
// configured we skip wiring SvelteKitAuth entirely, so the reader still loads
// for anonymous learners and static asset requests don't 500.
const authConfigured = Boolean(PRIVATE_AUTH_SECRET && PRIVATE_AUTH_GITHUB_ID && PRIVATE_AUTH_GITHUB_SECRET);

const noopAuthHandle: Handle = async ({ event, resolve }) => {
  // Provide a stub so `locals.auth()` calls elsewhere don't blow up.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (event.locals as any).auth = async () => null;
  return resolve(event);
};

let authHandle: Handle = noopAuthHandle;

if (authConfigured) {
  const { handle } = SvelteKitAuth({
    basePath: "/auth",
    providers: [
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      GithubProvider({
        clientId: PRIVATE_AUTH_GITHUB_ID,
        clientSecret: PRIVATE_AUTH_GITHUB_SECRET,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        profile(profile: any) {
          return {
            id: profile.id.toString(),
            name: profile.name,
            login: profile.login,
            email: profile.email,
            image: profile.avatar_url
          };
        }
      })
    ],

    callbacks: {
      async session({ session, token }) {
        session.user.login = token.login;
        return session;
      },
      async jwt({ token, user }) {
        if (user) {
          token.login = user.login;
        }
        return token;
      }
    },

    session: {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      strategy: "jwt"
    },

    secret: PRIVATE_AUTH_SECRET,
    trustHost: true
  });
  authHandle = handle;
} else {
  console.warn("[tutors] Auth.js is not configured (PRIVATE_AUTH_SECRET / GitHub OAuth missing). Sign-in is disabled; running anonymous-only.");
}

export const handle = authHandle;
