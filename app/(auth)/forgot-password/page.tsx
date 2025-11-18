'use client'

import { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import Link from 'next/link'
import Image from 'next/image'
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/lib/validations'
import { authService } from '@/services/authService'
import { Button } from '@/components/ui/button'
import { FormInput } from '@/components/ui/form-fields'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const methods = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setLoading(true)
      setError(null)
      
      await authService.forgotPassword(data.email)
      setSuccess(true)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send reset link')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-black to-zinc-900 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src="/logo.png"
            alt="UBIQ Entertainment"
            width={150}
            height={50}
            className="h-12 w-auto"
          />
        </div>

        <Card className="border-zinc-800 bg-black/50 backdrop-blur-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Forgot Password?</CardTitle>
            <CardDescription className="text-center">
              {success
                ? "We've sent you a reset link"
                : "Enter your email to receive a password reset link"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {success ? (
              <div className="space-y-4">
                <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded-md text-sm">
                  <p className="font-medium">Check your email!</p>
                  <p className="mt-1">
                    We've sent password reset instructions to your email address.
                  </p>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Didn't receive the email? Check your spam folder or{' '}
                  <button
                    onClick={() => {
                      setSuccess(false)
                      methods.reset()
                    }}
                    className="text-primary hover:underline"
                  >
                    try again
                  </button>
                </p>
              </div>
            ) : (
              <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
                  {error && (
                    <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md text-sm">
                      {error}
                    </div>
                  )}

                  <FormInput
                    name="email"
                    label="Email Address"
                    type="email"
                    placeholder="you@example.com"
                    required
                    disabled={loading}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-african-orange hover:bg-african-orange/90"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      'Send Reset Link'
                    )}
                  </Button>
                </form>
              </FormProvider>
            )}
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-muted-foreground">
              <Link href="/login" className="text-primary hover:underline font-medium">
                ← Back to Sign In
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
