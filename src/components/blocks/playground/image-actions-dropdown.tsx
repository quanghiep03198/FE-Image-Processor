import type { IImage } from '@/apis/images/types'
import { buttonVariants } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import type { CellContext } from '@tanstack/react-table'
import { EllipsisVerticalIcon } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'
import { usePubSub } from './gallery'

const ImageActionsDropdown: React.FC<CellContext<IImage, any>> = ({ row }) => {
  const { publish } = usePubSub()

  const handleDownload = async () => {
    try {
      const params = new URLSearchParams({
        imgDest: row.original.url,
        name: row.original.name,
      })
      const url = `/api/images/download?${params.toString()}`
      const a = document.createElement('a')
      a.href = url
      a.download = row.original.name
      document.body.appendChild(a)
      a.click()
      a.remove()
      toast.success('Download file successfully')
    } catch (error) {
      console.error('Download failed', error)
      toast.error('Download file failed')
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={buttonVariants({ variant: 'ghost', size: 'icon-sm' })}>
        <EllipsisVerticalIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="left" align="start">
        <DropdownMenuItem onClick={handleDownload}>Download</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => publish('image:update', { id: row.original.id, name: row.original.name })}>
          Update
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => publish('image:delete', row.original.id)}>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ImageActionsDropdown
