import type { AnyFieldApi } from '@tanstack/react-form'
import { useEffect, useState } from 'react'
import { Badge } from '../ui/badge'
import { Field, FieldError, FieldLabel } from '../ui/field'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card'
import { Slider } from '../ui/slider'

type SliderFieldControlProps = {
  field: AnyFieldApi
  label: string
  description?: string
} & React.ComponentProps<typeof Slider>

export default function SliderFieldControl({
  field,
  label,
  description,
  min = 0,
  max = 1,
  step = 0.1,
}: SliderFieldControlProps) {
  const [value, setValue] = useState(field.state.value ?? 0)

  useEffect(() => {
    setValue(field.state.value ?? 0)
  }, [field.state.value])

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
  return (
    <HoverCard>
      <HoverCardTrigger
        render={
          <Field>
            <FieldLabel htmlFor={field.name} className="flex justify-between">
              {label}
              <Badge variant="outline" render={<small>{field.state.value ?? 0}</small>}></Badge>
            </FieldLabel>
            <Slider
              defaultValue={[0]}
              min={min}
              max={max}
              step={step}
              value={[value]}
              onValueChange={setValue}
              onValueCommitted={(value) => {
                console.log(field.name, value)
                field.handleChange(value)
              }}
              className="max-w-auto"
            />
            {isInvalid && <FieldError errors={field.state.meta.errors} />}
          </Field>
        }
      />
      <HoverCardContent>{description}</HoverCardContent>
    </HoverCard>
  )
}
