# File Storage

File upload, download, and management system with access policies, image transformations, and CDN integration. Supports any file type with configurable permissions and automatic optimization for images.

## Capabilities

### Bucket Management

Organize files into buckets with different access policies and configurations.

```typescript { .api }
/**
 * Retrieves the details of all Storage buckets within an existing project
 * @returns Promise resolving to list of buckets or error
 */
listBuckets(): Promise<{
  data: Bucket[] | null;
  error: StorageError | null;
}>;

/**
 * Creates a new Storage bucket
 * @param id - A unique identifier for the bucket
 * @param options - Bucket configuration options
 * @returns Promise resolving to created bucket or error
 */
createBucket(id: string, options?: BucketOptions): Promise<{
  data: Bucket | null;
  error: StorageError | null;
}>;

/**
 * Retrieves the details of an existing Storage bucket
 * @param id - The unique identifier of the bucket
 * @returns Promise resolving to bucket details or error
 */
getBucket(id: string): Promise<{
  data: Bucket | null;
  error: StorageError | null;
}>;

/**
 * Updates a Storage bucket
 * @param id - The unique identifier of the bucket
 * @param options - Updated bucket configuration
 * @returns Promise resolving to success message or error
 */
updateBucket(id: string, options: BucketOptions): Promise<{
  data: { message: string } | null;
  error: StorageError | null;
}>;

/**
 * Removes all objects inside a single bucket
 * @param id - The unique identifier of the bucket to empty
 * @returns Promise resolving to success message or error
 */
emptyBucket(id: string): Promise<{
  data: { message: string } | null;
  error: StorageError | null;
}>;

/**
 * Deletes an existing bucket
 * @param id - The unique identifier of the bucket to delete
 * @returns Promise resolving to success message or error
 */
deleteBucket(id: string): Promise<{
  data: { message: string } | null;
  error: StorageError | null;
}>;

interface Bucket {
  id: string;
  name: string;
  owner: string;
  public: boolean;
  file_size_limit?: number;
  allowed_mime_types?: string[];
  created_at: string;
  updated_at: string;
}

interface BucketOptions {
  /** Whether the bucket is publicly accessible */
  public?: boolean;
  /** The maximum file size allowed (in bytes) */
  fileSizeLimit?: number;
  /** Allowed MIME types for uploads */
  allowedMimeTypes?: string[];
}
```

**Usage Examples:**

```typescript
// List all buckets
const { data: buckets, error } = await supabase.storage.listBuckets();
if (buckets) {
  console.log('Available buckets:', buckets);
}

// Create a new bucket
const { data, error } = await supabase.storage.createBucket('avatars', {
  public: true,
  fileSizeLimit: 1024 * 1024 * 2, // 2MB
  allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif']
});

// Get bucket details
const { data: bucket, error } = await supabase.storage.getBucket('avatars');

// Update bucket settings
const { data, error } = await supabase.storage.updateBucket('avatars', {
  public: false,
  fileSizeLimit: 1024 * 1024 * 5 // 5MB
});

// Delete bucket
const { data, error } = await supabase.storage.deleteBucket('old-bucket');
```

### File Operations

Upload, download, list, and delete files within storage buckets.

```typescript { .api }
/**
 * Get a reference to a FileApi instance for a specific bucket
 * @param bucketId - The bucket identifier
 * @returns FileApi instance for file operations
 */
from(bucketId: string): FileApi;

interface FileApi {
  /**
   * Uploads a file to an existing bucket
   * @param path - The relative file path including filename
   * @param fileBody - The file content (File, ArrayBuffer, or string)
   * @param options - Upload options
   * @returns Promise resolving to uploaded file object or error
   */
  upload(
    path: string,
    fileBody: File | ArrayBuffer | string | Blob | FormData,
    options?: FileOptions
  ): Promise<{
    data: FileObject | null;
    error: StorageError | null;
  }>;

  /**
   * Downloads a file from the bucket
   * @param path - The full path and filename of the file
   * @param options - Download options
   * @returns Promise resolving to file blob or error
   */
  download(path: string, options?: TransformOptions): Promise<{
    data: Blob | null;
    error: StorageError | null;
  }>;

  /**
   * Lists all files in a bucket or folder
   * @param path - The folder path (optional, defaults to root)
   * @param options - Search and pagination options
   * @returns Promise resolving to file list or error
   */
  list(path?: string, options?: SearchOptions): Promise<{
    data: FileObject[] | null;
    error: StorageError | null;
  }>;

  /**
   * Removes files within the same bucket
   * @param paths - Array of file paths to remove
   * @returns Promise resolving to removed file objects or error
   */
  remove(paths: string[]): Promise<{
    data: FileObject[] | null;
    error: StorageError | null;
  }>;

  /**
   * Moves files within the same bucket
   * @param fromPath - The original file path
   * @param toPath - The new file path
   * @returns Promise resolving to success message or error
   */
  move(fromPath: string, toPath: string): Promise<{
    data: { message: string } | null;
    error: StorageError | null;
  }>;

  /**
   * Copies files within the same bucket
   * @param fromPath - The original file path
   * @param toPath - The new file path
   * @returns Promise resolving to success message or error
   */
  copy(fromPath: string, toPath: string): Promise<{
    data: { message: string } | null;
    error: StorageError | null;
  }>;

  /**
   * Create a signed URL for file access
   * @param path - The file path
   * @param expiresIn - URL expiration time in seconds
   * @param options - Additional options for the signed URL
   * @returns Promise resolving to signed URL or error
   */
  createSignedUrl(path: string, expiresIn: number, options?: CreateSignedUrlOptions): Promise<{
    data: { signedUrl: string } | null;
    error: StorageError | null;
  }>;

  /**
   * Create signed URLs for multiple files
   * @param paths - Array of file paths
   * @param expiresIn - URL expiration time in seconds
   * @param options - Additional options for the signed URLs
   * @returns Promise resolving to array of signed URLs or error
   */
  createSignedUrls(paths: string[], expiresIn: number, options?: CreateSignedUrlOptions): Promise<{
    data: SignedUrlResponse[] | null;
    error: StorageError | null;
  }>;

  /**
   * Get the public URL for a file (bucket must be public)
   * @param path - The file path
   * @param options - Transform options for images
   * @returns Public URL data
   */
  getPublicUrl(path: string, options?: PublicUrlOptions): {
    data: { publicUrl: string };
  };

  /**
   * Updates a file in the bucket
   * @param path - The relative file path
   * @param fileBody - The new file content
   * @param options - Update options
   * @returns Promise resolving to updated file object or error
   */
  update(
    path: string,
    fileBody: File | ArrayBuffer | string | Blob | FormData,
    options?: FileOptions
  ): Promise<{
    data: FileObject | null;
    error: StorageError | null;
  }>;
}

interface FileObject {
  name: string;
  id?: string;
  updated_at?: string;
  created_at?: string;
  last_accessed_at?: string;
  metadata?: Record<string, any>;
  buckets?: Bucket[];
}

interface FileOptions {
  /** Cache control header */
  cacheControl?: string;
  /** Content type header */
  contentType?: string;
  /** Whether to upsert (overwrite existing file) */
  upsert?: boolean;
  /** Custom metadata */
  metadata?: Record<string, string>;
}

interface SearchOptions {
  /** The number of files to retrieve */
  limit?: number;
  /** The starting position */
  offset?: number;
  /** Sort by column */
  sortBy?: { column: string; order: 'asc' | 'desc' };
  /** Search query */
  search?: string;
}

interface TransformOptions {
  /** Image transformation options */
  transform?: {
    /** Resize width */
    width?: number;
    /** Resize height */
    height?: number;
    /** Resize mode */
    resize?: 'cover' | 'contain' | 'fill';
    /** Output format */
    format?: 'origin' | 'webp';
    /** Image quality (1-100) */
    quality?: number;
  };
}

interface CreateSignedUrlOptions {
  /** Transform options for images */
  transform?: TransformOptions['transform'];
  /** Download file instead of displaying */
  download?: boolean | string;
}

interface PublicUrlOptions {
  /** Transform options for images */
  transform?: TransformOptions['transform'];
  /** Download file instead of displaying */
  download?: boolean | string;
}

interface SignedUrlResponse {
  error: string | null;
  path: string;
  signedUrl: string;
}

class StorageError extends Error {
  statusCode?: string;
}
```

**Usage Examples:**

```typescript
// Upload a file
const file = event.target.files[0];
const { data, error } = await supabase.storage
  .from('avatars')
  .upload(`public/${file.name}`, file, {
    cacheControl: '3600',
    upsert: false
  });

// Upload with custom filename
const { data, error } = await supabase.storage
  .from('documents')
  .upload(`user-123/document-${Date.now()}.pdf`, file, {
    contentType: 'application/pdf',
    metadata: {
      owner: 'user-123',
      category: 'legal'
    }
  });

// Download a file
const { data, error } = await supabase.storage
  .from('avatars')
  .download('public/avatar.jpg');

if (data) {
  // Create a URL for the blob
  const url = URL.createObjectURL(data);
  // Use the URL in an image tag or download link
}

// Download with image transformations
const { data, error } = await supabase.storage
  .from('images')
  .download('photo.jpg', {
    transform: {
      width: 300,
      height: 300,
      resize: 'cover',
      quality: 80
    }
  });

// List files in a bucket
const { data: files, error } = await supabase.storage
  .from('documents')
  .list('user-123/', {
    limit: 100,
    offset: 0,
    sortBy: { column: 'name', order: 'asc' }
  });

// Search for files
const { data: files, error } = await supabase.storage
  .from('documents')
  .list('user-123/', {
    search: 'invoice'
  });

// Remove files
const { data, error } = await supabase.storage
  .from('avatars')
  .remove(['public/avatar1.png', 'public/avatar2.png']);

// Move a file
const { data, error } = await supabase.storage
  .from('documents')
  .move('public/old-name.pdf', 'public/new-name.pdf');

// Copy a file
const { data, error } = await supabase.storage
  .from('documents')
  .copy('templates/invoice.pdf', 'user-123/invoice-copy.pdf');
```

### URL Generation

Generate public URLs and signed URLs for secure file access.

```typescript
// Get public URL (for public buckets)
const { data } = supabase.storage
  .from('avatars')
  .getPublicUrl('public/avatar.jpg');

console.log('Public URL:', data.publicUrl);

// Get public URL with transformations
const { data } = supabase.storage
  .from('images')
  .getPublicUrl('photo.jpg', {
    transform: {
      width: 500,
      height: 300,
      resize: 'cover',
      format: 'webp',
      quality: 85
    }
  });

// Create signed URL for private files
const { data, error } = await supabase.storage
  .from('private-documents')
  .createSignedUrl('user-123/confidential.pdf', 3600); // 1 hour expiry

if (data) {
  console.log('Signed URL:', data.signedUrl);
}

// Create signed URL with download option
const { data, error } = await supabase.storage
  .from('documents')
  .createSignedUrl('report.pdf', 3600, {
    download: 'monthly-report.pdf'
  });

// Create multiple signed URLs
const { data, error } = await supabase.storage
  .from('gallery')
  .createSignedUrls(['image1.jpg', 'image2.jpg', 'image3.jpg'], 7200);

if (data) {
  data.forEach((item, index) => {
    if (!item.error) {
      console.log(`URL ${index + 1}:`, item.signedUrl);
    }
  });
}
```

## Advanced Storage Patterns

### File Upload with Progress Tracking

```typescript
// Upload with progress tracking (requires additional implementation)
const uploadFileWithProgress = async (file: File, path: string) => {
  const { data, error } = await supabase.storage
    .from('uploads')
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error('Upload error:', error.message);
    return null;
  }

  return data;
};

// For progress tracking, you might need to implement chunked uploads
// or use a third-party library that wraps the Supabase upload
```

### Image Processing Pipeline

```typescript
// Upload original image
const originalFile = event.target.files[0];
const timestamp = Date.now();
const originalPath = `originals/${timestamp}-${originalFile.name}`;

const { data: originalUpload, error: uploadError } = await supabase.storage
  .from('images')
  .upload(originalPath, originalFile);

if (!uploadError && originalUpload) {
  // Generate different sizes using public URLs with transformations
  const sizes = [
    { name: 'thumbnail', width: 150, height: 150 },
    { name: 'medium', width: 500, height: 500 },
    { name: 'large', width: 1200, height: 1200 }
  ];

  const processedUrls = sizes.map(size => ({
    ...size,
    url: supabase.storage
      .from('images')
      .getPublicUrl(originalPath, {
        transform: {
          width: size.width,
          height: size.height,
          resize: 'cover',
          format: 'webp',
          quality: 80
        }
      }).data.publicUrl
  }));

  console.log('Processed image URLs:', processedUrls);
}
```

### Batch File Operations

```typescript
// Upload multiple files
const uploadMultipleFiles = async (files: FileList, folder: string) => {
  const uploads = Array.from(files).map(async (file, index) => {
    const path = `${folder}/${Date.now()}-${index}-${file.name}`;
    return supabase.storage
      .from('uploads')
      .upload(path, file, {
        cacheControl: '3600'
      });
  });

  const results = await Promise.all(uploads);
  
  const successful = results.filter(result => !result.error);
  const failed = results.filter(result => result.error);

  console.log(`Uploaded ${successful.length} files successfully`);
  if (failed.length > 0) {
    console.error(`Failed to upload ${failed.length} files`);
  }

  return { successful, failed };
};

// Clean up old files
const cleanupOldFiles = async (bucketId: string, olderThanDays: number) => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

  const { data: files, error } = await supabase.storage
    .from(bucketId)
    .list('', { limit: 1000 });

  if (error || !files) {
    console.error('Error listing files:', error);
    return;
  }

  const oldFiles = files
    .filter(file => {
      const fileDate = new Date(file.created_at || '');
      return fileDate < cutoffDate;
    })
    .map(file => file.name);

  if (oldFiles.length > 0) {
    const { data, error: deleteError } = await supabase.storage
      .from(bucketId)
      .remove(oldFiles);

    if (deleteError) {
      console.error('Error deleting old files:', deleteError);
    } else {
      console.log(`Deleted ${oldFiles.length} old files`);
    }
  }
};
```

### Error Handling

```typescript
const handleStorageOperation = async () => {
  try {
    const { data, error } = await supabase.storage
      .from('documents')
      .upload('test.pdf', file);

    if (error) {
      switch (error.message) {
        case 'The resource already exists':
          console.error('File already exists. Use upsert: true to overwrite.');
          break;
        case 'The object is too large':
          console.error('File size exceeds the bucket limit.');
          break;
        case 'Invalid MIME type':
          console.error('File type not allowed for this bucket.');
          break;
        default:
          console.error('Storage error:', error.message);
      }
      return;
    }

    console.log('File uploaded successfully:', data);
  } catch (err) {
    console.error('Unexpected error:', err);
  }
};
```