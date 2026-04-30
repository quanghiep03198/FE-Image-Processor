import { CopyIcon, ImageDownIcon, Share2Icon } from 'lucide-react'
import { Button } from '../ui/button'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '../ui/input-group'
import { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from '../ui/popover'
import ThemeSelect from './theme-select'

const PlaygroundHeader = () => {
  return (
    <header className="flex items-center justify-between gap-x-1 p-4">
      <h1 className="text-lg font-semibold">Playground</h1>
      <nav className="flex items-center gap-x-1">
        <Button variant="secondary">
          <ImageDownIcon />
          Download image
        </Button>
        <Popover>
          <PopoverTrigger
            render={
              <Button variant="secondary">
                <Share2Icon /> Share
              </Button>
            }
          />
          <PopoverContent className="w-lg">
            <PopoverHeader>
              <PopoverTitle>Share your image</PopoverTitle>
              <PopoverDescription>Share your image with others by generating a unique link. You can also set an expiration time for the</PopoverDescription>
              <InputGroup>
                <InputGroupInput placeholder="https://example.com/your-image-link" readOnly />
                <InputGroupAddon>
                  <InputGroupButton>
                    <CopyIcon />
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </PopoverHeader>
          </PopoverContent>
        </Popover>
        <ThemeSelect />
      </nav>
    </header>
  )
}

export default PlaygroundHeader
