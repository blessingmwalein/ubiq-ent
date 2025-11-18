'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchProfiles, selectProfile } from '@/store/slices/profileSlice'
import { PageLoader } from '@/components/ui/loading'
import { Settings } from 'lucide-react'

export default function ProfilesPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { profiles, selectedProfile, loading } = useAppSelector((state) => state.profiles)

  useEffect(() => {
    dispatch(fetchProfiles())
  }, [dispatch])

  const handleSelectProfile = (profile: any) => {
    dispatch(selectProfile(profile))
    router.push('/browse')
  }

  const handleManageProfiles = () => {
    router.push('/profiles/manage')
  }

  if (loading) {
    return <PageLoader />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white flex flex-col items-center justify-center px-4 py-12 md:py-16">
      {/* Logo */}
      <div className="mb-8 md:mb-16">
        <Image
          src="/logo.png"
          alt="UBIQ Entertainment"
          width={200}
          height={60}
          className="h-10 sm:h-12 md:h-16 w-auto"
        />
      </div>

      <div className="w-full max-w-6xl">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-8 md:mb-16 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Who's watching?
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8 mb-8 md:mb-16">
          {profiles.map((profile) => {
            const isSelected = selectedProfile?.uuid === profile.uuid
            return (
              <button
                key={profile.uuid}
                onClick={() => handleSelectProfile(profile)}
                className="group flex flex-col items-center space-y-2 sm:space-y-3 md:space-y-4 transition-all"
              >
                <div 
                  className={`relative w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-300 ${
                    isSelected 
                      ? 'ring-4 ring-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.6)] scale-105' 
                      : 'ring-2 ring-transparent group-hover:ring-white/50 group-hover:scale-105 active:scale-95'
                  }`}
                  style={{ background: profile.avatar }}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-4xl sm:text-5xl md:text-6xl font-bold text-white drop-shadow-lg">
                      {profile.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  {profile.is_kids && (
                    <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-lg">
                      KIDS
                    </div>
                  )}
                </div>
                <span className={`text-sm sm:text-base md:text-lg font-semibold transition-colors text-center ${
                  isSelected ? 'text-blue-400' : 'text-gray-300 group-hover:text-white'
                }`}>
                  {profile.name}
                </span>
              </button>
            )
          })}

          {/* Add Profile Button */}
          {profiles.length < 4 && (
            <button
              onClick={() => router.push('/profiles/manage')}
              className="group flex flex-col items-center space-y-2 sm:space-y-3 md:space-y-4 transition-all"
            >
              <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-2xl sm:rounded-3xl border-4 border-dashed border-gray-600 group-hover:border-blue-400 flex items-center justify-center transition-all group-hover:scale-105 active:scale-95">
                <svg
                  className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-gray-600 group-hover:text-blue-400 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <span className="text-sm sm:text-base md:text-lg font-semibold text-gray-300 group-hover:text-white transition-colors text-center">
                Add Profile
              </span>
            </button>
          )}
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleManageProfiles}
            className="group flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 border-2 border-gray-600 hover:border-white rounded-full transition-all hover:scale-105 active:scale-95 text-sm sm:text-base"
          >
            <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-semibold">Manage Profiles</span>
          </button>
        </div>
      </div>
    </div>
  )
}
