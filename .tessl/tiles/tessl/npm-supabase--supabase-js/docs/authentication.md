# Authentication

Complete user management system with email/password authentication, OAuth providers, magic links, and session management. Handles user registration, login, logout, password reset, and profile management with automatic token refresh.

## Capabilities

### Session Management

Manage user sessions with automatic token refresh and persistence across browser sessions.

```typescript { .api }
/**
 * Returns the session, refreshing it if necessary
 * @returns Promise resolving to session data or error
 */
getSession(): Promise<{
  data: { session: Session | null };
  error: AuthError | null;
}>;

/**
 * Gets the current user details if there is an existing session
 * @param jwt - Optional JWT token to use instead of the session token
 * @returns Promise resolving to user data or error
 */
getUser(jwt?: string): Promise<{
  data: { user: User | null };
  error: AuthError | null;
}>;

/**
 * Updates user data for a logged in user
 * @param attributes - User attributes to update
 * @returns Promise resolving to updated user data or error
 */
updateUser(attributes: UserAttributes): Promise<{
  data: { user: User | null };
  error: AuthError | null;
}>;

/**
 * Sets the session data from a refresh_token and returns current Session and Error
 * @param refresh_token - A valid refresh token that was returned on login
 * @returns Promise resolving to session data or error
 */
setSession(refresh_token: string): Promise<{
  data: { session: Session | null };
  error: AuthError | null;
}>;

/**
 * Refresh the access token of the user session
 * @returns Promise resolving to refreshed session or error
 */
refreshSession(): Promise<{
  data: { session: Session | null };
  error: AuthError | null;
}>;

interface Session {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at?: number;
  token_type: string;
  user: User;
}

interface User {
  id: string;
  aud: string;
  role?: string;
  email?: string;
  email_confirmed_at?: string;
  phone?: string;
  phone_confirmed_at?: string;
  confirmation_sent_at?: string;
  confirmed_at?: string;
  recovery_sent_at?: string;
  last_sign_in_at?: string;
  app_metadata: Record<string, any>;
  user_metadata: Record<string, any>;
  identities?: Identity[];
  created_at: string;
  updated_at?: string;
}

interface UserAttributes {
  email?: string;
  phone?: string;
  password?: string;
  data?: Record<string, any>;
}
```

**Usage Examples:**

```typescript
// Get current session
const { data: { session }, error } = await supabase.auth.getSession();
if (session) {
  console.log('User is logged in:', session.user);
}

// Get current user
const { data: { user }, error } = await supabase.auth.getUser();
if (user) {
  console.log('Current user:', user.email);
}

// Update user profile
const { data, error } = await supabase.auth.updateUser({
  data: { display_name: 'New Display Name' }
});

// Refresh session manually
const { data, error } = await supabase.auth.refreshSession();
```

### Email/Password Authentication

Traditional email and password authentication with user registration and login.

```typescript { .api }
/**
 * Creates a new user with email and password
 * @param credentials - User registration credentials
 * @returns Promise resolving to auth response
 */
signUp(credentials: SignUpWithPasswordCredentials): Promise<AuthResponse>;

/**
 * Log in an existing user with email and password
 * @param credentials - User login credentials
 * @returns Promise resolving to auth response
 */
signInWithPassword(credentials: SignInWithPasswordCredentials): Promise<AuthResponse>;

/**
 * Log in an existing user via a third-party provider
 * @param credentials - OAuth provider credentials
 * @returns Promise resolving to auth response with redirect URL
 */
signInWithOAuth(credentials: SignInWithOAuthCredentials): Promise<{
  data: { url: string; provider: Provider };
  error: AuthError | null;
}>;

/**
 * Signs out the current user, if there is a logged in user
 * @param options - Sign out options
 * @returns Promise resolving to error if any
 */
signOut(options?: { scope?: 'global' | 'local' | 'others' }): Promise<{
  error: AuthError | null;
}>;

interface SignUpWithPasswordCredentials {
  email: string;
  password: string;
  options?: {
    /** A custom data object to store the user's metadata */
    data?: Record<string, any>;
    /** The redirect URL embedded in the email link */
    emailRedirectTo?: string;
    /** Verification token received when the user completes the captcha on the site */
    captchaToken?: string;
  };
}

interface SignInWithPasswordCredentials {
  email: string;
  password: string;
  options?: {
    /** Verification token received when the user completes the captcha on the site */
    captchaToken?: string;
  };
}

interface SignInWithOAuthCredentials {
  provider: Provider;
  options?: {
    /** A URL to send the user to after they are confirmed */
    redirectTo?: string;
    /** A space-separated list of scopes granted to the OAuth application */
    scopes?: string;
    /** An object of query params */
    queryParams?: Record<string, string>;
    /** If set to false, no redirect will happen after auth */
    skipBrowserRedirect?: boolean;
  };
}

interface AuthResponse {
  data: {
    user: User | null;
    session: Session | null;
  };
  error: AuthError | null;
}

type Provider = 
  | 'apple'
  | 'azure'
  | 'bitbucket'
  | 'discord'
  | 'facebook'
  | 'figma'
  | 'github'
  | 'gitlab'
  | 'google'
  | 'keycloak'
  | 'linkedin'
  | 'notion'
  | 'slack'
  | 'spotify'
  | 'twitch'
  | 'twitter'
  | 'workos'
  | 'zoom';
```

**Usage Examples:**

```typescript
// Sign up new user
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
  options: {
    data: {
      display_name: 'John Doe',
      age: 30
    }
  }
});

// Sign in existing user
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
});

// OAuth sign in
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: 'https://myapp.com/dashboard'
  }
});

// Sign out
const { error } = await supabase.auth.signOut();
```

### Magic Link and OTP Authentication

Passwordless authentication using email magic links or one-time passwords.

```typescript { .api }
/**
 * Sends a magic link login email to the specified email address
 * @param credentials - Magic link credentials
 * @returns Promise resolving to auth response
 */
signInWithOtp(credentials: SignInWithPasswordlessCredentials): Promise<{
  data: {};
  error: AuthError | null;
}>;

/**
 * Log in a user using a one-time password (OTP)
 * @param credentials - OTP verification credentials
 * @returns Promise resolving to auth response
 */
verifyOtp(credentials: VerifyOtpParams): Promise<AuthResponse>;

/**
 * Sends a reauthentication OTP to the user's email or phone number
 * @param credentials - Reauthentication credentials
 * @returns Promise resolving to success or error
 */
reauthenticate(): Promise<{
  data: {};
  error: AuthError | null;
}>;

interface SignInWithPasswordlessCredentials {
  email?: string;
  phone?: string;
  options?: {
    /** A custom data object to store additional metadata */
    data?: Record<string, any>;
    /** The redirect URL embedded in the email link */
    emailRedirectTo?: string;
    /** If set to false, this method will not create a new user */
    shouldCreateUser?: boolean;
    /** Verification token received when the user completes the captcha */
    captchaToken?: string;
    /** Channel for sending the OTP */
    channel?: 'sms' | 'whatsapp';
  };
}

interface VerifyOtpParams {
  email?: string;
  phone?: string;
  token: string;
  type: 'signup' | 'invite' | 'magiclink' | 'recovery' | 'email_change' | 'sms' | 'phone_change';
  options?: {
    /** The redirect URL embedded in the email link */
    redirectTo?: string;
    /** Verification token received when the user completes the captcha */
    captchaToken?: string;
  };
}
```

**Usage Examples:**

```typescript
// Send magic link
const { data, error } = await supabase.auth.signInWithOtp({
  email: 'user@example.com',
  options: {
    emailRedirectTo: 'https://myapp.com/welcome'
  }
});

// Send SMS OTP
const { data, error } = await supabase.auth.signInWithOtp({
  phone: '+1234567890',
  options: {
    channel: 'sms'
  }
});

// Verify OTP
const { data, error } = await supabase.auth.verifyOtp({
  email: 'user@example.com',
  token: '123456',
  type: 'magiclink'
});

// Verify phone OTP
const { data, error } = await supabase.auth.verifyOtp({
  phone: '+1234567890',
  token: '123456',
  type: 'sms'
});
```

### Password Recovery

Password reset functionality for users who have forgotten their password.

```typescript { .api }
/**
 * Sends a password reset request to an email address
 * @param credentials - Password reset credentials
 * @returns Promise resolving to success or error
 */
resetPasswordForEmail(email: string, options?: {
  /** The redirect URL embedded in the email link */
  redirectTo?: string;
  /** Verification token received when the user completes the captcha */
  captchaToken?: string;
}): Promise<{
  data: {};
  error: AuthError | null;
}>;
```

**Usage Examples:**

```typescript
// Request password reset
const { data, error } = await supabase.auth.resetPasswordForEmail(
  'user@example.com',
  {
    redirectTo: 'https://myapp.com/reset-password'
  }
);

// After user clicks the reset link, they can update their password
const { data, error } = await supabase.auth.updateUser({
  password: 'new-password'
});
```

### Event Handling

Listen for authentication state changes to update your application UI accordingly.

```typescript { .api }
/**
 * Receive a notification every time an auth event happens
 * @param callback - Callback function to handle auth state changes
 * @returns Subscription object with unsubscribe method
 */
onAuthStateChange(
  callback: (event: AuthChangeEvent, session: Session | null) => void
): {
  data: { subscription: Subscription };
};

type AuthChangeEvent = 
  | 'INITIAL_SESSION'
  | 'SIGNED_IN'
  | 'SIGNED_OUT'
  | 'TOKEN_REFRESHED'
  | 'USER_UPDATED'
  | 'PASSWORD_RECOVERY';

interface Subscription {
  id: string;
  callback: (event: AuthChangeEvent, session: Session | null) => void;
  unsubscribe: () => void;
}
```

**Usage Examples:**

```typescript
// Listen for auth changes
const { data: { subscription } } = supabase.auth.onAuthStateChange(
  (event, session) => {
    console.log('Auth event:', event);
    
    if (event === 'SIGNED_IN') {
      console.log('User signed in:', session?.user);
      // Redirect to dashboard
    } else if (event === 'SIGNED_OUT') {
      console.log('User signed out');
      // Redirect to login
    } else if (event === 'TOKEN_REFRESHED') {
      console.log('Token refreshed');
      // Update stored session
    }
  }
);

// Unsubscribe when component unmounts
subscription.unsubscribe();
```

## Error Handling

```typescript { .api }
class AuthError extends Error {
  message: string;
  status?: number;
}

interface AuthErrorCodes {
  signup_disabled: 'Email signups are disabled';
  invalid_credentials: 'Invalid login credentials';
  email_not_confirmed: 'Email not confirmed';
  phone_not_confirmed: 'Phone not confirmed';
  weak_password: 'Password is too weak';
  over_email_send_rate_limit: 'Too many emails sent';
  captcha_failed: 'Captcha failed';
  same_password: 'New password should be different';
  invalid_email: 'Invalid email address';
  email_address_not_authorized: 'Email address not authorized';
}
```

**Usage Examples:**

```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'wrong-password'
});

if (error) {
  switch (error.message) {
    case 'Invalid login credentials':
      console.error('Wrong email or password');
      break;
    case 'Email not confirmed':
      console.error('Please check your email and click the confirmation link');
      break;
    default:
      console.error('Authentication error:', error.message);
  }
}
```

## Third-Party Authentication Setup

```typescript
// Configure OAuth providers in your Supabase dashboard, then use:

// Google OAuth
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    scopes: 'email profile',
    redirectTo: `${window.location.origin}/dashboard`
  }
});

// GitHub OAuth
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'github',
  options: {
    scopes: 'user:email',
    redirectTo: `${window.location.origin}/dashboard`
  }
});

// Apple OAuth (requires additional setup)
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'apple',
  options: {
    redirectTo: `${window.location.origin}/dashboard`
  }
});
```