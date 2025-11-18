'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'sonner'
import { Loader2, CreditCard, Lock } from 'lucide-react'
import { useAppSelector } from '@/store/hooks'
import { subscriptionService } from '@/services/subscriptionService'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Container } from '@/components/layout'

interface Plan {
  id: number
  name: string
  description: string
  price: number
  interval: string
}

function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const planId = searchParams.get('plan')
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)
  
  const [plan, setPlan] = useState<Plan | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  
  // Payment form state
  const [cardNumber, setCardNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvv, setCvv] = useState('')
  const [cardholderName, setCardholderName] = useState('')

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    if (!planId) {
      router.push('/subscribe')
      return
    }

    fetchPlanDetails()
  }, [isAuthenticated, planId, router])

  const fetchPlanDetails = async () => {
    try {
      setLoading(true)
      const response = await subscriptionService.getPlans(true)
      
      if (response.success) {
        const selectedPlan = response.data.find((p: Plan) => p.id === parseInt(planId!))
        if (selectedPlan) {
          setPlan(selectedPlan)
        } else {
          toast.error('Plan not found')
          router.push('/subscribe')
        }
      }
    } catch (error) {
      console.error('Failed to fetch plan:', error)
      toast.error('Failed to load plan details')
      router.push('/subscribe')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!plan) return

    // Basic validation
    if (!cardNumber || !expiryDate || !cvv || !cardholderName) {
      toast.error('Please fill in all payment details')
      return
    }

    try {
      setProcessing(true)

      // For now, we'll create a mock payment method
      // TODO: Integrate with Stripe for real payment processing
      const mockPaymentMethodId = 'pm_' + Math.random().toString(36).substr(2, 9)

      const response = await subscriptionService.subscribe(
        plan.id,
        mockPaymentMethodId,
        true // use trial if available
      )

      if (response.success) {
        toast.success('Subscription Activated!', {
          description: 'Welcome to UBIQ Entertainment. Set up your profile to start watching.',
        })
        
        // Redirect to onboarding/profile creation
        router.push('/onboarding')
      } else {
        throw new Error(response.message || 'Subscription failed')
      }
    } catch (error: any) {
      console.error('Payment failed:', error)
      toast.error('Payment Failed', {
        description: error.message || 'Unable to process payment. Please try again.',
      })
    } finally {
      setProcessing(false)
    }
  }

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '')
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned
    return formatted.substr(0, 19) // Max 16 digits + 3 spaces
  }

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length >= 2) {
      return cleaned.substr(0, 2) + '/' + cleaned.substr(2, 2)
    }
    return cleaned
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-950 via-blue-900 to-black flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
      </div>
    )
  }

  if (!plan) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 via-blue-900 to-black text-blue-100">
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
      <Container className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Complete Your Order
            </h1>
            <p className="text-lg text-blue-200">
              You're one step away from unlimited entertainment
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div className="bg-black/40 border border-blue-800/30 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-sm text-blue-300">Plan</p>
                  <p className="text-lg font-semibold text-white">{plan.name}</p>
                </div>
                
                <div>
                  <p className="text-sm text-blue-300">Billing</p>
                  <p className="text-lg font-semibold text-white">
                    {plan.interval === 'monthly' ? 'Monthly' : plan.interval === 'yearly' ? 'Yearly' : 'One-time'}
                  </p>
                </div>
              </div>

              <div className="border-t border-blue-800/30 pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-blue-200">Subtotal</span>
                  <span className="text-white font-semibold">${plan.price}</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold">
                  <span className="text-white">Total</span>
                  <span className="text-white">${plan.price}</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-900/30 rounded-lg">
                <p className="text-sm text-blue-200">
                  <Lock className="w-4 h-4 inline mr-2" />
                  Secure payment powered by Stripe
                </p>
              </div>
            </div>

            {/* Payment Form */}
            <div className="bg-black/40 border border-blue-800/30 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <CreditCard className="w-6 h-6 mr-2" />
                Payment Details
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="cardholderName" className="text-blue-200 text-sm font-medium">
                    Cardholder Name
                  </Label>
                  <Input
                    id="cardholderName"
                    type="text"
                    placeholder="John Doe"
                    value={cardholderName}
                    onChange={(e) => setCardholderName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardNumber" className="text-blue-200 text-sm font-medium">
                    Card Number
                  </Label>
                  <Input
                    id="cardNumber"
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    maxLength={19}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate" className="text-blue-200 text-sm font-medium">
                      Expiry Date
                    </Label>
                    <Input
                      id="expiryDate"
                      type="text"
                      placeholder="MM/YY"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                      maxLength={5}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cvv" className="text-blue-200 text-sm font-medium">
                      CVV
                    </Label>
                    <Input
                      id="cvv"
                      type="text"
                      placeholder="123"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substr(0, 4))}
                      maxLength={4}
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full mt-6"
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    <>Complete Purchase</>
                  )}
                </Button>

                <p className="text-xs text-blue-300 text-center mt-4">
                  By completing this purchase, you agree to our{' '}
                  <Link href="/terms" className="text-blue-400 hover:underline">
                    Terms of Service
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-blue-950 via-blue-900 to-black flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  )
}
