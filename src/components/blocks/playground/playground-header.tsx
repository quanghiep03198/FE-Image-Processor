import { useGetProfileQuery } from '@/apis/auth/hooks'
import Logo from '@/components/shared/logo'
import { ThemeSwitcher } from '@/components/shared/theme-switcher'
import { Link } from '@tanstack/react-router'
import UserControl from '../auth/user-control'

const PlaygroundHeader = () => {
  const { data: user } = useGetProfileQuery()

  return (
    <header className="flex items-center justify-between gap-x-2 p-4">
      <nav className="flex items-center gap-x-10">
        <Logo className="text-2xl" />
        <ul className="flex items-center gap-x-2 text-sm font-medium text-muted-foreground">
          <li>
            <Link to="/" className="px-2" activeProps={{ className: 'text-primary underline underline-offset-8' }}>
              Editor
            </Link>
          </li>
          <li
            aria-disabled={!user}
            className="aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
          >
            <Link
              to="/my-images"
              className="px-2"
              activeProps={{ className: 'text-primary underline underline-offset-8' }}
            >
              {!user ? 'My images (Sign in required)' : 'My images'}
            </Link>
          </li>
        </ul>
      </nav>

      <nav className="flex items-center gap-x-2">
        <ThemeSwitcher />
        <UserControl />
      </nav>
    </header>
  )
}

export default PlaygroundHeader
