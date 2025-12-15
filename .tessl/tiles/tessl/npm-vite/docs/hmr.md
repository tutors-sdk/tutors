# Hot Module Replacement

Vite's Hot Module Replacement (HMR) system provides instant updates during development with WebSocket communication, client-server coordination, and comprehensive plugin integration for seamless development experience.

## Capabilities

### Server Hot Channel

Create server-side HMR channel for communication with clients.

```typescript { .api }
/**
 * Create server hot channel for HMR communication
 * @param server - Vite dev server (optional)
 * @returns ServerHotChannel instance
 */
function createServerHotChannel(server?: ViteDevServer): ServerHotChannel;

interface ServerHotChannel extends HotChannel {
  /** Send update to all clients */
  send(payload: HotPayload): void;
  /** Close channel */
  close(): void;
  /** Handle client connection */
  on(event: 'connection', handler: (client: HotChannelClient) => void): void;
  /** Handle client disconnect */
  on(event: 'disconnect', handler: (client: HotChannelClient) => void): void;
}
```

**Usage Examples:**

```typescript
import { createServerHotChannel } from "vite";

// Create HMR channel
const hotChannel = createServerHotChannel(server);

// Send custom update
hotChannel.send({
  type: 'custom',
  event: 'my-plugin-update',
  data: { message: 'Plugin state changed' }
});

// Listen for connections
hotChannel.on('connection', (client) => {
  console.log('Client connected:', client.socket.id);
});
```

### HMR Configuration

Configure Hot Module Replacement behavior and WebSocket settings.

```typescript { .api }
interface HmrOptions {
  /** HMR port (default: 24678) */
  port?: number;
  /** HMR host */
  host?: string;
  /** Client-side port override */
  clientPort?: number;
  /** Show error overlay */
  overlay?: boolean;
  /** HMR server */
  server?: any;
}

interface HotUpdateOptions {
  /** Update type */
  type: 'js-update' | 'css-update' | 'full-reload';
  /** Timestamp */
  timestamp?: number;
  /** Updates to apply */
  updates?: Update[];
}
```

### HMR Payload Types

Types for different HMR messages sent between server and client.

```typescript { .api }
/**
 * Union of all possible HMR payloads
 */
type HotPayload = 
  | ConnectedPayload
  | UpdatePayload  
  | FullReloadPayload
  | PrunePayload
  | ErrorPayload
  | CustomPayload;

interface ConnectedPayload {
  type: 'connected';
}

interface UpdatePayload {
  type: 'update';
  updates: Update[];
}

interface Update {
  /** Update type */
  type: 'js-update' | 'css-update';
  /** Module path */
  path: string;
  /** Update timestamp */
  timestamp: number;
  /** Accepted modules */
  acceptedPath: string;
  /** Explicit imports only */
  explicitImportRequired?: boolean;
  /** SSR error */
  ssrError?: Error;
}

interface FullReloadPayload {
  type: 'full-reload';
  /** Reload trigger path */
  path?: string;
}

interface PrunePayload {
  type: 'prune';
  /** Paths to prune */
  paths: string[];
}

interface ErrorPayload {
  type: 'error';
  /** Error details */
  err: {
    message: string;
    stack: string;
    id?: string;
    frame?: string;
    plugin?: string;
    pluginCode?: string;
    loc?: {
      file?: string;
      line: number;
      column: number;
    };
  };
}

interface CustomPayload {
  type: 'custom';
  /** Custom event name */
  event: string;
  /** Custom data */
  data?: any;
}
```

**Usage Examples:**

```typescript
// Send different types of updates
const hotChannel = createServerHotChannel();

// JavaScript update
hotChannel.send({
  type: 'update',
  updates: [{
    type: 'js-update',
    path: '/src/components/Button.tsx', 
    timestamp: Date.now(),
    acceptedPath: '/src/components/Button.tsx'
  }]
});

// CSS update
hotChannel.send({
  type: 'update',
  updates: [{
    type: 'css-update',
    path: '/src/styles/main.css',
    timestamp: Date.now(),
    acceptedPath: '/src/styles/main.css'
  }]
});

// Full reload
hotChannel.send({
  type: 'full-reload',
  path: '/vite.config.js'
});

// Custom event
hotChannel.send({
  type: 'custom',
  event: 'config-changed',
  data: { newConfig: {...} }
});
```

### HMR Context

Context information provided to HMR handlers during hot updates.

```typescript { .api }
interface HmrContext {
  /** File that changed */
  file: string;
  /** Change timestamp */
  timestamp: number;
  /** Affected module nodes */
  modules: Set<ModuleNode>;
  /** Read file contents */
  read: () => string | Promise<string>;
  /** Vite dev server */
  server: ViteDevServer;
}
```

### WebSocket Server

WebSocket server interface for HMR communication.

```typescript { .api }
interface WebSocketServer {
  /** Send message to all clients */
  send(payload: HotPayload): void;
  /** Send message to specific client */
  send(client: WebSocketClient, payload: HotPayload): void;
  /** Close server */
  close(): Promise<void>;
  /** Handle client connections */
  on(event: 'connection', handler: (socket: WebSocketClient, request: any) => void): void;
  /** Handle errors */
  on(event: 'error', handler: (error: Error) => void): void;
}

interface WebSocketClient {
  /** Send message to client */
  send(data: string): void;
  /** Close client connection */
  close(): void;
  /** Terminate connection */
  terminate(): void;
  /** Connection state */
  readyState: number;
  /** Client socket */
  socket: any;
  /** Handle messages */
  on(event: 'message', handler: (data: any) => void): void;
  /** Handle close */
  on(event: 'close', handler: () => void): void;
  /** Handle errors */
  on(event: 'error', handler: (error: Error) => void): void;
}

interface WebSocketCustomListener<T = any> {
  (data: T, client: WebSocketClient): void;
}
```

### Hot Channel Types

Normalized hot channel interfaces for consistent HMR communication.

```typescript { .api }
interface HotChannel {
  /** Listen for events */
  on(event: string, handler: HotChannelListener): void;
  /** Remove event listener */
  off(event: string, handler: HotChannelListener): void;
  /** Send data */
  send(data: any): void;
}

interface HotChannelClient {
  /** Send data to client */
  send(data: any): void;
  /** Close client connection */
  close(): void;
  /** Underlying socket */
  socket: any;
}

interface NormalizedHotChannel extends HotChannel {
  /** Send payload */
  send(payload: HotPayload): void;
}

interface NormalizedHotChannelClient extends HotChannelClient {
  /** Send payload to client */
  send(payload: HotPayload): void;
}

interface NormalizedServerHotChannel extends ServerHotChannel {
  /** Send to all clients */
  send(payload: HotPayload): void;
  /** Send to specific client */
  send(client: NormalizedHotChannelClient, payload: HotPayload): void;
}

type HotChannelListener = (data: any, client?: HotChannelClient) => void;
```

## HMR Integration Patterns

### Plugin HMR Support

Integrate HMR support in plugins for custom file types.

```typescript { .api }
// Plugin with HMR support
function myPlugin(): Plugin {
  return {
    name: 'my-plugin',
    load(id) {
      if (id.endsWith('.myext')) {
        // Load custom file type
        return `export default ${JSON.stringify(loadMyFile(id))}`;
      }
    },
    handleHotUpdate(ctx) {
      if (ctx.file.endsWith('.myext')) {
        // Custom HMR logic for .myext files
        ctx.server.ws.send({
          type: 'custom',
          event: 'myext-changed',
          data: { file: ctx.file }
        });
        
        // Return empty array to prevent default HMR
        return [];
      }
    }
  };
}
```

### Client-Side HMR API

Client-side HMR API available in development.

```typescript { .api }
// Available in client code during development
interface ImportMeta {
  hot?: {
    /** Accept updates for this module */
    accept(): void;
    accept(cb: (newModule: any) => void): void;
    accept(deps: string[], cb: (newModules: any[]) => void): void;
    
    /** Decline updates for this module */
    decline(): void;
    
    /** Dispose callback when module is replaced */
    dispose(cb: () => void): void;
    
    /** Invalidate and force full reload */
    invalidate(): void;
    
    /** Register custom event listener */
    on<T = any>(event: string, cb: (data: T) => void): void;
    
    /** Send custom event to server */
    send<T = any>(event: string, data?: T): void;
  };
}
```

**Usage Examples:**

```typescript
// Component with HMR support
let count = 0;

export function Counter() {
  return `<div>Count: ${count}</div>`;
}

// HMR boundary
if (import.meta.hot) {
  import.meta.hot.accept((newModule) => {
    // Handle module replacement
    console.log('Counter updated');
  });
  
  import.meta.hot.dispose(() => {
    // Cleanup before replacement
    console.log('Cleaning up counter');
  });
  
  // Listen for custom events
  import.meta.hot.on('reset-counter', () => {
    count = 0;
    updateUI();
  });
}
```

### Error Handling

Handle HMR errors and recovery.

```typescript { .api }
// Error handling in plugins
function errorHandlingPlugin(): Plugin {
  return {
    name: 'error-handling',
    handleHotUpdate(ctx) {
      try {
        // Process update
        processUpdate(ctx.file);
      } catch (error) {
        // Send error to client
        ctx.server.ws.send({
          type: 'error',
          err: {
            message: error.message,
            stack: error.stack,
            id: ctx.file,
            plugin: 'error-handling'
          }
        });
        
        // Don't propagate error
        return ctx.modules;
      }
    }
  };
}
```