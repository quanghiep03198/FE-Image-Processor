import { useDeleteImageMutation } from '@/apis/images/hooks'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useState } from 'react'
import { toast } from 'sonner'
import { usePubSubSubscription } from './gallery'

const ImageDeletionAlert: React.FC = () => {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const { mutateAsync: deleteAsync, isPending: isDeleting } = useDeleteImageMutation()

  usePubSubSubscription('image:delete', (imageId) => {
    setDeletingId(imageId)
  })

  const handleDeleteImage = async () => {
    try {
      if (!deletingId) return
      await deleteAsync(deletingId!)
      toast.success('Image deleted successfully')
      setDeletingId(null)
    } catch (error) {
      toast.error('Failed to delete image')
    }
  }

  return (
    <AlertDialog
      open={deletingId !== null || isDeleting}
      onOpenChange={(open) => {
        if (!open) {
          setDeletingId(null)
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your account from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setDeletingId(null)}>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={isDeleting} onClick={handleDeleteImage}>
            {isDeleting ? 'Deleting ...' : 'Continue'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default ImageDeletionAlert
