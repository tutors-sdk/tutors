# Database Operations

Database operations provide type-safe access to PostgreSQL tables, views, and functions through the PostgREST API. All database operations support filtering, ordering, pagination, and complex joins with full TypeScript support.

## Capabilities

### Table and View Queries

Query tables and views with a fluent API that supports complex filtering, joins, and aggregations.

```typescript { .api }
/**
 * Query a table or view
 * @param relation - The table or view name to query
 * @returns PostgrestQueryBuilder for chaining operations
 */
from<TableName extends string & keyof Schema['Tables']>(
  relation: TableName
): PostgrestQueryBuilder<ClientOptions, Schema, Schema['Tables'][TableName], TableName>;

from<ViewName extends string & keyof Schema['Views']>(
  relation: ViewName
): PostgrestQueryBuilder<ClientOptions, Schema, Schema['Views'][ViewName], ViewName>;

interface PostgrestQueryBuilder<ClientOptions, Schema, Table, TableName> {
  // Data selection
  select(columns?: string, options?: { head?: boolean; count?: 'exact' | 'planned' | 'estimated' }): PostgrestFilterBuilder;
  
  // Data modification
  insert(values: Table['Insert'] | Table['Insert'][], options?: { upsert?: boolean; onConflict?: string; ignoreDuplicates?: boolean }): PostgrestFilterBuilder;
  update(values: Table['Update'], options?: { count?: 'exact' | 'planned' | 'estimated' }): PostgrestFilterBuilder;
  upsert(values: Table['Insert'] | Table['Insert'][], options?: { onConflict?: string; ignoreDuplicates?: boolean }): PostgrestFilterBuilder;
  delete(options?: { count?: 'exact' | 'planned' | 'estimated' }): PostgrestFilterBuilder;
}

interface PostgrestFilterBuilder<ClientOptions, Schema, Row, Result, RelationName, Relationships, Operation> extends PromiseLike<PostgrestResponse<Result>> {
  // Filtering
  eq(column: keyof Row, value: any): PostgrestFilterBuilder;
  neq(column: keyof Row, value: any): PostgrestFilterBuilder;
  gt(column: keyof Row, value: any): PostgrestFilterBuilder;
  gte(column: keyof Row, value: any): PostgrestFilterBuilder;
  lt(column: keyof Row, value: any): PostgrestFilterBuilder;
  lte(column: keyof Row, value: any): PostgrestFilterBuilder;
  like(column: keyof Row, pattern: string): PostgrestFilterBuilder;
  ilike(column: keyof Row, pattern: string): PostgrestFilterBuilder;
  is(column: keyof Row, value: boolean | null): PostgrestFilterBuilder;
  in(column: keyof Row, values: any[]): PostgrestFilterBuilder;
  contains(column: keyof Row, value: any): PostgrestFilterBuilder;
  containedBy(column: keyof Row, value: any): PostgrestFilterBuilder;
  rangeGt(column: keyof Row, range: string): PostgrestFilterBuilder;
  rangeGte(column: keyof Row, range: string): PostgrestFilterBuilder;
  rangeLt(column: keyof Row, range: string): PostgrestFilterBuilder;
  rangeLte(column: keyof Row, range: string): PostgrestFilterBuilder;
  rangeAdjacent(column: keyof Row, range: string): PostgrestFilterBuilder;
  overlaps(column: keyof Row, value: any): PostgrestFilterBuilder;
  textSearch(column: keyof Row, query: string, options?: { type?: 'plain' | 'phrase' | 'websearch'; config?: string }): PostgrestFilterBuilder;
  match(query: Record<keyof Row, any>): PostgrestFilterBuilder;
  not(column: keyof Row, operator: string, value: any): PostgrestFilterBuilder;
  or(filters: string, options?: { foreignTable?: string }): PostgrestFilterBuilder;
  filter(column: keyof Row, operator: string, value: any): PostgrestFilterBuilder;
  
  // Ordering
  order(column: keyof Row, options?: { ascending?: boolean; nullsFirst?: boolean; foreignTable?: string }): PostgrestFilterBuilder;
  
  // Pagination
  range(from: number, to: number, options?: { foreignTable?: string }): PostgrestFilterBuilder;
  limit(count: number, options?: { foreignTable?: string }): PostgrestFilterBuilder;
  
  // Result limiting
  single(): PostgrestFilterBuilder<ClientOptions, Schema, Row, Row, RelationName, Relationships, Operation>;
  maybeSingle(): PostgrestFilterBuilder<ClientOptions, Schema, Row, Row | null, RelationName, Relationships, Operation>;
  
  // Response configuration
  csv(): PostgrestFilterBuilder<ClientOptions, Schema, Row, string, RelationName, Relationships, Operation>;
  geojson(): PostgrestFilterBuilder<ClientOptions, Schema, Row, Record<string, any>, RelationName, Relationships, Operation>;
  explain(options?: { analyze?: boolean; verbose?: boolean; settings?: boolean; buffers?: boolean; wal?: boolean; format?: 'text' | 'json' }): Promise<{ data: any; error: PostgrestError | null }>;
  
  // Response handling
  abortSignal(signal: AbortSignal): PostgrestFilterBuilder;
  then<TResult1 = PostgrestResponse<Result>, TResult2 = never>(
    onfulfilled?: ((value: PostgrestResponse<Result>) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): PromiseLike<TResult1 | TResult2>;
}

interface PostgrestResponse<T> {
  data: T | null;
  error: PostgrestError | null;
  count: number | null;
  status: number;
  statusText: string;
}

interface PostgrestSingleResponse<T> {
  data: T | null;
  error: PostgrestError | null;
}

interface PostgrestMaybeSingleResponse<T> {
  data: T | null;
  error: PostgrestError | null;
}

class PostgrestError extends Error {
  message: string;
  details: string;
  hint: string;
  code: string;
}
```

**Usage Examples:**

```typescript
// Basic select
const { data, error } = await supabase
  .from('users')
  .select('*');

// Select specific columns
const { data, error } = await supabase
  .from('users')
  .select('id, name, email');

// Filtering
const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('status', 'active')
  .gte('age', 18);

// Complex filtering
const { data, error } = await supabase
  .from('posts')
  .select('title, content, users(name)')
  .eq('published', true)
  .ilike('title', '%javascript%')
  .order('created_at', { ascending: false })
  .range(0, 9);

// Insert data
const { data, error } = await supabase
  .from('users')
  .insert([
    { name: 'John Doe', email: 'john@example.com' },
    { name: 'Jane Smith', email: 'jane@example.com' }
  ])
  .select();

// Update data
const { data, error } = await supabase
  .from('users')
  .update({ status: 'inactive' })
  .eq('last_login', null);

// Delete data
const { data, error } = await supabase
  .from('users')
  .delete()
  .eq('status', 'inactive');

// Upsert (insert or update)
const { data, error } = await supabase
  .from('users')
  .upsert({ id: 1, name: 'Updated Name' }, { onConflict: 'id' });
```

### Database Functions (RPC)

Call PostgreSQL functions with parameters and receive typed results.

```typescript { .api }
/**
 * Perform a function call
 * @param fn - The function name to call
 * @param args - The arguments to pass to the function call
 * @param options - Named parameters
 * @returns PostgrestFilterBuilder for handling the function result
 */
rpc<FnName extends string & keyof Schema['Functions']>(
  fn: FnName,
  args?: Schema['Functions'][FnName]['Args'],
  options?: {
    /** When set to true, data will not be returned. Useful if you only need the count */
    head?: boolean;
    /** When set to true, the function will be called with read-only access mode */
    get?: boolean;
    /** Count algorithm to use to count rows returned by set-returning functions */
    count?: 'exact' | 'planned' | 'estimated';
  }
): PostgrestFilterBuilder<
  ClientOptions,
  Schema,
  Schema['Functions'][FnName]['Returns'] extends any[]
    ? Schema['Functions'][FnName]['Returns'][number] extends Record<string, unknown>
      ? Schema['Functions'][FnName]['Returns'][number]
      : never
    : never,
  Schema['Functions'][FnName]['Returns'],
  FnName,
  null,
  'RPC'
>;
```

**Usage Examples:**

```typescript
// Call a function without parameters
const { data, error } = await supabase
  .rpc('get_user_count');

// Call a function with parameters
const { data, error } = await supabase
  .rpc('get_users_by_status', { status_filter: 'active' });

// Call a function and apply filters to the result
const { data, error } = await supabase
  .rpc('search_products', { search_term: 'laptop' })
  .gte('price', 500)
  .order('price', { ascending: true });

// Call a function with head-only response
const { data, error, count } = await supabase
  .rpc('expensive_calculation', { param: 'value' }, { head: true, count: 'exact' });
```

### Schema Switching

Switch between different database schemas for multi-tenant applications or organization.

```typescript { .api }
/**
 * Select a schema to query or perform function calls
 * The schema needs to be on the list of exposed schemas inside Supabase
 * @param schema - The schema to query
 * @returns PostgrestClient configured for the specified schema
 */
schema<DynamicSchema extends string & keyof Omit<Database, '__InternalSupabase'>>(
  schema: DynamicSchema
): PostgrestClient<
  Database,
  ClientOptions,
  DynamicSchema,
  Database[DynamicSchema] extends GenericSchema ? Database[DynamicSchema] : any
>;
```

**Usage Examples:**

```typescript
// Switch to a different schema
const { data, error } = await supabase
  .schema('inventory')
  .from('products')
  .select('*');

// Call functions in a specific schema
const { data, error } = await supabase
  .schema('analytics')
  .rpc('calculate_metrics', { date_range: '7d' });

// Chain schema operations
const publicUsers = await supabase.from('users').select('*');
const adminUsers = await supabase.schema('admin').from('users').select('*');
```

## Advanced Query Patterns

### Joins and Relationships

```typescript
// Inner joins using foreign key relationships
const { data, error } = await supabase
  .from('posts')
  .select(`
    title,
    content,
    users (
      name,
      email
    )
  `);

// Multiple level joins
const { data, error } = await supabase
  .from('comments')
  .select(`
    text,
    posts (
      title,
      users (
        name
      )
    )
  `);

// Filtering on joined tables
const { data, error } = await supabase
  .from('posts')
  .select('title, users(name)')
  .eq('users.status', 'active');
```

### Aggregations and Counting

```typescript
// Get count with data
const { data, error, count } = await supabase
  .from('users')
  .select('*', { count: 'exact' })
  .eq('status', 'active');

// Get count only
const { data, error, count } = await supabase
  .from('users')
  .select('*', { head: true, count: 'exact' })
  .eq('status', 'active');

// Use different count algorithms
const { count } = await supabase
  .from('large_table')
  .select('*', { head: true, count: 'estimated' });
```

### Full-Text Search

```typescript
// Basic text search
const { data, error } = await supabase
  .from('articles')
  .select('title, content')
  .textSearch('content', 'javascript programming');

// Advanced text search with configuration
const { data, error } = await supabase
  .from('articles')
  .select('title, content')
  .textSearch('content', 'javascript & programming', {
    type: 'websearch',
    config: 'english'
  });
```

### Error Handling

```typescript
const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('id', userId);

if (error) {
  console.error('Database error:', {
    message: error.message,
    details: error.details,
    hint: error.hint,
    code: error.code
  });
  return;
}

// Use data safely
console.log('Users:', data);
```