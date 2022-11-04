interface ImportMetaEnv {
  readonly VITE_auth0_clientId: string;
  readonly VITE_auth0_domain: string;
  readonly VITE_auth0_redirectUri: string;
  readonly VITE_firebase_apiKey: string;
  readonly VITE_firebase_databaseUrl: string;
  readonly VITE_firebase_projectId: string;
  readonly VITE_tutors_store_id: string;
  readonly VITE_tutors_store_secret: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
