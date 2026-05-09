import { signInRPC, signUpRPC } from '@/apis/auth/rpc'
import { type TSignInValues } from '@/apis/auth/schemas/signin.schema'
import { signUpSchema, type TSignUpValues } from '@/apis/auth/schemas/signup.schema'
import InputFieldControl from '@/components/forms/input-field-control'
import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldGroup, FieldLegend, FieldSet } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import { Typography } from '@/components/ui/typography'
import { useForm } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { Link, redirect, useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import React from 'react'

const SignUpForm: React.FC = () => {
  const signUpFn = useServerFn(signUpRPC)
  const signInFn = useServerFn(signInRPC)
  const router = useRouter()

  const { mutateAsync: signUp, isPending: isSigningUp } = useMutation({
    mutationFn: (data: TSignUpValues) => signUpFn({ data }),
    onSuccess: () => {
      router.invalidate().finally(() => router.navigate({ to: '/' }))
    },
  })

  const { mutateAsync: signIn, isPending: isSigningIn } = useMutation({
    mutationFn: (data: TSignInValues) => signInFn({ data }),
    onSuccess: () => {
      router.invalidate().finally(() => router.navigate({ to: '/' }))
    },
  })

  const form = useForm({
    defaultValues: { email: '', password: '', display_name: '' },
    onSubmit: async ({ value }) => {
      const newUser = await signUp(value)
      if (newUser) {
        await signIn({ email: value.email, password: value.password })
        redirect({ to: '/' })
      }
    },
    validators: {
      onSubmit: signUpSchema,
    },
  })

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    form.handleSubmit()
  }

  const isPending = isSigningUp || isSigningIn

  return (
    <form className="w-full" onSubmit={handleSubmit}>
      <FieldSet>
        <FieldLegend className="text-2xl!">Join us today</FieldLegend>
        <FieldDescription>
          Create an account to start your journey with us. Enjoy seamless image processing and management at your
          fingertips.
        </FieldDescription>
        <FieldGroup>
          <form.Field name="email">
            {(field) => <InputFieldControl field={field} label="Email" type="email" placeholder="Enter your email" />}
          </form.Field>
          <form.Field name="display_name">
            {(field) => (
              <InputFieldControl field={field} label="Display Name" type="text" placeholder="Enter your display name" />
            )}
          </form.Field>
          <form.Field name="password">
            {(field) => <InputFieldControl field={field} label="Password" type="password" placeholder="******" />}
          </form.Field>
        </FieldGroup>
        <FieldGroup>
          <Typography variant="small" as="p">
            Already have an account?{' '}
            <Link to="/signin" className="underline-offset-2 hover:underline">
              Sign In
            </Link>
          </Typography>
          <Field orientation="horizontal">
            <Button className="w-full" type="submit" size="lg" disabled={isPending}>
              {isPending && <Spinner />}
              {isSigningUp ? 'Signing up...' : isSigningIn ? 'Signing you in...' : 'Sign Up'}
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  )
}

export default SignUpForm
