# Real-time Subscriptions

WebSocket-based real-time functionality for database changes, broadcast messages, and presence tracking. Enables live updates for collaborative applications, chat systems, and live data synchronization.

## Capabilities

### Channel Management

Create and manage real-time channels for different types of real-time communication.

```typescript { .api }
/**
 * Creates a Realtime channel with Broadcast, Presence, and Postgres Changes
 * @param name - The name of the Realtime channel
 * @param opts - Channel configuration options
 * @returns RealtimeChannel instance for subscribing to events
 */
channel(name: string, opts?: RealtimeChannelOptions): RealtimeChannel;

/**
 * Returns all Realtime channels
 * @returns Array of all active RealtimeChannel instances
 */
getChannels(): RealtimeChannel[];

/**
 * Unsubscribes and removes Realtime channel from Realtime client
 * @param channel - The RealtimeChannel instance to remove
 * @returns Promise resolving to operation result
 */
removeChannel(channel: RealtimeChannel): Promise<'ok' | 'timed out' | 'error'>;

/**
 * Unsubscribes and removes all Realtime channels from Realtime client
 * @returns Promise resolving to array of operation results
 */
removeAllChannels(): Promise<('ok' | 'timed out' | 'error')[]>;

interface RealtimeChannelOptions {
  config?: {
    /** Enable postgres changes on this channel */
    postgres_changes?: {
      enabled?: boolean;
    };
    /** Enable presence on this channel */
    presence?: {
      key?: string;
    };
    /** Enable broadcast on this channel */
    broadcast?: {
      self?: boolean;
      ack?: boolean;
    };
  };
}

interface RealtimeChannel {
  /** Channel topic/name */
  topic: string;
  /** Channel state */
  state: 'closed' | 'errored' | 'joined' | 'joining' | 'leaving';
  
  /** Subscribe to events on this channel */
  on(
    type: 'postgres_changes' | 'broadcast' | 'presence',
    filter: Record<string, any>,
    callback: RealtimeCallback
  ): RealtimeChannel;
  
  /** Subscribe to the channel */
  subscribe(callback?: (status: string, err?: Error) => void): RealtimeChannel;
  
  /** Unsubscribe from the channel */
  unsubscribe(): Promise<'ok' | 'timed out' | 'error'>;
  
  /** Send a broadcast message */
  send(options: {
    type: 'broadcast';
    event: string;
    payload?: Record<string, any>;
  }): Promise<'ok' | 'error' | 'timed out'>;
  
  /** Track presence */
  track(state: Record<string, any>): Promise<'ok' | 'error' | 'timed out'>;
  
  /** Untrack presence */
  untrack(): Promise<'ok' | 'error' | 'timed out'>;
}

type RealtimeCallback = (payload: any) => void;
```

**Usage Examples:**

```typescript
// Create a channel
const channel = supabase.channel('room-1');

// Create a channel with configuration
const channel = supabase.channel('room-1', {
  config: {
    broadcast: { self: true, ack: true },
    presence: { key: 'user-id' }
  }
});

// Get all channels
const channels = supabase.getChannels();
console.log('Active channels:', channels.length);

// Remove a specific channel
await supabase.removeChannel(channel);

// Remove all channels
await supabase.removeAllChannels();
```

### Database Change Subscriptions

Listen for real-time changes to your PostgreSQL database tables.

```typescript { .api }
interface PostgresChangesFilter {
  /** The database event to listen for */
  event: '*' | 'INSERT' | 'UPDATE' | 'DELETE';
  /** The database schema name */
  schema: string;
  /** The table name (optional) */
  table?: string;
  /** Additional filter criteria */
  filter?: string;
}

interface PostgresChangesPayload {
  /** The database schema */
  schema: string;
  /** The table name */
  table: string;
  /** The commit timestamp */
  commit_timestamp: string;
  /** The type of event */
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  /** New record data (for INSERT and UPDATE) */
  new?: Record<string, any>;
  /** Old record data (for UPDATE and DELETE) */
  old?: Record<string, any>;
  /** The primary key columns and values */
  old_record?: Record<string, any>;
}

/**
 * Listen for database changes on a channel
 * @param type - Must be 'postgres_changes'
 * @param filter - Database change filter configuration
 * @param callback - Function to handle the change payload
 * @returns RealtimeChannel instance for chaining
 */
on(
  type: 'postgres_changes',
  filter: PostgresChangesFilter,
  callback: (payload: PostgresChangesPayload) => void
): RealtimeChannel;
```

**Usage Examples:**

```typescript
// Listen to all changes on a table
const channel = supabase
  .channel('db-changes')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'posts' },
    (payload) => {
      console.log('Change received!', payload);
      console.log('Event type:', payload.eventType);
      console.log('New data:', payload.new);
      console.log('Old data:', payload.old);
    }
  )
  .subscribe();

// Listen to specific events
const channel = supabase
  .channel('new-posts')
  .on(
    'postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'posts' },
    (payload) => {
      console.log('New post created:', payload.new);
    }
  )
  .subscribe();

// Listen with column filters
const channel = supabase
  .channel('published-posts')
  .on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'posts',
      filter: 'status=eq.published'
    },
    (payload) => {
      console.log('Post published:', payload.new);
    }
  )
  .subscribe();

// Listen to multiple tables
const channel = supabase
  .channel('user-activity')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'users' },
    (payload) => {
      console.log('User change:', payload);
    }
  )
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'profiles' },
    (payload) => {
      console.log('Profile change:', payload);
    }
  )
  .subscribe();
```

### Broadcast Messaging

Send and receive real-time messages between clients connected to the same channel.

```typescript { .api }
interface BroadcastFilter {
  /** The broadcast event name to listen for */
  event: string;
}

interface BroadcastPayload {
  /** The broadcast event name */
  event: string;
  /** The broadcast payload data */
  payload?: Record<string, any>;
  /** The type of broadcast */
  type: 'broadcast';
}

/**
 * Listen for broadcast messages on a channel
 * @param type - Must be 'broadcast'
 * @param filter - Broadcast filter configuration
 * @param callback - Function to handle the broadcast payload
 * @returns RealtimeChannel instance for chaining
 */
on(
  type: 'broadcast',
  filter: BroadcastFilter,
  callback: (payload: BroadcastPayload) => void
): RealtimeChannel;

/**
 * Send a broadcast message to all subscribers of the channel
 * @param options - Broadcast message options
 * @returns Promise resolving to send result
 */
send(options: {
  type: 'broadcast';
  event: string;
  payload?: Record<string, any>;
}): Promise<'ok' | 'error' | 'timed out'>;
```

**Usage Examples:**

```typescript
// Listen for broadcast messages
const channel = supabase
  .channel('chat-room')
  .on(
    'broadcast',
    { event: 'message' },
    (payload) => {
      console.log('New message:', payload.payload);
    }
  )
  .subscribe();

// Send broadcast messages
await channel.send({
  type: 'broadcast',
  event: 'message',
  payload: {
    user: 'john_doe',
    text: 'Hello everyone!',
    timestamp: new Date().toISOString()
  }
});

// Listen for multiple broadcast events
const channel = supabase
  .channel('game-room')
  .on(
    'broadcast',
    { event: 'player-move' },
    (payload) => {
      console.log('Player moved:', payload.payload);
    }
  )
  .on(
    'broadcast',
    { event: 'game-state' },
    (payload) => {
      console.log('Game state updated:', payload.payload);
    }
  )
  .subscribe();

// Send different types of messages
await channel.send({
  type: 'broadcast',
  event: 'player-move',
  payload: { playerId: 'player-1', position: { x: 10, y: 20 } }
});

await channel.send({
  type: 'broadcast',
  event: 'game-state',
  payload: { status: 'playing', score: 100 }
});
```

### Presence Tracking

Track which users are currently online and share their status or state information.

```typescript { .api }
interface PresenceFilter {
  /** The presence event to listen for */
  event: 'sync' | 'join' | 'leave';
}

interface PresencePayload {
  /** The presence event type */
  event: 'sync' | 'join' | 'leave';
  /** The current presence state for all users */
  newPresences?: Record<string, any>;
  /** The presence state for users who left */
  leftPresences?: Record<string, any>;
}

/**
 * Listen for presence events on a channel
 * @param type - Must be 'presence'
 * @param filter - Presence filter configuration
 * @param callback - Function to handle the presence payload
 * @returns RealtimeChannel instance for chaining
 */
on(
  type: 'presence',
  filter: PresenceFilter,
  callback: (payload: PresencePayload) => void
): RealtimeChannel;

/**
 * Track user presence state
 * @param state - The state object to track for this user
 * @returns Promise resolving to track result
 */
track(state: Record<string, any>): Promise<'ok' | 'error' | 'timed out'>;

/**
 * Stop tracking user presence
 * @returns Promise resolving to untrack result
 */
untrack(): Promise<'ok' | 'error' | 'timed out'>;
```

**Usage Examples:**

```typescript
// Track user presence
const channel = supabase
  .channel('online-users', {
    config: {
      presence: {
        key: 'user-id'
      }
    }
  })
  .on(
    'presence',
    { event: 'sync' },
    () => {
      const newState = channel.presenceState();
      console.log('Presence sync:', newState);
      
      const users = Object.keys(newState).map(key => newState[key][0]);
      console.log('Online users:', users);
    }
  )
  .on(
    'presence',
    { event: 'join' },
    ({ newPresences }) => {
      console.log('User joined:', newPresences);
    }
  )
  .on(
    'presence',
    { event: 'leave' },
    ({ leftPresences }) => {
      console.log('User left:', leftPresences);
    }
  )
  .subscribe();

// Track current user
await channel.track({
  user_id: 'user-123',
  username: 'john_doe',
  status: 'online',
  last_seen: new Date().toISOString()
});

// Update user state
await channel.track({
  user_id: 'user-123',
  username: 'john_doe',
  status: 'typing',
  last_seen: new Date().toISOString()
});

// Stop tracking
await channel.untrack();
```

### Channel Lifecycle

```typescript
// Subscribe with callback to handle connection status
const channel = supabase
  .channel('my-channel')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, handleChange)
  .subscribe((status, err) => {
    if (status === 'SUBSCRIBED') {
      console.log('Successfully subscribed to channel');
    }
    if (status === 'CHANNEL_ERROR') {
      console.error('Channel error:', err);
    }
    if (status === 'TIMED_OUT') {
      console.error('Channel timed out');
    }
    if (status === 'CLOSED') {
      console.log('Channel closed');
    }
  });

// Check channel state
console.log('Channel state:', channel.state); // 'closed' | 'errored' | 'joined' | 'joining' | 'leaving'

// Unsubscribe
const result = await channel.unsubscribe();
console.log('Unsubscribe result:', result); // 'ok' | 'timed out' | 'error'
```

## Advanced Real-time Patterns

### Combining Multiple Real-time Features

```typescript
// Create a comprehensive chat room with all features
const chatChannel = supabase
  .channel('chat-room-1', {
    config: {
      broadcast: { self: true, ack: true },
      presence: { key: 'user_id' }
    }
  })
  // Listen for new messages in database
  .on(
    'postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'messages' },
    (payload) => {
      console.log('New message in DB:', payload.new);
    }
  )
  // Listen for typing indicators
  .on(
    'broadcast',
    { event: 'typing' },
    (payload) => {
      console.log('User typing:', payload.payload);
    }
  )
  // Track user presence
  .on(
    'presence',
    { event: 'sync' },
    () => {
      const state = chatChannel.presenceState();
      const onlineUsers = Object.keys(state);
      console.log('Online users:', onlineUsers);
    }
  )
  .subscribe();

// Track user as online
await chatChannel.track({
  user_id: currentUser.id,
  username: currentUser.username,
  avatar_url: currentUser.avatar_url,
  status: 'online'
});

// Send typing indicator
await chatChannel.send({
  type: 'broadcast',
  event: 'typing',
  payload: {
    user_id: currentUser.id,
    is_typing: true
  }
});
```

### Error Handling and Reconnection

```typescript
const channel = supabase
  .channel('robust-channel')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'data' }, handleChange)
  .subscribe((status, err) => {
    switch (status) {
      case 'SUBSCRIBED':
        console.log('Channel subscribed successfully');
        setConnectionStatus('connected');
        break;
      case 'CHANNEL_ERROR':
        console.error('Channel error:', err);
        setConnectionStatus('error');
        // Implement retry logic
        setTimeout(() => {
          channel.subscribe();
        }, 5000);
        break;
      case 'TIMED_OUT':
        console.error('Channel subscription timed out');
        setConnectionStatus('timeout');
        break;
      case 'CLOSED':
        console.log('Channel closed');
        setConnectionStatus('disconnected');
        break;
    }
  });

// Check connection status periodically
setInterval(() => {
  if (channel.state === 'errored' || channel.state === 'closed') {
    console.log('Attempting to reconnect...');
    channel.subscribe();
  }
}, 10000);
```

### Performance Optimization

```typescript
// Use specific filters to reduce unnecessary messages
const optimizedChannel = supabase
  .channel('optimized')
  .on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'posts',
      filter: 'status=eq.published AND author_id=eq.123'
    },
    (payload) => {
      // Only receive updates for published posts by specific author
      console.log('Relevant update:', payload.new);
    }
  )
  .subscribe();

// Batch presence updates to avoid excessive network calls
let presenceUpdateTimeout: NodeJS.Timeout;
const updatePresence = (newState: Record<string, any>) => {
  clearTimeout(presenceUpdateTimeout);
  presenceUpdateTimeout = setTimeout(() => {
    channel.track(newState);
  }, 1000); // Batch updates every second
};
```