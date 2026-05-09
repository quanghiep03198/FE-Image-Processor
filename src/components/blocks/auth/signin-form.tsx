import { signInRPC } from '@/apis/auth/rpc'
import { signInSchema, type TSignInValues } from '@/apis/auth/schemas/signin.schema'
import InputFieldControl from '@/components/forms/input-field-control'
import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldGroup, FieldLegend, FieldSet } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import { Typography } from '@/components/ui/typography'
import { useForm } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { Link, redirect, useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { LogInIcon } from 'lucide-react'
import React from 'react'

const SignInForm: React.FC = () => {
  const signInFn = useServerFn(signInRPC)
  const router = useRouter()

  const { mutateAsync: signIn, isPending } = useMutation({
    mutationFn: (data: TSignInValues) => signInFn({ data }),
    onSuccess: () => {
      router.invalidate().finally(() => router.navigate({ to: '/' }))
    },
  })

  const form = useForm({
    defaultValues: { email: '', password: '' },
    onSubmit: async ({ value }) => {
      await signIn(value)
      redirect({ to: '/' })
    },
    validators: {
      onSubmit: signInSchema,
    },
  })

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    form.handleSubmit()
  }

  return (
    <form className="w-full" onSubmit={handleSubmit}>
      <FieldSet>
        <FieldLegend className="text-2xl!">Welcome back</FieldLegend>
        <FieldDescription>Sign in to your account ot continue your journey with us.</FieldDescription>
        <FieldGroup>
          <form.Field name="email">
            {(field) => <InputFieldControl field={field} label="Email" type="email" placeholder="Enter your email" />}
          </form.Field>
          <form.Field name="password">
            {(field) => <InputFieldControl field={field} label="Password" type="password" placeholder="******" />}
          </form.Field>
        </FieldGroup>
        <FieldGroup>
          <Field orientation="horizontal">
            <Button className="w-full" type="submit" size="lg" disabled={isPending}>
              {isPending ? <Spinner /> : <LogInIcon />}
              {isPending ? 'Signing in...' : 'Sign In'}
            </Button>
          </Field>
          <div className="flex justify-between text-sm">
            <Typography variant="small" as="p">
              Don't have an account?{' '}
              <Link to="/signup" className="underline-offset-2 hover:underline">
                Sign Up
              </Link>
            </Typography>
            <Link to="/forgot-password" className="underline-offset-2 hover:underline">
              Forgot password?
            </Link>
          </div>
        </FieldGroup>
      </FieldSet>
    </form>
  )
}

export default SignInForm
