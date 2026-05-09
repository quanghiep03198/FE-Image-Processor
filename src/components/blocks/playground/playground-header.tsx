import Logo from '@/components/shared/logo'
import { ThemeSwitcher } from '@/components/shared/theme-switcher'
import { Link } from '@tanstack/react-router'
import UserControl from '../auth/user-control'

const PlaygroundHeader = () => {
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
          <li>
            <Link
              to="/my-images"
              className="px-2"
              activeProps={{ className: 'text-primary underline underline-offset-8' }}
            >
              My images
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
