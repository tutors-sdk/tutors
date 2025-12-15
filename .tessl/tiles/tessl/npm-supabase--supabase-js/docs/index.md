# Supabase JavaScript Client

Supabase JavaScript Client is an isomorphic TypeScript library that provides a unified interface for interacting with Supabase services. It enables developers to work with authentication, PostgreSQL databases, real-time subscriptions, file storage, and edge functions from any JavaScript runtime environment including browsers, Node.js, Deno, Bun, and React Native.

## Package Information

- **Package Name**: @supabase/supabase-js
- **Package Type**: npm
- **Language**: TypeScript
- **Installation**: `npm install @supabase/supabase-js`

## Core Imports

```typescript
import { createClient, SupabaseClient } from "@supabase/supabase-js";
```

For CommonJS:

```javascript
const { createClient, SupabaseClient } = require("@supabase/supabase-js");
```

UMD (browser):

```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script>
  const { createClient } = supabase;
</script>
```

Deno:

```typescript
import { createClient } from "jsr:@supabase/supabase-js@2";
```

## Basic Usage

```typescript
import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
const supabase = createClient('https://xyzcompany.supabase.co', 'public-anon-key');

// Example: Select data from a table
const { data, error } = await supabase
  .from('countries')
  .select('*');

// Example: Insert data
const { data, error } = await supabase
  .from('countries')
  .insert([
    { name: 'Denmark' }
  ]);

// Example: Listen for real-time changes
const channel = supabase
  .channel('countries-channel')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'countries' },
    (payload) => {
      console.log('Change received!', payload);
    }
  )
  .subscribe();
```

## Architecture

The Supabase client is built around several key components:

- **SupabaseClient**: Main client class that orchestrates all services
- **Database Client**: PostgreSQL operations via PostgREST API (`from()`, `rpc()`, `schema()`)
- **Authentication**: User management and session handling via `auth` property
- **Real-time**: WebSocket-based subscriptions via `realtime` and `channel()` methods
- **Storage**: File upload/download operations via `storage` property
- **Edge Functions**: Serverless function invocation via `functions` property
- **Type Safety**: Full TypeScript support with database schema typing

## Client Factory Function

```typescript { .api }
/**
 * Creates a new Supabase Client instance
 * @param supabaseUrl - The unique Supabase URL for your project
 * @param supabaseKey - The unique Supabase Key for your project
 * @param options - Optional configuration for the client
 * @returns Configured SupabaseClient instance
 */
function createClient<
  Database = any,
  SchemaNameOrClientOptions extends string | { PostgrestVersion: string } = 'public',
  SchemaName extends string = SchemaNameOrClientOptions extends string 
    ? SchemaNameOrClientOptions 
    : 'public'
>(
  supabaseUrl: string,
  supabaseKey: string,
  options?: SupabaseClientOptions<SchemaName>
): SupabaseClient<Database, SchemaNameOrClientOptions, SchemaName>;

interface SupabaseClientOptions<SchemaName> {
  /** Database configuration */
  db?: {
    /** The Postgres schema which your tables belong to. Defaults to 'public' */
    schema?: SchemaName;
  };
  /** Authentication configuration */
  auth?: {
    /** Automatically refreshes the token for logged-in users. Defaults to true */
    autoRefreshToken?: boolean;
    /** Optional key name used for storing tokens in local storage */
    storageKey?: string;
    /** Whether to persist a logged-in session to storage. Defaults to true */
    persistSession?: boolean;
    /** Detect a session from the URL. Used for OAuth login callbacks. Defaults to true */
    detectSessionInUrl?: boolean;
    /** A storage provider. Used to store the logged-in session */
    storage?: SupabaseAuthClientOptions['storage'];
    /** OAuth flow to use - defaults to implicit flow. PKCE is recommended for mobile and server-side applications */
    flowType?: SupabaseAuthClientOptions['flowType'];
    /** If debug messages for authentication client are emitted */
    debug?: SupabaseAuthClientOptions['debug'];
  };
  /** Options passed to the realtime-js instance */
  realtime?: RealtimeClientOptions;
  /** Storage client configuration */
  storage?: StorageClientOptions;
  /** Global configuration */
  global?: {
    /** A custom fetch implementation */
    fetch?: Fetch;
    /** Optional headers for initializing the client */
    headers?: Record<string, string>;
  };
  /** Optional function for using a third-party authentication system with Supabase */
  accessToken?: () => Promise<string | null>;
}
```

## Capabilities

### Database Operations

Core PostgreSQL database operations including table queries, function calls, and schema switching. Provides type-safe query building with filtering, ordering, and pagination.

```typescript { .api }
// Query builder for tables and views
from<TableName extends string>(relation: TableName): PostgrestQueryBuilder;

// Database function calls
rpc<FnName extends string>(
  fn: FnName,
  args?: Record<string, any>,
  options?: {
    head?: boolean;
    get?: boolean;
    count?: 'exact' | 'planned' | 'estimated';
  }
): PostgrestFilterBuilder;

// Schema switching
schema<DynamicSchema extends string>(schema: DynamicSchema): PostgrestClient;
```

[Database Operations](./database.md)

### Authentication

Complete user management system with email/password, OAuth providers, magic links, and session management. Includes user registration, login, logout, and profile management.

```typescript { .api }
interface SupabaseAuthClient {
  // Session management
  getSession(): Promise<{ data: { session: Session | null }, error: AuthError | null }>;
  getUser(): Promise<{ data: { user: User | null }, error: AuthError | null }>;
  
  // Authentication methods
  signUp(credentials: SignUpWithPasswordCredentials): Promise<AuthResponse>;
  signInWithPassword(credentials: SignInWithPasswordCredentials): Promise<AuthResponse>;
  signInWithOAuth(credentials: SignInWithOAuthCredentials): Promise<{ data: { url: string }, error: AuthError | null }>;
  signOut(): Promise<{ error: AuthError | null }>;
  
  // Event handling
  onAuthStateChange(
    callback: (event: AuthChangeEvent, session: Session | null) => void
  ): { data: { subscription: Subscription } };
}
```

[Authentication](./authentication.md)

### Real-time Subscriptions

WebSocket-based real-time functionality for database changes, broadcast messages, and presence tracking. Enables live updates for collaborative applications.

```typescript { .api }
// Create channels for real-time communication
channel(name: string, opts?: RealtimeChannelOptions): RealtimeChannel;

// Channel management
getChannels(): RealtimeChannel[];
removeChannel(channel: RealtimeChannel): Promise<'ok' | 'timed out' | 'error'>;
removeAllChannels(): Promise<('ok' | 'timed out' | 'error')[]>;

interface RealtimeChannel {
  // Database change subscriptions
  on(
    type: 'postgres_changes',
    filter: { event: string; schema: string; table?: string; filter?: string },
    callback: (payload: any) => void
  ): RealtimeChannel;
  
  // Broadcast messaging
  on(type: 'broadcast', filter: { event: string }, callback: (payload: any) => void): RealtimeChannel;
  
  // Presence tracking
  on(type: 'presence', filter: { event: string }, callback: (payload: any) => void): RealtimeChannel;
  
  subscribe(): RealtimeChannel;
  unsubscribe(): Promise<'ok' | 'timed out' | 'error'>;
}
```

[Real-time](./realtime.md)

### File Storage

File upload, download, and management system with access policies, image transformations, and CDN integration. Supports any file type with configurable permissions.

```typescript { .api }
interface SupabaseStorageClient {
  // Bucket operations
  listBuckets(): Promise<{ data: Bucket[] | null, error: StorageError | null }>;
  createBucket(id: string, options?: BucketOptions): Promise<{ data: Bucket | null, error: StorageError | null }>;
  getBucket(id: string): Promise<{ data: Bucket | null, error: StorageError | null }>;
  
  // File operations
  from(bucketId: string): FileApi;
}

interface FileApi {
  upload(path: string, fileBody: File | ArrayBuffer | string, options?: FileOptions): Promise<{ data: FileObject | null, error: StorageError | null }>;
  download(path: string): Promise<{ data: Blob | null, error: StorageError | null }>;
  list(path?: string, options?: SearchOptions): Promise<{ data: FileObject[] | null, error: StorageError | null }>;
  remove(paths: string[]): Promise<{ data: FileObject[] | null, error: StorageError | null }>;
}
```

[Storage](./storage.md)

### Edge Functions

Serverless function invocation system for running custom business logic at the edge. Supports function calls with custom headers, authentication, and region selection.

```typescript { .api }
interface FunctionsClient {
  invoke<T = any>(
    functionName: string,
    options?: FunctionInvokeOptions
  ): Promise<FunctionResponse<T>>;
}

interface FunctionInvokeOptions {
  headers?: Record<string, string>;
  body?: any;
  region?: FunctionRegion;
}

interface FunctionResponse<T> {
  data: T | null;
  error: FunctionsError | null;
}

enum FunctionRegion {
  Any = 'any',
  ApNortheast1 = 'ap-northeast-1',
  ApSoutheast1 = 'ap-southeast-1',
  ApSouth1 = 'ap-south-1',
  CaCentral1 = 'ca-central-1',
  EuCentral1 = 'eu-central-1',
  EuWest1 = 'eu-west-1',
  EuWest2 = 'eu-west-2',
  SaEast1 = 'sa-east-1',
  UsEast1 = 'us-east-1',
  UsWest1 = 'us-west-1',
  UsWest2 = 'us-west-2'
}
```

[Edge Functions](./functions.md)

## Core Types

```typescript { .api }
// Main client class
class SupabaseClient<Database = any, SchemaNameOrClientOptions = 'public', SchemaName = 'public'> {
  auth: SupabaseAuthClient;
  realtime: RealtimeClient;
  storage: SupabaseStorageClient;
  readonly functions: FunctionsClient;
  
  constructor(
    supabaseUrl: string,
    supabaseKey: string,
    options?: SupabaseClientOptions<SchemaName>
  );
}

// Type alias for Fetch
type Fetch = typeof fetch;

// Helper types for query results
type QueryResult<T> = T extends PromiseLike<infer U> ? U : never;
type QueryData<T> = T extends PromiseLike<{ data: infer U }> ? Exclude<U, null> : never;
type QueryError = PostgrestError;

// Schema type definitions
interface GenericTable {
  Row: Record<string, unknown>;
  Insert: Record<string, unknown>;
  Update: Record<string, unknown>;
  Relationships: GenericRelationship[];
}

interface GenericView {
  Row: Record<string, unknown>;
  Relationships: GenericRelationship[];
}

interface GenericFunction {
  Args: Record<string, unknown>;
  Returns: unknown;
}

interface GenericSchema {
  Tables: Record<string, GenericTable>;
  Views: Record<string, GenericView>;
  Functions: Record<string, GenericFunction>;
}

interface GenericRelationship {
  foreignKeyName: string;
  columns: string[];
  isOneToOne?: boolean;
  referencedRelation: string;
  referencedColumns: string[];
}
```

## Re-exported Types

The client re-exports key types from its dependencies for convenience:

```typescript { .api }
// From @supabase/auth-js
export type AuthUser = User;
export type AuthSession = Session;
export * from '@supabase/auth-js';

// From @supabase/postgrest-js
export type PostgrestResponse<T> = PostgrestResponse<T>;
export type PostgrestSingleResponse<T> = PostgrestSingleResponse<T>;
export type PostgrestMaybeSingleResponse<T> = PostgrestMaybeSingleResponse<T>;
export type PostgrestError = PostgrestError;

// From @supabase/functions-js
export type FunctionsHttpError = FunctionsHttpError;
export type FunctionsFetchError = FunctionsFetchError;
export type FunctionsRelayError = FunctionsRelayError;
export type FunctionsError = FunctionsError;
export type FunctionInvokeOptions = FunctionInvokeOptions;
export type FunctionRegion = FunctionRegion;

// From @supabase/realtime-js
export * from '@supabase/realtime-js';
```