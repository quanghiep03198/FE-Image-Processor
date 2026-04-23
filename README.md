# Image Processing Web App - Frontend

A modern, high-performance web application for image processing with features including image smoothing (blur) and image sharpening. Built with React 19, TypeScript, and Vite for a seamless user experience.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Development](#development)
- [Build & Deployment](#build--deployment)
- [Architecture](#architecture)
- [API Integration](#api-integration)
- [Performance Optimization](#performance-optimization)
- [Testing](#testing)
- [Code Quality](#code-quality)
- [Contributing](#contributing)

## ✨ Features

### Image Processing Capabilities

- **Image Smoothing (Blur)**: Apply various blur effects to reduce image noise and create smooth transitions
- **Image Sharpening**: Enhance image details and edges for improved clarity and definition
- **Real-time Preview**: Instant visual feedback for applied effects
- **Batch Processing**: Process multiple images efficiently
- **Adjustable Parameters**: Fine-tune blur intensity and sharpening strength

### User Interface

- Modern, intuitive interface with responsive design
- Drag-and-drop image upload
- Before/after comparison view
- Export processed images in multiple formats
- Dark mode support

## 🛠 Tech Stack

### Frontend Framework & Routing

- **React 19**: Latest React version for optimal performance and features
- **TanStack Router**: Type-safe, file-based routing system
- **TypeScript**: Strong type safety and better developer experience

### Styling & UI Components

- **Tailwind CSS v4**: Utility-first CSS framework with Vite integration
- **shadcn/ui**: High-quality, accessible component library
- **Lucide React**: Beautiful, consistent icon library
- **class-variance-authority**: Type-safe CSS class management

### Build & Development Tools

- **Vite**: Lightning-fast build tool and dev server
- **Nitro**: Server-side rendering and backend framework
- **React Router DevTools**: Advanced routing debugging

### Code Quality & Testing

- **ESLint**: Static code analysis with TanStack config
- **Prettier**: Code formatting consistency
- **TypeScript**: Strict mode for compile-time type checking
- **Vitest**: Fast unit testing framework

### State Management & Data Handling

- **TanStack React DevTools**: Component debugging
- **Recharts**: Chart visualization library
- **Date-fns**: Date/time utilities
- **Sonner**: Toast notifications

### Accessibility

- **ARIA**: Full accessibility support
- **Keyboard navigation**: Complete keyboard accessibility
- **Screen reader compatible**: WCAG 2.1 compliant components

## 📁 Project Structure

```
client/
├── src/
│   ├── components/
│   │   └── ui/                    # shadcn/ui component library
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       ├── dialog.tsx
│   │       ├── slider.tsx
│   │       ├── upload.tsx
│   │       └── ...
│   ├── hooks/
│   │   └── use-mobile.ts          # Mobile detection hook
│   ├── lib/
│   │   └── utils.ts               # Utility functions and classname merging
│   ├── routes/
│   │   ├── __root.tsx             # Root layout component
│   │   └── index.tsx              # Home page
│   ├── router.tsx                 # Router configuration
│   ├── routeTree.gen.ts           # Auto-generated route tree
│   └── styles.css                 # Global styles
├── public/
│   ├── manifest.json              # PWA manifest
│   └── robots.txt
├── vite.config.ts                 # Vite configuration
├── tsconfig.json                  # TypeScript configuration
├── eslint.config.js               # ESLint rules
├── components.json                # shadcn/ui configuration
└── package.json
```

## 📦 Prerequisites

- **Node.js**: v18.0 or higher
- **npm**: v9.0 or higher (or yarn/pnpm)
- **Python 3.10+**: For the backend API (image processing)

## 🚀 Getting Started

### 1. Installation

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install
```

### 2. Environment Configuration

Create a `.env.local` file in the `client` directory:

```env
# API Configuration
VITE_API_URL=http://localhost:8000

# Feature Flags
VITE_ENABLE_BATCH_PROCESSING=true
VITE_ENABLE_ADVANCED_FILTERS=true

# Analytics (Optional)
VITE_ANALYTICS_ID=
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 4. Backend Setup

Ensure the backend API is running:

```bash
cd ../server
pip install -r requirements.txt
python main.py
```

Backend will run on `http://localhost:8000`

## 💻 Development

### Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run unit tests
npm run test

# Run linter
npm run lint

# Format code
npm run format

# Type checking without emitting
npm run typecheck
```

### Development Workflow

1. **Branch Strategy**

   ```bash
   git checkout -b feature/image-smoothing
   ```

2. **Component Development**
   - Create components in `src/components/`
   - Use TypeScript interfaces for props
   - Follow shadcn/ui patterns

3. **Hot Reload**
   - Vite provides instant HMR (Hot Module Replacement)
   - Changes reflect immediately in the browser

4. **Type Safety**
   - Always maintain strict TypeScript mode
   - Use generics for reusable components
   - Document component props with JSDoc

### Key Development Patterns

#### Image Upload Component

```typescript
// src/components/ImageUpload.tsx
import { useCallback } from 'react'

interface ImageUploadProps {
  onImageSelected: (file: File) => void
  maxSize?: number // in MB
}

export function ImageUpload({ onImageSelected, maxSize = 10 }: ImageUploadProps) {
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    // Validation logic
    onImageSelected(file)
  }, [onImageSelected])

  return (
    // Component JSX
  )
}
```

#### Image Processing Hook

```typescript
// src/hooks/useImageProcessing.ts
export function useImageProcessing() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)

  const processImage = useCallback(async (
    file: File,
    filter: 'smooth' | 'sharpen',
    intensity: number
  ) => {
    setIsProcessing(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/process`, {
        method: 'POST',
        body: formData,
      })
      // Process response
    } finally {
      setIsProcessing(false)
    }
  }, [])

  return { processImage, isProcessing, progress }
}
```

## 🏗 Architecture

### Component Hierarchy

```
RootLayout (__root.tsx)
├── Navigation
├── Main Content
│   ├── ImageUpload
│   ├── ImageCanvas (Preview)
│   ├── Controls Panel
│   │   ├── BlurControls (Slider)
│   │   ├── SharpenControls (Slider)
│   │   └── ActionButtons
│   └── ComparisonView
└── DevTools
```

### State Management Strategy

**Local State**: Component-level state for UI interactions

```typescript
const [intensity, setIntensity] = useState(50)
const [filter, setFilter] = useState<'smooth' | 'sharpen'>('smooth')
```

**URL State**: Persistent routing

```typescript
const navigate = useNavigate()
const { imageId } = useLoaderData()
```

**Server State**: Backend responses (consider adding TanStack Query for advanced needs)

### Data Flow

```
User Input
    ↓
Component Handler
    ↓
API Call to Backend
    ↓
Processing Queue
    ↓
Stream Progress
    ↓
Update UI with Result
```

## 🔌 API Integration

### Image Processing Endpoints

#### Smooth (Blur)

```bash
POST /api/process/smooth
Content-Type: multipart/form-data

Body:
- file: File
- intensity: 0-100 (default: 50)
- algorithm: "gaussian" | "median" (default: "gaussian")

Response:
{
  "id": "uuid",
  "status": "processing" | "completed" | "failed",
  "progress": 75,
  "resultUrl": "/results/xyz.jpg",
  "processingTime": 1234 // ms
}
```

#### Sharpen

```bash
POST /api/process/sharpen
Content-Type: multipart/form-data

Body:
- file: File
- intensity: 0-100 (default: 50)
- kernel: "unsharp_mask" | "sobel" (default: "unsharp_mask")

Response:
{
  "id": "uuid",
  "status": "processing" | "completed" | "failed",
  "progress": 75,
  "resultUrl": "/results/xyz.jpg",
  "processingTime": 1234 // ms
}
```

### API Client Setup

```typescript
// src/lib/api-client.ts
const API_URL = import.meta.env.VITE_API_URL

export const apiClient = {
  processImage: async (file: File, filter: 'smooth' | 'sharpen', intensity: number) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('intensity', intensity.toString())

    const response = await fetch(`${API_URL}/process/${filter}`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Image processing failed')
    }

    return response.json()
  },
}
```

## ⚡ Performance Optimization

### 1. Code Splitting

- TanStack Router automatically splits code by route
- Dynamic imports for heavy components

```typescript
// Lazy load heavy components
const ImageEditor = lazy(() => import('./ImageEditor'))
```

### 2. Image Optimization

- Use WebP format with fallback to JPEG
- Implement responsive images with srcset
- Lazy load images below the fold

```typescript
<img
  src="image.webp"
  alt="Processed result"
  loading="lazy"
  srcSet="image-sm.webp 480w, image-lg.webp 1200w"
/>
```

### 3. Bundle Analysis

```bash
npm run build -- --analyze
```

### 4. Lighthouse Optimization

- Minified production build
- CSS-in-JS optimizations with Tailwind
- Cached API responses

### 5. Virtual Scrolling

For large image galleries, implement virtual scrolling:

```typescript
import { useVirtualizer } from '@tanstack/react-virtual'
```

## 🧪 Testing

### Unit Tests Structure

```typescript
// src/components/__tests__/ImageUpload.test.ts
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ImageUpload } from '../ImageUpload'

describe('ImageUpload', () => {
  it('should handle file drop', () => {
    // Test implementation
  })

  it('should validate file size', () => {
    // Test implementation
  })
})
```

### Running Tests

```bash
npm run test
npm run test -- --ui        # UI mode
npm run test -- --coverage  # Coverage report
```

### Testing Best Practices

- Test user behavior, not implementation
- Use data-testid for reliable selectors
- Mock API calls with MSW (Mock Service Worker)
- Test accessibility with @testing-library/jest-dom

## 📊 Code Quality

### TypeScript

- Strict mode enabled (`"strict": true`)
- No unused variables
- No unchecked side effects

### ESLint

```bash
npm run lint
npm run lint -- --fix
```

Rules configuration:

- TanStack ESLint config for React best practices
- Next.js linting rules
- TypeScript-specific rules

### Code Formatting

```bash
npm run format
```

- Prettier with 2-space indent
- Single quotes for strings
- Semicolons required

### Pre-commit Hooks (Recommended)

```bash
npm install -D husky lint-staged
npx husky install
```

## 🚢 Build & Deployment

### Production Build

```bash
npm run build
```

Outputs to `dist/` directory:

- Minified bundles
- Source maps (for debugging)
- Optimized assets

### Environment-Specific Variables

```env
# .env.production
VITE_API_URL=https://api.production.com
VITE_ENABLE_ADVANCED_FILTERS=true
```

### Deployment Options

#### Vercel (Recommended)

```bash
npm install -D vercel
vercel
```

#### Netlify

```bash
npm install -D netlify-cli
netlify deploy
```

#### Docker

```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

### Performance Checklist

- [ ] Bundle size < 500KB (gzipped)
- [ ] Lighthouse score > 90
- [ ] Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1
- [ ] All images optimized
- [ ] Code splitting implemented
- [ ] Caching headers configured

## 🤝 Contributing

### Code Review Checklist

- [ ] TypeScript types are correct
- [ ] No console errors or warnings
- [ ] Components are reusable
- [ ] Props are documented
- [ ] Tests added/updated
- [ ] Accessibility requirements met
- [ ] Performance implications considered

### Pull Request Process

1. Create feature branch from `develop`
2. Implement changes with tests
3. Run `npm run format` and `npm run lint -- --fix`
4. Submit PR with description
5. Address code review feedback
6. Merge after approval

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [TanStack Router Docs](https://tanstack.com/router)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui Components](https://ui.shadcn.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev)

## 📝 License

This project is licensed under the MIT License.

---

**Last Updated**: April 2026  
**Maintained By**: Frontend Team  
**Status**: Active Development
