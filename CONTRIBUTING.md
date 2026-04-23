# Contributing Guide

Welcome to the Image Processing Web App! This guide will help you contribute effectively to our project.

## Getting Started

### 1. Fork & Clone

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/image-processing.git
cd image-processing/client

# Add upstream remote
git remote add upstream https://github.com/ORIGINAL_OWNER/image-processing.git
```

### 2. Create a Feature Branch

```bash
# Update main branch
git fetch upstream
git checkout main
git merge upstream/main

# Create feature branch
git checkout -b feature/add-blur-algorithm
```

### 3. Development Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# In another terminal, ensure backend is running
cd ../server
python -m pip install -r requirements.txt
python main.py
```

## Development Workflow

### Code Style

#### TypeScript/JavaScript

```typescript
// ✅ GOOD: Clear naming, proper typing
interface ProcessingOptions {
  filter: 'smooth' | 'sharpen'
  intensity: number
  algorithm?: 'gaussian' | 'median'
}

async function processImage(
  file: File,
  options: ProcessingOptions
): Promise<Blob> {
  // Implementation
}

// ❌ BAD: Unclear names, no typing
async function process(f: any, o: any) {
  // Implementation
}
```

#### React Component Style

```typescript
// ✅ GOOD: Organized, well-documented
/**
 * Renders an image processing control slider
 * @param value - Current intensity (0-100)
 * @param onChange - Callback when value changes
 * @param label - Display label for the slider
 */
export function IntensitySlider({
  value,
  onChange,
  label
}: IntensitySliderProps) {
  return (
    <div className="space-y-2">
      <label>{label}</label>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
      />
      <span>{value}%</span>
    </div>
  )
}

// ❌ BAD: Unclear structure
export function Slider({ v, o, l }: any) {
  return <input value={v} onChange={o} />
}
```

#### CSS/Tailwind

```typescript
// ✅ GOOD: Organized classes, semantic naming
<div className="space-y-4 p-6 bg-white rounded-lg shadow-sm">
  <h2 className="text-lg font-semibold text-gray-900">
    Processing Options
  </h2>
  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
    Process
  </button>
</div>

// ❌ BAD: Random order, hard to maintain
<div className="shadow-sm p-6 bg-white rounded-lg space-y-4">
  <h2 className="text-gray-900 font-semibold text-lg">
    Processing Options
  </h2>
  <button className="hover:bg-blue-700 transition-colors rounded-md text-white bg-blue-600 py-2 px-4">
    Process
  </button>
</div>
```

### Commit Messages

Follow conventional commits format:

```
type(scope): subject

body

footer
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`

**Examples**:

```bash
git commit -m "feat(editor): add gaussian blur algorithm"
git commit -m "fix(upload): handle large file validation"
git commit -m "docs(architecture): update state management section"
git commit -m "refactor(hooks): simplify useImageProcessing hook"
git commit -m "perf(canvas): optimize image rendering"
git commit -m "test(components): add ImageUpload test cases"
```

### Before Submitting a PR

```bash
# Format code
npm run format

# Run linter
npm run lint -- --fix

# Type checking
npm run typecheck

# Run tests
npm run test

# Build for production
npm run build
```

## Feature Development

### Adding a New Image Filter

#### 1. Create Hook (Business Logic)

```typescript
// src/hooks/useImageFilters.ts

interface FilterOptions {
  intensity: number
  algorithm?: string
}

export function useSmoothImage() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const apply = useCallback(async (
    file: File,
    options: FilterOptions
  ): Promise<Blob> => {
    setIsProcessing(true)
    setError(null)

    try {
      const result = await apiClient.processImage(
        file,
        'smooth',
        options.intensity
      )
      return result
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      setError(error)
      throw error
    } finally {
      setIsProcessing(false)
    }
  }, [])

  return { apply, isProcessing, error }
}
```

#### 2. Create Component

```typescript
// src/components/SmoothFilter.tsx

interface SmoothFilterProps {
  onApply: (result: Blob) => void
}

export function SmoothFilter({ onApply }: SmoothFilterProps) {
  const [intensity, setIntensity] = useState(50)
  const { apply, isProcessing, error } = useSmoothImage()

  const handleApply = async (file: File) => {
    const result = await apply(file, { intensity })
    onApply(result)
  }

  return (
    <div className="space-y-4">
      <IntensitySlider
        value={intensity}
        onChange={setIntensity}
        label="Blur Intensity"
      />
      {error && <Alert variant="error">{error.message}</Alert>}
      <Button
        onClick={() => handleApply(/* file */)}
        disabled={isProcessing}
        isLoading={isProcessing}
      >
        Apply Blur
      </Button>
    </div>
  )
}
```

#### 3. Add Tests

```typescript
// src/components/__tests__/SmoothFilter.test.ts

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SmoothFilter } from '../SmoothFilter'

describe('SmoothFilter', () => {
  it('should render intensity slider', () => {
    render(<SmoothFilter onApply={vi.fn()} />)
    expect(screen.getByLabelText('Blur Intensity')).toBeInTheDocument()
  })

  it('should update intensity on slider change', () => {
    render(<SmoothFilter onApply={vi.fn()} />)
    const slider = screen.getByRole('slider')
    fireEvent.change(slider, { target: { value: '75' } })
    expect(slider).toHaveValue('75')
  })

  it('should call onApply with result', async () => {
    const onApply = vi.fn()
    render(<SmoothFilter onApply={onApply} />)

    // Trigger processing...
    // await waitFor(() => expect(onApply).toHaveBeenCalled())
  })

  it('should show error message on failure', async () => {
    // Mock API error
    render(<SmoothFilter onApply={vi.fn()} />)
    // Test error handling
  })
})
```

#### 4. Integrate into Editor

```typescript
// src/routes/index.tsx

export function HomePage() {
  const [image, setImage] = useState<File | null>(null)
  const [result, setResult] = useState<Blob | null>(null)
  const [filterType, setFilterType] = useState<'smooth' | 'sharpen'>('smooth')

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <ImageUpload onImageSelected={setImage} />

      <div>
        {filterType === 'smooth' && (
          <SmoothFilter onApply={setResult} />
        )}
        {filterType === 'sharpen' && (
          <SharpenFilter onApply={setResult} />
        )}
      </div>

      {result && <ImagePreview src={URL.createObjectURL(result)} />}
    </div>
  )
}
```

## Pull Request Process

### 1. Create PR on GitHub

- Use descriptive title: `feat: add gaussian blur algorithm`
- Reference related issues: `Fixes #123`
- Fill in the PR template

### 2. PR Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues

Fixes #(issue)

## Testing Done

- [ ] Unit tests added
- [ ] Integration tested
- [ ] Tested in browser
- [ ] Tested responsiveness

## Checklist

- [ ] Code follows style guidelines
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests pass locally
```

### 3. Code Review

- Address all comments
- Push new commits (don't force push)
- Request re-review when done

### 4. Merge

- Squash commits if requested
- Delete branch after merge

## Testing Guidelines

### Unit Tests

```typescript
// Test individual functions/components in isolation
describe('processImage', () => {
  it('should return processed blob', async () => {
    const file = new File([''], 'test.jpg', { type: 'image/jpeg' })
    const result = await processImage(file, { filter: 'smooth', intensity: 50 })
    expect(result).toBeInstanceOf(Blob)
  })
})
```

### Integration Tests

```typescript
// Test components working together
describe('ImageEditor Integration', () => {
  it('should process image and display result', async () => {
    render(<ImageEditor />)
    const file = new File([''], 'test.jpg', { type: 'image/jpeg' })

    fireEvent.drop(screen.getByTestId('upload-area'), {
      dataTransfer: { files: [file] }
    })

    fireEvent.click(screen.getByText('Process'))
    await waitFor(() => {
      expect(screen.getByTestId('result-preview')).toBeInTheDocument()
    })
  })
})
```

### E2E Tests (Future)

```bash
npm install -D playwright

# Run E2E tests
npm run test:e2e
```

## Documentation

### JSDoc Format

````typescript
/**
 * Applies a blur effect to an image file
 *
 * @param file - Image file to process
 * @param intensity - Blur intensity from 0-100 (default: 50)
 * @param algorithm - Blur algorithm to use (default: 'gaussian')
 * @returns Promise resolving to processed image blob
 *
 * @example
 * ```typescript
 * const file = await fetch('image.jpg').then(r => r.blob())
 * const blurred = await applyBlur(file, 75)
 * ```
 *
 * @throws {Error} If file size exceeds 10MB
 * @throws {Error} If file type is not supported
 */
async function applyBlur(
  file: File,
  intensity: number = 50,
  algorithm: 'gaussian' | 'median' = 'gaussian'
): Promise<Blob>
````

### Updating Documentation

1. **README.md**: High-level overview and setup
2. **ARCHITECTURE.md**: Technical decisions and patterns
3. **Component comments**: Inline documentation
4. **Storybook** (future): Interactive component docs

## Performance Considerations

When contributing, consider:

- **Bundle size**: Keep dependencies minimal
- **Render performance**: Use React.memo, useCallback appropriately
- **Memory**: Clean up listeners, abort requests
- **Accessibility**: ARIA labels, keyboard navigation
- **Mobile**: Test on mobile devices

## Common Issues

### Build Fails with TypeScript Errors

```bash
npm run typecheck
# Fix reported errors
npm run lint -- --fix
```

### Hot Reload Not Working

```bash
# Restart dev server
npm run dev
```

### API Integration Issues

```bash
# Ensure backend is running
cd ../server
python main.py

# Check API URL in .env.local
cat .env.local
```

### Tests Fail

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run test
```

## Getting Help

- Check [Documentation](./README.md)
- Review [Architecture Guide](./ARCHITECTURE.md)
- Open an issue on GitHub
- Ask in discussions

## Code of Conduct

- Be respectful and inclusive
- Welcome all skill levels
- Focus on code, not people
- Constructive feedback only

---

**Happy Contributing!** 🎉
