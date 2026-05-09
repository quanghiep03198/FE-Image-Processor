import { useUpdateImageMutation } from '@/apis/images/hooks'
import { updateImageSchema } from '@/apis/images/schemas'
import InputFieldControl from '@/components/forms/input-field-control'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent } from '@/components/ui/dialog'
import { Field, FieldDescription, FieldGroup, FieldLegend, FieldSet } from '@/components/ui/field'
import { useForm, useStore } from '@tanstack/react-form'
import React from 'react'
import { toast } from 'sonner'
import { usePubSubSubscription } from './gallery'

const UpdateImageFormDialog: React.FC = () => {
  const { mutateAsync: updateAsync, isPending } = useUpdateImageMutation()

  const form = useForm({
    defaultValues: { id: '', name: '' },
    onSubmit: async ({ value, formApi }) => {
      try {
        await updateAsync({ id: value.id, name: value.name })
        formApi.reset()
        toast.success('Image updated successfully')
      } catch (error) {
        toast.error((error as Error).message)
      }
    },
    validators: { onSubmit: updateImageSchema },
  })

  usePubSubSubscription('image:update', (data) => form.reset(data, { keepDefaultValues: true }))

  const currentImageId = useStore(form.store, (state) => state.values.id)

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    form.handleSubmit()
  }

  return (
    <Dialog
      open={!!currentImageId || isPending}
      onOpenChange={(open) => {
        if (!open) form.reset()
      }}
    >
      <DialogContent className="max-w-3xl">
        <form onSubmit={handleSubmit}>
          <FieldSet>
            <FieldLegend>Update Image</FieldLegend>
            <FieldDescription>
              Update the name of your image, help you organize your images better. Note that this will not change the
              URL of the image.
            </FieldDescription>
            <FieldGroup>
              <form.Field name="name">
                {(field) => (
                  <InputFieldControl
                    field={field}
                    label="Image Name"
                    placeholder="Enter new image name"
                    description="The name should be unique and can only contain letters, numbers, hyphens, and underscores."
                  />
                )}
              </form.Field>
              <Field orientation="horizontal" className="justify-end">
                <DialogClose render={<Button variant="secondary">Cancel</Button>} />
                <Button type="submit" disabled={isPending}>
                  Save changes
                </Button>
              </Field>
            </FieldGroup>
          </FieldSet>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default UpdateImageFormDialog
