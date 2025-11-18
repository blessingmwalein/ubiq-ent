'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { toast } from 'sonner'
import { Eye, EyeOff } from 'lucide-react'
import { loginSchema, type LoginFormData } from '@/lib/validations'
import { navigateAfterAuth } from '@/lib/auth-navigation'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { login } from '@/store/slices/authSlice'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { loading } = useAppSelector((state) => state.auth)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await dispatch(login(data)).unwrap()

      console.log('Login result:', result)
      
      if (result.message === 'Login successful' && result.data) {
        toast.success('Welcome back!', {
          description: `Signed in as ${result.data.user.name}`,
        })
        
        navigateAfterAuth(router, result.data, 'login')
      } else {
        toast.error('Login Failed', {
          description: 'Unexpected response from server. Please try again.',
        })
      }
    } catch (err: any) {
      console.error('Login failed:', err)
      toast.error('Login Failed', {
        description: err.message || 'Invalid email or password. Please try again.',
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 via-blue-900 to-black text-blue-100 flex flex-col">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 px-4 py-3 sm:px-6 sm:py-4 md:px-12 md:py-6">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="UBIQ Entertainment"
            width={160}
            height={45}
            className="h-7 sm:h-8 md:h-12 w-auto"
            priority
          />
        </Link>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-16 sm:py-20">
        {/* Login Form */}
        <div className="w-full max-w-[480px] relative z-10">
          <div className="bg-black/60 backdrop-blur-2xl rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-14 border border-blue-800/30 shadow-2xl">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6 sm:mb-10">
              Sign In
            </h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-blue-200 text-sm font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@example.com"
                  {...register('email')}
                  className="h-12 sm:h-14 text-base"
                />
                {errors.email && (
                  <p className="text-red-400 text-sm">{errors.email.message}</p>
                )}
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-blue-200 text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    {...register('password')}
                    className="h-12 sm:h-14 pr-12 text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white transition-colors p-2"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-400 text-sm">{errors.password.message}</p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 pt-1">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('remember')}
                    className="w-4 h-4 rounded border-blue-700 bg-blue-900/50 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
                  />
                  <span className="text-sm text-blue-200">Remember me</span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-blue-400 hover:text-blue-300 hover:underline transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 sm:h-14 text-base font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-900/50 transition-all"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>

              {/* Divider */}
              <div className="relative my-6 sm:my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-blue-800/50"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-black/60 text-blue-400">or</span>
                </div>
              </div>

              {/* Sign Up Link */}
              <div className="text-center">
                <p className="text-sm text-blue-200">
                  New to UBIQ?{' '}
                  <Link
                    href="/register"
                    className="text-blue-400 hover:text-blue-300 font-semibold hover:underline transition-colors"
                  >
                    Sign up now
                  </Link>
                </p>
              </div>
            </form>

            {/* Additional Info - Mobile Hidden */}
            <div className="hidden sm:block mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-blue-800/30">
              <p className="text-xs text-blue-400/70 leading-relaxed">
                This page is protected by reCAPTCHA and the Google{' '}
                <Link href="#" className="underline hover:text-blue-300">
                  Privacy Policy
                </Link>{' '}
                and{' '}
                <Link href="#" className="underline hover:text-blue-300">
                  Terms of Service
                </Link>{' '}
                apply.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 px-4 sm:px-6 py-4 sm:py-6 text-center text-xs text-blue-400/60">
        <p>&copy; 2024 UBIQ Entertainment. All rights reserved.</p>
      </footer>
    </div>
  )
}
