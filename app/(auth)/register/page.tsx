'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { toast } from 'sonner'
import { Eye, EyeOff } from 'lucide-react'
import { registerSchema, type RegisterFormData } from '@/lib/validations'
import { navigateAfterAuth } from '@/lib/auth-navigation'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { register as registerAction } from '@/store/slices/authSlice'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function RegisterPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { loading } = useAppSelector((state) => state.auth)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
    },
  })

  const password = watch('password')

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const result = await dispatch(registerAction(data)).unwrap()
      
      console.log('Registration result:', result)
      
      // API returns: { message: "Registration successful", data: { user, token, account? } }
      if ((result.message || result.data) && result.data) {
        toast.success('Account Created!', {
          description: `Welcome, ${result.data.user.name}! Let's get you started.`,
        })
        
        // Use navigation helper to determine redirect
        // New users typically need to complete onboarding first
        navigateAfterAuth(router, result.data, 'register')
      } else {
        // Unexpected response format
        toast.error('Registration Failed', {
          description: 'Unexpected response from server. Please try again.',
        })
      }
    } catch (err: any) {
      console.error('Registration failed:', err)
      toast.error('Registration Failed', {
        description: err.message || 'Unable to create account. Please try again.',
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 via-blue-900 to-black text-blue-100 flex flex-col">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 px-6 py-4 md:px-12 md:py-6">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="UBIQ Entertainment"
            width={160}
            height={45}
            className="h-8 md:h-12 w-auto"
            priority
          />
        </Link>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-20 relative">

        {/* Register Form */}
        <div className="w-full max-w-[480px] relative z-10">
          <div className="bg-black/60 backdrop-blur-2xl rounded-2xl p-10 md:p-14 border border-blue-800/30 shadow-2xl">
            <h1 className="text-4xl font-bold text-white mb-10">
              Create Account
            </h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Grouped Inputs */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-blue-200 text-sm font-medium">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    {...register('name')}
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && (
                    <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-blue-200 text-sm font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    {...register('email')}
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && (
                    <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-blue-200 text-sm font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a password"
                      {...register('password')}
                      className={errors.password ? 'border-red-500 pr-12' : 'pr-12'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password_confirmation" className="text-blue-200 text-sm font-medium">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password_confirmation"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      {...register('password_confirmation')}
                      className={errors.password_confirmation ? 'border-red-500 pr-12' : 'pr-12'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.password_confirmation && (
                    <p className="text-red-400 text-xs mt-1">{errors.password_confirmation.message}</p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full mt-6"
                size="lg"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            {/* Sign In Link */}
            <div className="mt-8 pt-6 border-t border-blue-900/30 text-center">
              <p className="text-blue-200 text-sm">
                Already have an account?{' '}
                <Link
                  href="/login"
                  className="text-blue-400 font-semibold hover:text-blue-300 hover:underline transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-6 text-center text-xs text-blue-400/60">
        <p>&copy; 2025 UBIQ Entertainment. All rights reserved.</p>
      </footer>
    </div>
  )
}
