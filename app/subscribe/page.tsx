'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'sonner'
import { Check, Loader2 } from 'lucide-react'
import { useAppSelector } from '@/store/hooks'
import { subscriptionService } from '@/services/subscriptionService'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/layout'
import { useResponsive } from '@/lib/hooks'

interface Plan {
  id: number
  name: string
  description: string
  price: number
  interval: 'monthly' | 'yearly' | 'lifetime'
  features: string[]
  max_profiles: number
  max_concurrent_streams: number
  video_quality: string
  download_enabled: boolean
  trial_days: number
  is_popular: boolean
  active: boolean
}

export default function SubscribePage() {
  const router = useRouter()
  const { isAuthenticated, user, account } = useAppSelector((state) => state.auth)
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null)
  const { isMobile, isTablet } = useResponsive()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    // Check if user already has an active account/subscription
    if (account && account.package_id && account.status === 'active') {
      router.push('/profiles')
      return
    }

    fetchPlans()
  }, [isAuthenticated, user, account, router])

  const fetchPlans = async () => {
    try {
      setLoading(true)
      const response = await subscriptionService.getPlans(true)
      
      if (response.success) {
        setPlans(response.data)
      }
    } catch (error: any) {
      console.error('Failed to fetch plans:', error)
      toast.error('Failed to Load Plans', {
        description: 'Unable to load subscription plans. Please try again.',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSelectPlan = async (planId: number) => {
    setSelectedPlan(planId)
    // Redirect to checkout with the selected plan
    router.push(`/checkout?plan=${planId}`)
  }

  const formatPrice = (price: number, interval: string) => {
    const formattedPrice = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price)

    if (interval === 'lifetime') {
      return `${formattedPrice} one-time`
    }
    return `${formattedPrice}/${interval === 'monthly' ? 'mo' : 'yr'}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-950 via-blue-900 to-black flex items-center justify-center">
        <Loader2 className={`${isMobile ? 'w-8 h-8' : 'w-12 h-12'} text-blue-400 animate-spin`} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 via-blue-900 to-black text-blue-100 pb-24 md:pb-0">
      {/* Header - Mobile Responsive */}
      <header className="absolute top-0 left-0 right-0 z-10 px-4 py-3 md:px-12 md:py-6">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="UBIQ Entertainment"
            width={isMobile ? 120 : 160}
            height={isMobile ? 34 : 45}
            className={`${isMobile ? 'h-7' : 'h-8 md:h-12'} w-auto`}
            priority
          />
        </Link>
      </header>

      {/* Main Content - Mobile Responsive */}
      <Container className={`${isMobile ? 'pt-20 pb-8' : 'pt-32 pb-20'} px-4`}>
        <div className="max-w-6xl mx-auto">
          {/* Header Section - Mobile Responsive */}
          <div className="text-center mb-8 md:mb-16">
            <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold text-white mb-2 md:mb-4">
              Choose Your Plan
            </h1>
            <p className="text-sm md:text-lg lg:text-xl text-blue-200 max-w-2xl mx-auto px-4">
              {isMobile ? 'Select the perfect plan. Cancel anytime.' : 'Select the perfect plan for your entertainment needs. Cancel or change anytime.'}
            </p>
          </div>

          {/* Plans Grid - Mobile Responsive */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-xl md:rounded-2xl p-4 md:p-8 border-2 transition-all duration-300 ${
                  plan.is_popular
                    ? 'bg-gradient-to-br from-blue-900/60 to-purple-900/60 border-blue-500 md:scale-105 shadow-2xl shadow-blue-500/20'
                    : 'bg-black/40 border-blue-800/30 hover:border-blue-600/50 md:hover:scale-105'
                }`}
              >
                {plan.is_popular && (
                  <div className={`absolute ${isMobile ? '-top-3 text-xs px-4 py-1.5' : '-top-4 text-sm px-6 py-2'} left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-full shadow-lg whitespace-nowrap`}>
                    {isMobile ? 'Popular' : 'Most Popular'}
                  </div>
                )}

                {plan.trial_days > 0 && (
                  <div className={`absolute ${isMobile ? '-top-3 right-2 text-[10px] px-2 py-1' : '-top-4 right-4 text-xs px-4 py-1'} bg-green-600 text-white font-bold rounded-full`}>
                    {plan.trial_days} Days Free
                  </div>
                )}

                <div className={`text-center ${isMobile ? 'mb-4' : 'mb-6'}`}>
                  <h3 className="text-lg md:text-2xl font-bold mb-1 md:mb-2 text-white">{plan.name}</h3>
                  <p className="text-xs md:text-sm text-blue-300 mb-2 md:mb-4 line-clamp-2">{plan.description}</p>
                  <div className="flex items-end justify-center mb-2">
                    <span className="text-2xl md:text-4xl font-bold text-white">
                      ${plan.price}
                    </span>
                    <span className="text-xs md:text-base text-blue-300 ml-1 md:ml-2 mb-0.5 md:mb-1">
                      {plan.interval === 'monthly' ? '/mo' : plan.interval === 'yearly' ? '/yr' : 'once'}
                    </span>
                  </div>
                </div>

                <ul className={`${isMobile ? 'space-y-2 mb-4' : 'space-y-3 mb-8'}`}>
                  <li className="flex items-start">
                    <Check className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-blue-400 mr-2 md:mr-3 mt-0.5 flex-shrink-0`} />
                    <span className="text-blue-100 text-xs md:text-sm">
                      {plan.max_concurrent_streams} {plan.max_concurrent_streams === 1 ? 'device' : 'devices'} at once
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-blue-400 mr-2 md:mr-3 mt-0.5 flex-shrink-0`} />
                    <span className="text-blue-100 text-xs md:text-sm">{plan.video_quality} quality</span>
                  </li>
                  <li className="flex items-start">
                    <Check className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-blue-400 mr-2 md:mr-3 mt-0.5 flex-shrink-0`} />
                    <span className="text-blue-100 text-xs md:text-sm">
                      Up to {plan.max_profiles} profiles
                    </span>
                  </li>
                  {plan.download_enabled && (
                    <li className="flex items-start">
                      <Check className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-blue-400 mr-2 md:mr-3 mt-0.5 flex-shrink-0`} />
                      <span className="text-blue-100 text-xs md:text-sm">{isMobile ? 'Download' : 'Download & watch offline'}</span>
                    </li>
                  )}
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-blue-400 mr-2 md:mr-3 mt-0.5 flex-shrink-0`} />
                      <span className="text-blue-100 text-xs md:text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleSelectPlan(plan.id)}
                  size={isMobile ? 'default' : 'lg'}
                  className="w-full text-sm md:text-base"
                  variant={plan.is_popular ? 'default' : 'secondary'}
                  disabled={selectedPlan === plan.id}
                >
                  {selectedPlan === plan.id ? (
                    <>
                      <Loader2 className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} mr-2 animate-spin`} />
                      {isMobile ? 'Processing...' : 'Processing...'}
                    </>
                  ) : (
                    <>{isMobile ? `Get ${plan.name}` : `Select ${plan.name}`}</>
                  )}
                </Button>
              </div>
            ))}
          </div>

          {/* Footer Note - Mobile Responsive */}
          <div className="text-center mt-8 md:mt-12 text-xs md:text-sm text-blue-300 px-4">
            <p>{isMobile ? 'Unlimited content. Cancel anytime.' : 'All plans include unlimited movies and shows. Cancel anytime.'}</p>
            <p className="mt-2">Need help? <Link href="/support" className="text-blue-400 hover:underline">Contact Support</Link></p>
          </div>
        </div>
      </Container>
    </div>
  )
}
