import type { IImage } from '@/apis/images/types'
import { createPubSubContext } from '@/contexts/pubsub-context'
import GalleryTable from './gallery-table'
import GalleryToolbar from './gallery-toolbar'
import ImageDeletionAlert from './image-deletion-alert'
import UpdateImageFormDialog from './update-image-form-dialog'

type GlobalPubSubEventMap = {
  'image:delete': string
  'image:update': Pick<IImage, 'id' | 'name'>
}

export const { PubSubProvider, usePubSub, usePubSubSubscription } =
  createPubSubContext<GlobalPubSubEventMap>('GalleryPubSubContext')

const Gallery: React.FC = () => {
  return (
    <PubSubProvider>
      <div className="space-y-6 [--gallery-toolbar-height:80px]">
        <GalleryToolbar />
        <GalleryTable />
      </div>
      <ImageDeletionAlert />
      <UpdateImageFormDialog />
    </PubSubProvider>
  )
}

export default Gallery
