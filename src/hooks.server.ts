import { SvelteKitAuth } from "@auth/sveltekit";
import { PRIVATE_AUTH_GITHUB_SECRET, PRIVATE_AUTH_GITHUB_ID, PRIVATE_AUTH_SECRET } from "$env/static/private";
import GithubProvider from "@auth/core/providers/github";
import { sequence } from "@sveltejs/kit/hooks";
import type { Handle } from "@sveltejs/kit";
import { initLocaleFromCookie } from "$lib/services/i18n";

const { handle: authInitHandle } = SvelteKitAuth({
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
    // maxAge: 30 * 24 * 60 * 60, // 1 month

    strategy: "jwt"
  },

  secret: PRIVATE_AUTH_SECRET,
  trustHost: true
});

const localeHandle: Handle = async ({ event, resolve }) => {
  event.locals.locale = initLocaleFromCookie(event.request.headers.get("cookie") ?? "");
  return resolve(event);
};

export const handle = sequence(localeHandle, authInitHandle);
