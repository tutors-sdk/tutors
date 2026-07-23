# Authentication

Tutors uses Auth.js (formerly NextAuth) with the SvelteKit adapter for GitHub OAuth authentication.

## Configuration

Defined in `src/hooks.server.ts`:

```typescript
SvelteKitAuth({
  providers: [GitHub({ clientId, clientSecret })],
  session: { strategy: "jwt", maxAge: 365 * 24 * 60 * 60 }, // 1-year sessions
  callbacks: {
    jwt({ token, profile }) {
      if (profile) token.login = profile.login; // GitHub username
      return token;
    },
    session({ session, token }) {
      session.user.login = token.login; // Expose login in client session
      return session;
    }
  }
});
```

Three server handles chained via `sequence()`:
1. **`localeHandle`** — reads locale from cookie, sets `event.locals.locale`
2. **`securityHeaders`** — adds `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`
3. **`authInitHandle`** — Auth.js GitHub OAuth

## Session Flow

1. `src/routes/+layout.server.ts` calls `locals.auth()` → extracts session
2. Returns `{ loggedIn, user: TutorsId, locale }` to all pages
3. `src/routes/+layout.svelte` receives session data:
   - If user exists, calls `tutorsConnectService.reconnect(user)` → switches to Supabase profile, restores sentiment/share status
   - Sets `tutorsId` global rune

## TutorsId

The client-side user identity:

```typescript { .api }
type TutorsId = {
  name: string;    // Display name
  login: string;   // GitHub username
  email: string;
  image: string;   // Avatar URL
  share: string;   // Presence sharing status
  sentiment: string; // Current sentiment
};
```

## Sign In / Sign Out

```typescript
import { signIn, signOut } from "@auth/sveltekit/client";

// Sign in with GitHub
signIn("github");

// Sign out
signOut();
```

The auth page (`src/routes/(auth)/auth/`) displays a `SigninWithGithub` button and `TutorsTerms` component.

## Anonymous Mode

When `PUBLIC_ANON_MODE=TRUE`:
- Auth UI is hidden (no sign-in button)
- Supabase client is not initialized
- Analytics and presence tracking are disabled
- Profile uses `localStorageProfile` only

## Whitelist / Enrollment

Courses can restrict access via enrollment:

```typescript
// course.enrollment.whitelist contains GitHub usernames
tutorsConnectService.checkWhiteList();
```

If the course has an enrollment whitelist and the authenticated user's GitHub login is not in it, they are redirected to the auth page. The enrollment data comes from the course's front matter properties.
