# Form Actions

SvelteKit provides utilities for handling form submissions with progressive enhancement, validation, and proper error handling.

## Capabilities

### Fail Function

Creates an ActionFailure object for form submission failures, typically used for validation errors or processing failures.

```typescript { .api }
/**
 * Create an ActionFailure object. Call when form submission fails.
 * @param status - HTTP status code (must be 400-599)
 * @param data - Data associated with the failure (e.g. validation errors)
 * @returns ActionFailure object
 */
function fail(status: number): ActionFailure<undefined>;
function fail<T>(status: number, data: T): ActionFailure<T>;
```

**Usage Examples:**

```typescript
import { fail } from '@sveltejs/kit';

// Basic validation failure
export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const email = data.get('email');
    
    if (!email) {
      return fail(400, { message: 'Email is required' });
    }
    
    if (!isValidEmail(email)) {
      return fail(400, { message: 'Invalid email format' });
    }
    
    // Process successful form...
    return { success: true };
  }
};

// Multiple validation errors
export const actions = {
  register: async ({ request }) => {
    const data = await request.formData();
    const errors = {};
    
    const email = data.get('email');
    const password = data.get('password');
    const confirmPassword = data.get('confirmPassword');
    
    if (!email) errors.email = 'Email is required';
    if (!password) errors.password = 'Password is required';
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    if (Object.keys(errors).length > 0) {
      return fail(400, { errors });
    }
    
    try {
      await createUser({ email, password });
      return { success: true };
    } catch (error) {
      return fail(500, { message: 'Registration failed' });
    }
  }
};
```

### Action Failure Type Guard

Checks whether an object is an ActionFailure returned by the `fail()` function.

```typescript { .api }
/**
 * Checks whether this is an action failure thrown by fail().
 * @param e - The object to check
 * @returns Type predicate indicating if e is an ActionFailure
 */
function isActionFailure(e: unknown): boolean;
```

**Usage Examples:**

```typescript
import { isActionFailure, fail } from '@sveltejs/kit';

export const actions = {
  process: async ({ request }) => {
    try {
      const result = await someAsyncOperation();
      return result;
    } catch (error) {
      if (isActionFailure(error)) {
        // Re-throw ActionFailure
        throw error;
      }
      
      // Handle other errors
      return fail(500, { message: 'Processing failed' });
    }
  }
};
```

## Action Patterns

### Basic Form Action

```typescript
// src/routes/contact/+page.server.js
import { fail } from '@sveltejs/kit';

export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const name = data.get('name');
    const email = data.get('email');
    const message = data.get('message');
    
    // Validation
    if (!name || !email || !message) {
      return fail(400, {
        error: 'All fields are required',
        name,
        email,
        message
      });
    }
    
    // Process form
    try {
      await sendContactEmail({ name, email, message });
      return { success: true };
    } catch (error) {
      return fail(500, { error: 'Failed to send message' });
    }
  }
};
```

### Multiple Named Actions

```typescript
// src/routes/admin/users/[id]/+page.server.js
import { fail, redirect, error } from '@sveltejs/kit';

export const actions = {
  update: async ({ request, params }) => {
    const data = await request.formData();
    const user = await getUser(params.id);
    
    if (!user) {
      throw error(404, 'User not found');
    }
    
    try {
      await updateUser(params.id, {
        name: data.get('name'),
        email: data.get('email')
      });
      
      return { success: true, message: 'User updated' };
    } catch (err) {
      return fail(400, { error: 'Update failed' });
    }
  },
  
  delete: async ({ params }) => {
    const user = await getUser(params.id);
    
    if (!user) {
      throw error(404, 'User not found');
    }
    
    try {
      await deleteUser(params.id);
      throw redirect(303, '/admin/users');
    } catch (err) {
      return fail(500, { error: 'Delete failed' });
    }
  }
};
```

### File Upload Action

```typescript
import { fail } from '@sveltejs/kit';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export const actions = {
  upload: async ({ request }) => {
    const data = await request.formData();
    const file = data.get('file');
    
    if (!file || !(file instanceof File)) {
      return fail(400, { error: 'No file uploaded' });
    }
    
    if (file.size > 1024 * 1024) { // 1MB limit
      return fail(400, { error: 'File too large' });
    }
    
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return fail(400, { error: 'Invalid file type' });
    }
    
    try {
      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = `${Date.now()}-${file.name}`;
      const filepath = join('uploads', filename);
      
      await writeFile(filepath, buffer);
      
      return { success: true, filename };
    } catch (error) {
      return fail(500, { error: 'Upload failed' });
    }
  }
};
```

## Client-Side Integration

### Basic Form Handling

```svelte
<!-- src/routes/contact/+page.svelte -->
<script>
  import { enhance } from '$app/forms';
  
  export let form;
</script>

<form method="POST" use:enhance>
  <input 
    name="name" 
    placeholder="Name" 
    value={form?.name ?? ''}
    required 
  />
  
  <input 
    name="email" 
    type="email" 
    placeholder="Email"
    value={form?.email ?? ''}
    required 
  />
  
  <textarea 
    name="message" 
    placeholder="Message"
    value={form?.message ?? ''}
    required
  ></textarea>
  
  <button type="submit">Send Message</button>
  
  {#if form?.error}
    <p class="error">{form.error}</p>
  {/if}
  
  {#if form?.success}
    <p class="success">Message sent successfully!</p>
  {/if}
</form>
```

### Enhanced Form with Loading State

```svelte
<script>
  import { enhance } from '$app/forms';
  
  export let form;
  
  let loading = false;
</script>

<form 
  method="POST" 
  use:enhance={() => {
    loading = true;
    
    return async ({ result, update }) => {
      loading = false;
      
      if (result.type === 'success') {
        // Optional: reset form or show success message
      }
      
      await update();
    };
  }}
>
  <!-- form fields -->
  
  <button type="submit" disabled={loading}>
    {loading ? 'Sending...' : 'Send Message'}
  </button>
</form>
```

### Multiple Actions

```svelte
<script>
  export let data;
  export let form;
</script>

<!-- Update user -->
<form method="POST" action="?/update">
  <input name="name" value={data.user.name} />
  <input name="email" value={data.user.email} />
  <button type="submit">Update</button>
</form>

<!-- Delete user -->
<form method="POST" action="?/delete">
  <button type="submit" onclick="return confirm('Are you sure?')">
    Delete User
  </button>
</form>

{#if form?.error}
  <p class="error">{form.error}</p>
{/if}
```

## Types

### ActionFailure Interface

```typescript { .api }
interface ActionFailure<T = undefined> {
  /** HTTP status code (400-599) */
  status: number;
  /** Data associated with the failure */
  data: T;
}
```

### Action Function Type

```typescript { .api }
type Action<
  Params = Record<string, string>,
  OutputData = Record<string, any> | void
> = (event: RequestEvent<Params>) => Promise<OutputData> | OutputData;

type Actions<
  Params = Record<string, string>,
  OutputData = Record<string, any> | void
> = Record<string, Action<Params, OutputData>>;
```

### Action Result Types

```typescript { .api }
type ActionResult<
  Success = Record<string, unknown> | undefined,
  Failure = Record<string, unknown> | undefined
> =
  | { type: 'success'; status: number; data?: Success }
  | { type: 'failure'; status: number; data?: Failure }
  | { type: 'redirect'; status: number; location: string }
  | { type: 'error'; status?: number; error: any };
```

## Best Practices

1. **Always validate input**: Check form data before processing
2. **Preserve form data on failure**: Return submitted values so users don't lose their input
3. **Use appropriate status codes**: 400 for validation errors, 500 for server errors
4. **Provide helpful error messages**: Users should understand what went wrong
5. **Handle file uploads carefully**: Validate file types, sizes, and sanitize filenames
6. **Use progressive enhancement**: Forms should work without JavaScript
7. **Redirect after successful mutations**: Use 303 redirects after successful POST/PUT/DELETE
8. **Consider security**: Validate CSRF tokens, sanitize input, check permissions