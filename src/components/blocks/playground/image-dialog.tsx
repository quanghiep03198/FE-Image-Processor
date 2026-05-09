import type { IImage } from '@/apis/images/types'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import env from '@/lib/utils'
import { ZoomInIcon, ZoomOutIcon } from 'lucide-react'
import React, { useState } from 'react'

const MIN_ZOOM = 0.5
const MAX_ZOOM = 2
const ZOOM_STEP = 0.25

const ImageDialog: React.FC<IImage> = ({ url, name }) => {
  const [open, setOpen] = useState(false)
  const [zoom, setZoom] = useState(1)

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(MAX_ZOOM, Number((prev + ZOOM_STEP).toFixed(2))))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(MIN_ZOOM, Number((prev - ZOOM_STEP).toFixed(2))))
  }

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen)
    if (!nextOpen) {
      setZoom(1)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger>{name}</DialogTrigger>
      <DialogContent className="scrollbar-none h-screen max-w-6xl overflow-auto p-0 sm:max-md:rounded-none md:h-[90vh]">
        <div className="scrollbar-none grid max-h-full place-items-center overflow-auto rounded-[inherit] bg-background">
          <img
            src={env('VITE_IMAGE_URL') + '/' + url}
            alt={url}
            className="h-max max-w-3/4 object-contain object-center transition-transform duration-150 ease-out select-none"
            style={{ transform: `scale(${zoom})` }}
          />
        </div>
        <ButtonGroup className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <Button variant="outline" onClick={handleZoomOut} disabled={zoom <= MIN_ZOOM}>
            <ZoomOutIcon />
          </Button>
          <Button variant="outline" onClick={() => setZoom(1)}>
            {Math.round(zoom * 100)}%
          </Button>
          <Button variant="outline" onClick={handleZoomIn} disabled={zoom >= MAX_ZOOM}>
            <ZoomInIcon />
          </Button>
        </ButtonGroup>
      </DialogContent>
    </Dialog>
  )
}

export default ImageDialog
