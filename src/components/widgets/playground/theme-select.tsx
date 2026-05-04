import { useTheme, type UserTheme } from '@/providers/theme-provider'
import { Icon, type IconProps } from '../../ui/icon'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select'

const themeConfig: Array<{ icon: IconProps['name']; label: string; value: UserTheme }> = [
  { icon: 'Sun', label: 'Light', value: 'light' },
  { icon: 'Moon', label: 'Dark', value: 'dark' },
  { icon: 'Computer', label: 'System', value: 'system' },
]
const ThemeSelect = () => {
  const { userTheme, setTheme } = useTheme()

  return (
    <Select items={themeConfig} value={userTheme} onValueChange={(value) => setTheme(value as UserTheme)}>
      <SelectTrigger className="w-28">
        <SelectValue placeholder="System" />
      </SelectTrigger>
      <SelectContent>
        {themeConfig.map((theme) => (
          <SelectItem key={theme.value} value={theme.value}>
            <div className="flex items-center gap-2">
              <Icon name={theme.icon} />
              {theme.label}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default ThemeSelect
