import { cn } from '@/lib/utils'
import { useTheme, type UserTheme } from '@/providers/theme-provider'
import { useHydrated } from '@tanstack/react-router'
import { Monitor, Moon, Sun } from 'lucide-react'
import { useEffect, useRef } from 'react'

export type ThemeSwitcherProps = {
  value?: UserTheme
  onChange?: (theme: UserTheme) => void
  defaultValue?: UserTheme
  className?: string
}

const themes = [
  {
    key: 'system',
    icon: Monitor,
    label: 'System theme',
  },
  {
    key: 'light',
    icon: Sun,
    label: 'Light theme',
  },
  {
    key: 'dark',
    icon: Moon,
    label: 'Dark theme',
  },
]

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ className }) => {
  const activeRef = useRef<HTMLDivElement>(null)
  const firstButtonRef = useRef<HTMLButtonElement | null>(null)
  const { userTheme, setTheme } = useTheme()
  const hyderated = useHydrated()

  const currentTheme: UserTheme = hyderated ? userTheme : 'system'

  useEffect(() => {
    if (!activeRef.current || !firstButtonRef.current) return

    activeRef.current.style.transform = (() => {
      switch (currentTheme) {
        case 'system':
          return 'translateX(0px)'
        case 'light':
          return `translateX(${firstButtonRef.current.offsetWidth}px)`
        case 'dark':
          return `translateX(${firstButtonRef.current.offsetWidth * 2}px)`
        default:
          return 'translateX(0px)'
      }
    })()
  }, [currentTheme])

  //   const toggleTheme = () => setTheme(userTheme === 'dark' ? 'light' : 'system')

  const handleSelectTheme = (theme: UserTheme) => {
    setTheme(theme)
    requestAnimationFrame(() => {
      if (!activeRef.current || !firstButtonRef.current) return
      activeRef.current.style.transform = (() => {
        switch (theme) {
          case 'system':
            return `translateX(0px)`
          case 'light':
            return `translateX(${firstButtonRef.current.offsetWidth}px)`
          case 'dark':
            return `translateX(${firstButtonRef.current.offsetWidth * 2}px)`
          default:
            return `translateX(0px)`
        }
      })()
    })
  }

  return (
    <div
      className={cn(
        'relative isolate inline-grid h-8 min-w-fit grid-cols-3 rounded-full bg-background p-1 ring-1 ring-border',
        className,
      )}
    >
      <div className="absolute inset-x-1 top-1/2 z-[-1] w-full -translate-y-1/2">
        <div
          ref={activeRef}
          className="linear aspect-square size-6 rounded-full bg-neutral-500/25 transition-all duration-200"
        />
      </div>
      {themes.map(({ key, icon: Icon, label }) => {
        const isActive = currentTheme === key
        return (
          <button
            aria-label={label}
            ref={(e) => {
              if (key === 'system') firstButtonRef.current = e
            }}
            className="first relative h-6 w-6 rounded-full"
            key={key}
            onClick={() => handleSelectTheme(key as UserTheme)}
            type="button"
          >
            <Icon
              aria-current={isActive}
              className="relative z-10 m-auto size-4 stroke-muted-foreground aria-current:stroke-foreground"
            />
          </button>
        )
      })}
    </div>
  )
}
