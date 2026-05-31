import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { format, subDays } from 'date-fns'
import { isNil, omit, omitBy } from 'lodash-es'
import { CalendarIcon, FileIcon, XIcon } from 'lucide-react'
import { Activity, useMemo, useState } from 'react'

const GalleryToolbar: React.FC = () => {
  const search = useSearch({
    from: '/_playground-layout/my-images',
    select: (state) => ({ mime_type: state.mime_type, from: state.from, to: state.to }),
  })
  const navigate = useNavigate({ from: '/my-images' })

  return (
    <div className="flex h-[calc(var(--gallery-toolbar-height)*1px)] items-center gap-x-2">
      <MimeTypeSelect />
      <CreateDateSelect />
      <Activity mode={Object.values(search).every(isNil) ? 'hidden' : 'visible'}>
        <Button
          variant="secondary"
          onClick={() => navigate({ search: (prev) => omit(prev, ['mime_type', 'from', 'to']) })}
        >
          <XIcon />
          Clear filters
        </Button>
      </Activity>
    </div>
  )
}

const imageFormatOptions: Array<{ label: string; value: ImageMimeType }> = [
  { label: '.png', value: 'image\/png' },
  { label: '.jpeg', value: 'image\/jpeg' },
  { label: '.jpg', value: 'image\/jpg' },
  { label: '.webp', value: 'image\/webp' },
  { label: '.svg', value: 'image\/svg+xml' },
  { label: '.bmp', value: 'image\/bmp' },
]

const MimeTypeSelect: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false)

  const mimeType = useSearch({
    from: '/_playground-layout/my-images',
    select: (state) => state.mime_type,
  })
  const navigate = useNavigate({ from: '/my-images' })

  return (
    <Select
      open={open}
      onOpenChange={setOpen}
      items={imageFormatOptions}
      value={mimeType ?? ''}
      onValueChange={(value) =>
        navigate({
          search: (old) => ({ ...old, mime_type: value! }),
        })
      }
    >
      <SelectTrigger
        onClick={(e) => e.preventDefault()}
        render={
          <Button variant="outline">
            <span className="inline-flex items-center gap-x-2" onClick={() => setOpen(!open)}>
              <FileIcon />
              {imageFormatOptions.find((format) => format?.value === mimeType)?.label ?? 'All formats'}
            </span>
          </Button>
        }
      />
      <SelectContent>
        {imageFormatOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            <span className="flex items-center gap-x-2">
              <FileIcon />
              {option.label}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

const CreateDateSelect: React.FC = () => {
  const navigate = useNavigate()
  const date = useSearch({
    from: '/_playground-layout/my-images',
    select: (state) => ({ from: state.from, to: state.to }),
  })

  const presetOptions = useMemo(() => {
    return [
      { label: 'Today', value: '0', from: format(new Date(), 'yyyy-MM-dd') },
      { label: 'In 7 days', value: '7', from: format(subDays(new Date(), 7), 'yyyy-MM-dd'), to: new Date() },
      { label: 'In 30 days', value: '30', from: format(subDays(new Date(), 30), 'yyyy-MM-dd'), to: new Date() },
    ]
  }, [])

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant="outline" id="date-picker-range" className="justify-start px-2.5 font-normal">
            <CalendarIcon />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'LLL dd, y')} - {format(date.to, 'LLL dd, y')}
                </>
              ) : (
                format(new Date(date.from), 'LLL dd, y')
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        }
      />
      <PopoverContent className="flex w-auto flex-col items-stretch space-y-2 p-2" align="start">
        <Select
          items={presetOptions}
          onValueChange={(value) => {
            if (!value) return
            let from: string | undefined
            let to: string | undefined
            switch ((value as { label: string; value: string; from: string; to?: string }).value) {
              case '0':
                from = format(new Date(), 'yyyy-MM-dd')
                to = undefined
                break
              case '7':
                from = format(subDays(new Date(), 7), 'yyyy-MM-dd')
                to = format(new Date(), 'yyyy-MM-dd')
                break
              case '30':
                from = format(subDays(new Date(), 30), 'yyyy-MM-dd')
                to = format(new Date(), 'yyyy-MM-dd')
                break
            }
            navigate({
              from: '/my-images',
              to: '/my-images',
              search: (old) => omitBy({ ...old, from, to }, isNil),
            })
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose a date range" />
          </SelectTrigger>
          <SelectContent>
            {presetOptions.map((option) => (
              <SelectItem key={option.value} value={option}>
                <span className="flex items-center gap-x-2">
                  <CalendarIcon />
                  {option.label}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Calendar
          className="p-0"
          mode="range"
          defaultMonth={date?.from ? new Date(date.from) : undefined}
          selected={{
            from: date?.from ? new Date(date.from) : undefined,
            to: date?.to ? new Date(date.to) : undefined,
          }}
          onSelect={(date) =>
            navigate({
              from: '/my-images',
              to: '/my-images',
              search: (old) => ({
                ...old,
                from: date?.from ? format(date.from, 'yyyy-MM-dd') : undefined,
                to: date?.to ? format(date.to, 'yyyy-MM-dd') : undefined,
              }),
            })
          }
          numberOfMonths={1}
        />
      </PopoverContent>
    </Popover>
  )
}

export default GalleryToolbar
