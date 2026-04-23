# Frontend Architecture Guide

## System Overview

This document outlines the architectural decisions, patterns, and best practices for the Image Processing Web App frontend.

## Table of Contents

1. [Architecture Layers](#architecture-layers)
2. [Component Design](#component-design)
3. [State Management](#state-management)
4. [API Communication](#api-communication)
5. [Performance Considerations](#performance-considerations)
6. [Security](#security)
7. [Scalability Strategy](#scalability-strategy)

---

## Architecture Layers

The frontend follows a layered architecture pattern:

```
┌─────────────────────────────────────────┐
│         UI Layer (Components)            │
│  - Pages, Layouts, UI Components        │
└─────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────┐
│      Business Logic Layer (Hooks)        │
│  - useImageProcessing, useUpload, etc.   │
└─────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────┐
│      Data Access Layer (API Client)      │
│  - HTTP calls, data transformation       │
└─────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────┐
│    External Services (Backend API)       │
│  - Image processing, storage             │
└─────────────────────────────────────────┘
```

### Layer Responsibilities

#### UI Layer

- Render visual components
- Handle user interactions
- Manage component-level state
- Accessibility compliance

#### Business Logic Layer

- Orchestrate data fetching
- Handle side effects
- Manage complex state transitions
- Cross-cutting concerns

#### Data Access Layer

- API communication
- Request/response handling
- Error handling
- Data normalization

#### External Services

- Image processing algorithms
- File storage
- Database operations

---

## Component Design

### Component Structure Template

````typescript
// src/components/ImageEditor/ImageEditor.tsx

interface ImageEditorProps {
  /** Initial image file to edit */
  initialImage?: File
  /** Callback when image is processed */
  onImageProcessed?: (result: ProcessedImage) => void
  /** Optional CSS class name */
  className?: string
}

/**
 * ImageEditor Component
 *
 * A comprehensive image editing interface with real-time preview.
 * Provides controls for image smoothing and sharpening effects.
 *
 * @example
 * ```tsx
 * <ImageEditor
 *   onImageProcessed={(result) => console.log(result)}
 * />
 * ```
 */
export function ImageEditor({
  initialImage,
  onImageProcessed,
  className
}: ImageEditorProps) {
  // State
  const [image, setImage] = useState<File | null>(initialImage ?? null)
  const [filter, setFilter] = useState<'smooth' | 'sharpen'>('smooth')
  const [intensity, setIntensity] = useState(50)

  // Hooks
  const { processImage, isProcessing, error } = useImageProcessing()
  const isMobile = useMobile()

  // Event handlers
  const handleProcess = useCallback(async () => {
    if (!image) return

    const result = await processImage(image, filter, intensity)
    onImageProcessed?.(result)
  }, [image, filter, intensity, processImage, onImageProcessed])

  // Render
  return (
    <div className={cn("space-y-6", className)}>
      {/* Component content */}
    </div>
  )
}

// Export only the public component
export type { ImageEditorProps }
````

### Component Classification

#### 1. **Presentational Components** (Pure UI)

- No business logic
- Receive data via props
- Emit events via callbacks
- Example: `Button`, `Input`, `Card`

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

export function Button({ variant = 'primary', size = 'md', isLoading, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }))}
      disabled={isLoading}
      {...props}
    >
      {isLoading && <Spinner className="mr-2" />}
      {children}
    </button>
  )
}
```

#### 2. **Container Components** (Smart)

- Manage state and side effects
- Compose presentational components
- Connect to API/services
- Example: `ImageEditor`, `ProcessingPanel`

```typescript
export function ProcessingPanel() {
  const { filter, setFilter, intensity, setIntensity } = useProcessingContext()
  const { processImage, isProcessing } = useImageProcessing()

  return (
    <div>
      <FilterSelector value={filter} onChange={setFilter} />
      <IntensitySlider value={intensity} onChange={setIntensity} />
      <Button
        onClick={() => processImage(filter, intensity)}
        disabled={isProcessing}
        isLoading={isProcessing}
      >
        Process Image
      </Button>
    </div>
  )
}
```

#### 3. **Layout Components**

- Define page structure
- Provide navigation
- Example: `RootLayout`, `AppLayout`

### Props Best Practices

```typescript
// ✅ GOOD: Clear, focused props
interface DialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  title: string
  children: ReactNode
}

// ❌ BAD: Too many props, unclear purpose
interface DialogProps {
  isOpen?: boolean
  onClose?: () => void
  onOpen?: () => void
  onCancel?: () => void
  title?: string
  subtitle?: string
  children?: ReactNode
  className?: string
  overlayClassName?: string
  // ... more props
}
```

---

## State Management

### State Classification

#### 1. **UI State** (Component-level)

Local state for UI interactions, animations, forms:

```typescript
const [isMenuOpen, setIsMenuOpen] = useState(false)
const [formValues, setFormValues] = useState({ name: '', email: '' })
const [activeTab, setActiveTab] = useState('preview')
```

#### 2. **Server State** (API data)

Data fetched from backend, managed with hooks:

```typescript
function useImageList() {
  const [images, setImages] = useState<Image[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchImages = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await apiClient.getImages()
      setImages(data)
    } catch (err) {
      setError(err as Error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { images, isLoading, error, fetchImages }
}
```

#### 3. **URL State** (Routing)

State persisted in URL for deep linking:

```typescript
// Pages should reflect URL state
const route = Route.createFileRoute('/editor/$imageId')

export function ImageEditorPage() {
  const { imageId } = Route.useParams()
  const { image } = useImage(imageId)

  return <ImageEditor image={image} />
}
```

### State Update Patterns

#### Reducer Pattern (Complex State)

```typescript
type ImageState = {
  image: File | null
  filter: 'smooth' | 'sharpen'
  intensity: number
  isProcessing: boolean
}

type ImageAction =
  | { type: 'SET_IMAGE'; payload: File }
  | { type: 'SET_FILTER'; payload: 'smooth' | 'sharpen' }
  | { type: 'SET_INTENSITY'; payload: number }
  | { type: 'SET_PROCESSING'; payload: boolean }

function imageReducer(state: ImageState, action: ImageAction): ImageState {
  switch (action.type) {
    case 'SET_IMAGE':
      return { ...state, image: action.payload }
    case 'SET_FILTER':
      return { ...state, filter: action.payload }
    case 'SET_INTENSITY':
      return { ...state, intensity: action.payload }
    case 'SET_PROCESSING':
      return { ...state, isProcessing: action.payload }
    default:
      return state
  }
}

// Usage
const [state, dispatch] = useReducer(imageReducer, initialState)
dispatch({ type: 'SET_FILTER', payload: 'sharpen' })
```

#### Immer Pattern (Simplified)

```typescript
import { useImmer } from 'use-immer'

function useImageState() {
  const [state, setState] = useImmer<ImageState>(initialState)

  const setFilter = (filter: string) => {
    setState(draft => {
      draft.filter = filter
    })
  }

  return { state, setFilter }
}
```

---

## API Communication

### Request/Response Flow

```typescript
// src/lib/api-client.ts

type RequestConfig = {
  timeout?: number
  retry?: number
  retryDelay?: number
}

class ApiClient {
  private baseURL: string
  private timeout: number = 30000

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  async request<T>(
    endpoint: string,
    options: RequestInit & RequestConfig = {}
  ): Promise<T> {
    const { timeout = this.timeout, retry = 3, retryDelay = 1000, ...fetchOptions } = options

    let lastError: Error | null = null

    for (let attempt = 0; attempt < retry; attempt++) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), timeout)

        const response = await fetch(`${this.baseURL}${endpoint}`, {
          ...fetchOptions,
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          throw new HttpError(response.status, response.statusText)
        }

        return await response.json() as T
      } catch (error) {
        lastError = error as Error

        if (attempt < retry - 1) {
          await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)))
        }
      }
    }

    throw lastError
  }

  async processImage(
    file: File,
    filter: 'smooth' | 'sharpen',
    intensity: number
  ): Promise<ProcessResult> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('intensity', intensity.toString())

    return this.request<ProcessResult>(`/api/process/${filter}`, {
      method: 'POST',
      body: formData,
      retry: 2,
    })
  }
}

export const apiClient = new ApiClient(import.meta.env.VITE_API_URL)
```

### Error Handling

```typescript
// src/lib/errors.ts

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public originalError?: Error
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}

// Usage in components
function useImageProcessing() {
  const [error, setError] = useState<ApiError | null>(null)

  const processImage = async (file: File, filter: string, intensity: number) => {
    try {
      return await apiClient.processImage(file, filter, intensity)
    } catch (err) {
      const apiError = err instanceof ApiError ? err : new ApiError(500, 'Unknown error', err as Error)
      setError(apiError)
      throw apiError
    }
  }

  return { processImage, error }
}
```

---

## Performance Considerations

### 1. Image Loading & Display

```typescript
// Optimize large images with lazy loading
const ImagePreview = ({ src }: { src: string }) => {
  return (
    <img
      src={src}
      alt="Processed preview"
      loading="lazy"
      decoding="async"
      style={{ aspectRatio: '16/9', objectFit: 'contain' }}
    />
  )
}
```

### 2. Render Optimization

```typescript
// Memoize expensive computations
const MemoizedImageGrid = memo(function ImageGrid({ images }: Props) {
  return (
    <div className="grid">
      {images.map(img => <ImageCard key={img.id} image={img} />)}
    </div>
  )
})

// Use useCallback for stable references
const handleProcess = useCallback(async () => {
  // Process logic
}, [dependencies])
```

### 3. Bundle Size

```typescript
// Dynamic imports for large features
const AdvancedEditor = lazy(() => import('./AdvancedEditor'))

// Route-based code splitting (automatic with TanStack Router)
```

### 4. Memory Management

```typescript
// Cleanup in useEffect
useEffect(() => {
  const controller = new AbortController()

  const fetchData = async () => {
    const response = await fetch(url, { signal: controller.signal })
    // ...
  }

  fetchData()

  return () => controller.abort() // Cleanup
}, [])
```

---

## Security

### 1. Input Validation

```typescript
// Validate file uploads
function validateImageFile(file: File): boolean {
  const MAX_SIZE = 10 * 1024 * 1024 // 10MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

  if (file.size > MAX_SIZE) {
    throw new Error('File size exceeds 10MB limit')
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Only JPEG, PNG, and WebP files are supported')
  }

  return true
}
```

### 2. XSS Prevention

```typescript
// Use textContent for text, not innerHTML
// Sanitize HTML if needed
import DOMPurify from 'dompurify'

const SafeHtml = ({ html }: { html: string }) => {
  return <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }} />
}
```

### 3. CSRF Protection

```typescript
// Include CSRF token in requests
const apiClient = {
  request: async (url: string, options: RequestInit = {}) => {
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')

    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'X-CSRF-Token': csrfToken,
      },
    })
  },
}
```

### 4. Content Security Policy

Add to your `public/index.html`:

```html
<meta
  http-equiv="Content-Security-Policy"
  content="
  default-src 'self';
  img-src 'self' data: https:;
  script-src 'self' 'wasm-unsafe-eval';
  style-src 'self' 'unsafe-inline';
  font-src 'self' data:;
"
/>
```

---

## Scalability Strategy

### Phase 1: Current State (MVP)

- Single page application
- Component-level state
- Direct API calls

### Phase 2: Growth (100+ users)

- Implement request caching
- Add error boundaries
- Server-side rendering ready

### Phase 3: Scale (1000+ users)

- Global state management (Zustand/Jotai)
- Request queue management
- Service Worker for offline support

### Phase 4: Enterprise

- Federated learning for image processing
- Microservices architecture
- Advanced caching strategies

### Future Enhancements

```typescript
// Service Worker for offline support
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
}

// Request deduplication
const requestCache = new Map<string, Promise<any>>()

async function cachedFetch(key: string, fetcher: () => Promise<any>) {
  if (requestCache.has(key)) {
    return requestCache.get(key)
  }

  const promise = fetcher()
  requestCache.set(key, promise)
  return promise
}
```

---

## References & Resources

- [React Best Practices](https://react.dev/learn)
- [TanStack Router Architecture](https://tanstack.com/router/latest)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Web Performance APIs](https://developer.mozilla.org/en-US/docs/Web/API/Performance)
- [OWASP Security Guidelines](https://owasp.org/)
