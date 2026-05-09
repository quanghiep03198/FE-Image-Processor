import { useGetProfileQuery, useSignOutMutation } from '@/apis/auth/hooks'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { buttonVariants } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item'
import generateAvatar from '@/lib/avatar'
import { useHotkey } from '@tanstack/react-hotkeys'
import { Link } from '@tanstack/react-router'
import { ChevronsUpDown, LogInIcon, LogOutIcon } from 'lucide-react'

const UserControl = () => {
  const { data: user } = useGetProfileQuery()
  const { mutateAsync: signOut } = useSignOutMutation()

  useHotkey('Mod+Q', () => {
    signOut()
  })

  if (!user)
    return (
      <Link to="/signin" className={buttonVariants()}>
        <LogInIcon />
        Sign in
      </Link>
    )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        role="button"
        nativeButton={false}
        render={
          <Item size="xs" className="py-0">
            <ItemMedia>
              <Avatar>
                <AvatarImage src={generateAvatar({ name: user.display_name })} />
                <AvatarFallback>{user?.display_name?.charAt(0)}</AvatarFallback>
              </Avatar>
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{user.display_name}</ItemTitle>
            </ItemContent>
            <ItemActions>
              <ChevronsUpDown size={14} />
            </ItemActions>
          </Item>
        }
      />
      <DropdownMenuContent className="w-fit">
        <DropdownMenuItem className="pointer-events-none">
          <Item className="py-0" size="xs">
            <ItemMedia>
              <Avatar>
                <AvatarImage src={generateAvatar({ name: user.display_name })} />
                <AvatarFallback>{user.display_name}</AvatarFallback>
              </Avatar>
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{user.display_name}</ItemTitle>
              <ItemDescription>{user.email}</ItemDescription>
            </ItemContent>
          </Item>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOutIcon /> Sign out
          <DropdownMenuShortcut>Ctrl+Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserControl
