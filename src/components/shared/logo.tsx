import { cn } from '@/lib/utils'

const Logo: React.FC<React.ComponentProps<'code'>> = ({ className, ...props }) => {
  return (
    <code
      className={cn(
        'relative inline-flex animate-shimmer gap-x-2 bg-[linear-gradient(75deg,var(--foreground),45%,var(--muted-foreground),50%,var(--foreground))] bg-size-[200%_100%] bg-clip-text text-2xl leading-normal font-medium tracking-tight text-transparent dark:bg-[linear-gradient(75deg,var(--muted-foreground),45%,var(--foreground),50%,var(--muted-foreground))]',
        className,
      )}
      {...props}
    >
      Pixium
    </code>
  )
}

export default Logo
