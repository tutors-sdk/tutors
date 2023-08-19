export interface UserSummary {
  picture: string;
  name: string;
}

export type SuccessFunction = (courseId: string) => void;

interface AmrMethod {
  method: string;
  timestamp: number;
}

interface UserMetadata {
  avatar_url: string;
  email: string;
  email_verified: boolean;
  full_name: string;
  iss: string;
  name: string;
  preferred_username: string;
  provider_id: string;
  sub: string;
  user_name: string;
}

interface AppMetadata {
  provider: string;
  providers: string[];
}

export interface Token {
  aud: string;
  exp: number;
  iat: number;
  iss: string;
  sub: string;
  email: string;
  phone: string;
  app_metadata: AppMetadata;
  user_metadata: UserMetadata;
  role: string;
  aal: string;
  amr: AmrMethod[];
  session_id: string;
}

interface UserMetadata {
  avatar_url: string;
  email: string;
  email_verified: boolean;
  full_name: string;
  iss: string;
  name: string;
  preferred_username: string;
  provider_id: string;
  sub: string;
  user_name: string;
}

export interface User {
  id: string;
  factors: any;
  aud: string;
  iat: number;
  iss: string;
  email: string;
  phone: string;
  app_metadata: {
    provider: string;
    providers: string[];
  };
  user_metadata: UserMetadata;
  role: string;
  aal: string;
  amr: { method: string; timestamp: number }[];
  session_id: string;
}

export interface TokenResponse {
  expires_at: number;
  expires_in: number;
  token_type: string;
  access_token: string;
  refresh_token: string;
  provider_token: string;
  provider_refresh_token: null | string;
  user: User;
  onlineStatus: string;
}
