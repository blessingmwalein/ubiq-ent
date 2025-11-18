'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { updateOnboardingStatus } from '@/store/slices/authSlice'
import { fetchProfiles, createProfile, selectProfile } from '@/store/slices/profileSlice'
import { fetchInterests } from '@/store/slices/interestsSlice'
import interestService from '@/services/interestService'
import { CheckCircle, Loader2, ChevronRight, ChevronLeft } from 'lucide-react'
import { toast } from 'sonner'
import { DatePicker } from '@/components/ui/date-picker'

const AVATAR_OPTIONS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
]

type OnboardingStep = 'interests' | 'profile'

export default function OnboardingPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { user, isAuthenticated } = useAppSelector((state) => state.auth)
  const { data: interestsData } = useAppSelector((state) => state.interests)

  const [step, setStep] = useState<OnboardingStep>('interests')
  const [loading, setLoading] = useState(false)
  const [selectedInterests, setSelectedInterests] = useState<number[]>([]) // Store interest IDs as numbers

  // Profile creation state
  const [profileData, setProfileData] = useState({
    name: '',
    avatar: AVATAR_OPTIONS[0],
    is_kids: false,
  })
  const [profileError, setProfileError] = useState('')

  // Additional user info
  const [userInfo, setUserInfo] = useState({
    date_of_birth: '',
    phone_number: '',
    country_code: '+1',
  })

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/login')
      return
    }

    // If onboarding is already completed, redirect
    if (user.onboarding_completed) {
      router.push('/profiles')
      return
    }

    // Pre-fill name with user's name
    if (user.name && !profileData.name) {
      setProfileData((prev) => ({ ...prev, name: user.name }))
    }

    // Fetch interests
    dispatch(fetchInterests())
  }, [user, isAuthenticated, router, dispatch])

  const toggleInterest = (interestId: number) => {
    setSelectedInterests((prev) =>
      prev.includes(interestId)
        ? prev.filter((id) => id !== interestId)
        : [...prev, interestId]
    )
  }

  const handleCompleteInterests = () => {
    if (selectedInterests.length === 0) {
      toast.error('Please select at least one interest')
      return
    }
    setStep('profile')
  }

  const handleBackToInterests = () => {
    setStep('interests')
  }

  const validateProfile = () => {
    if (!profileData.name.trim()) {
      setProfileError('Profile name is required')
      return false
    }
    if (profileData.name.trim().length < 2) {
      setProfileError('Profile name must be at least 2 characters')
      return false
    }
    if (profileData.name.trim().length > 50) {
      setProfileError('Profile name must be less than 50 characters')
      return false
    }
    setProfileError('')
    return true
  }

  const handleCompleteOnboarding = async () => {
    if (!validateProfile()) return

    setLoading(true)
    try {
      // Step 1: Complete onboarding with interests and user info
      await interestService.completeOnboarding({
        // avatar_url is optional - omit if using gradient
        date_of_birth: userInfo.date_of_birth || undefined,
        phone_number: userInfo.phone_number || undefined,
        country_code: userInfo.country_code || undefined,
        interests: selectedInterests, // Passing integer IDs
      })

      // Step 2: Update onboarding status in Redux and cookies
      dispatch(updateOnboardingStatus(true))

      // Step 3: Create first profile
      const newProfile = await dispatch(
        createProfile({
          name: profileData.name.trim(),
          avatar: profileData.avatar,
          is_kids: profileData.is_kids,
        })
      ).unwrap()

      toast.success('Welcome! Your account is ready 🎉')
      
      // Step 4: Redirect to profiles page to select profile
      setTimeout(() => {
        router.push('/profiles')
      }, 500)
    } catch (error: any) {
      console.error('Onboarding error:', error)
      toast.error(error.message || 'Failed to complete onboarding')
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-950 via-blue-900 to-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 via-blue-900 to-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {step === 'interests' ? 'Choose Your Interests' : 'Create Your Profile'}
            </h1>
            <p className="text-blue-200 text-lg">
              {step === 'interests'
                ? 'Help us personalize your experience by selecting your favorite genres'
                : 'Set up your first profile to start watching'}
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-12">
            <div className="flex items-center gap-4">
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                  step === 'interests'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-800 text-gray-400'
                }`}
              >
                <CheckCircle size={20} />
                <span className="font-medium">Interests</span>
              </div>
              <ChevronRight size={20} className="text-gray-600" />
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                  step === 'profile'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-800 text-gray-400'
                }`}
              >
                <CheckCircle size={20} />
                <span className="font-medium">Profile</span>
              </div>
            </div>
          </div>

          {/* Step Content */}
          {step === 'interests' ? (
            <div className="space-y-8">
              {/* Interests Selection */}
              {Object.entries(interestsData).map(([category, interests]) => (
                <div key={category} className="space-y-4">
                  <h2 className="text-2xl font-bold text-blue-100">{category}</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {interests.map((interest) => {
                      const interestId = parseInt(interest.id, 10)
                      // Skip if ID is not a valid number
                      if (isNaN(interestId)) {
                        console.warn(`Invalid interest ID: ${interest.id}`)
                        return null
                      }
                      const isSelected = selectedInterests.includes(interestId)
                      return (
                        <button
                          key={interest.id}
                          onClick={() => toggleInterest(interestId)}
                          className={`p-4 rounded-2xl border-2 transition-all hover:scale-105 ${
                            isSelected
                              ? 'bg-gradient-to-br from-blue-600 to-purple-600 border-blue-400 shadow-lg shadow-blue-500/50'
                              : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm">{interest.name}</span>
                            {isSelected && (
                              <CheckCircle size={18} className="text-white flex-shrink-0 ml-2" />
                            )}
                          </div>
                        </button>
                      )
                    }).filter(Boolean)}
                  </div>
                </div>
              ))}

              {/* Selected Count */}
              <div className="text-center py-4">
                <p className="text-blue-200">
                  {selectedInterests.length} interest{selectedInterests.length !== 1 ? 's' : ''}{' '}
                  selected
                </p>
              </div>

              {/* Continue Button */}
              <div className="flex justify-center pt-6">
                <button
                  onClick={handleCompleteInterests}
                  disabled={selectedInterests.length === 0}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-gray-700 disabled:to-gray-600 disabled:cursor-not-allowed rounded-full font-semibold text-lg transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
                >
                  Continue to Profile
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Avatar Selection */}
              <div>
                <label className="block text-lg font-semibold mb-4">Choose Your Avatar</label>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                  {AVATAR_OPTIONS.map((avatar, index) => (
                    <button
                      key={index}
                      onClick={() => setProfileData({ ...profileData, avatar })}
                      className={`aspect-square rounded-3xl flex items-center justify-center text-4xl font-bold transition-all ${
                        profileData.avatar === avatar
                          ? 'ring-4 ring-blue-500 scale-110 shadow-xl'
                          : 'opacity-70 hover:opacity-100 hover:scale-105'
                      }`}
                      style={{ background: avatar }}
                    >
                      {profileData.name.charAt(0).toUpperCase() || '?'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Profile Name */}
              <div>
                <label className="block text-lg font-semibold mb-2">Profile Name</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-2xl focus:outline-none focus:border-blue-500 text-lg"
                  placeholder="Enter your name"
                />
                {profileError && <p className="mt-2 text-sm text-red-500">{profileError}</p>}
              </div>

              {/* Kids Profile Toggle */}
              <div className="flex items-center gap-4 p-4 bg-gray-800 rounded-2xl border border-gray-700">
                <input
                  type="checkbox"
                  id="kids-profile"
                  checked={profileData.is_kids}
                  onChange={(e) => setProfileData({ ...profileData, is_kids: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-700 bg-gray-900 checked:bg-blue-600"
                />
                <label htmlFor="kids-profile" className="flex-1 cursor-pointer">
                  <span className="text-lg font-medium">Kids Profile</span>
                  <p className="text-sm text-gray-400 mt-1">
                    Only show age-appropriate content
                  </p>
                </label>
              </div>

              {/* Optional: Additional Info */}
              <div className="space-y-4 pt-4 border-t border-gray-700">
                <h3 className="text-lg font-semibold">Additional Information (Optional)</h3>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Date of Birth</label>
                  <DatePicker
                    value={userInfo.date_of_birth ? new Date(userInfo.date_of_birth) : null}
                    onChange={(date: Date | null) => {
                      if (date) {
                        setUserInfo({ ...userInfo, date_of_birth: date.toISOString().split('T')[0] })
                      } else {
                        setUserInfo({ ...userInfo, date_of_birth: '' })
                      }
                    }}
                    placeholder="Select your birth date"
                    className="w-full"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Country Code</label>
                    <input
                      type="text"
                      value={userInfo.country_code}
                      onChange={(e) => setUserInfo({ ...userInfo, country_code: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-2xl focus:outline-none focus:border-blue-500"
                      placeholder="+1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={userInfo.phone_number}
                      onChange={(e) => setUserInfo({ ...userInfo, phone_number: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-2xl focus:outline-none focus:border-blue-500"
                      placeholder="1234567890"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6">
                <button
                  onClick={handleBackToInterests}
                  disabled={loading}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 disabled:from-gray-800 disabled:to-gray-700 rounded-full font-semibold text-lg transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
                >
                  <ChevronLeft size={24} />
                  Back
                </button>
                <button
                  onClick={handleCompleteOnboarding}
                  disabled={loading}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-gray-700 disabled:to-gray-600 rounded-full font-semibold text-lg transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Completing...
                    </>
                  ) : (
                    <>
                      Complete Setup
                      <CheckCircle size={24} />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
