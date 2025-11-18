'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchProfiles, createProfile, updateProfile, deleteProfile } from '@/store/slices/profileSlice'
import { fetchInterests } from '@/store/slices/interestsSlice'
import { Plus, Edit, Trash2, X, AlertCircle, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

interface ProfileModalData {
  uuid?: string
  name: string
  avatar: string
  avatar_url: string
  maturity_rating: 'all' | 'pg' | 'pg13' | 'r' | 'adult'
  is_kids: boolean
  pin: string
  interests: number[]
}

const AVATAR_OPTIONS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
  'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
  'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
]

export default function ManageProfilesPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { profiles, loading } = useAppSelector((state) => state.profiles)
  const { data: interestsData } = useAppSelector((state) => state.interests)

  const [showModal, setShowModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [profileToDelete, setProfileToDelete] = useState<{ uuid: string, name: string } | null>(null)
  const [formData, setFormData] = useState<ProfileModalData>({
    name: '',
    avatar: AVATAR_OPTIONS[0],
    avatar_url: '',
    maturity_rating: 'all',
    is_kids: false,
    pin: '',
    interests: [],
  })
  const [errors, setErrors] = useState<{ name?: string; pin?: string; avatar_url?: string }>({})
  const [hoveredProfile, setHoveredProfile] = useState<string | null>(null)

  useEffect(() => {
    dispatch(fetchProfiles())
    dispatch(fetchInterests())
  }, [dispatch])

  const validateForm = () => {
    const newErrors: { name?: string; pin?: string; avatar_url?: string } = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Profile name is required'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Profile name must be at least 2 characters'
    } else if (formData.name.trim().length > 50) {
      newErrors.name = 'Profile name must be less than 50 characters'
    }

    if (formData.pin && formData.pin.length !== 4) {
      newErrors.pin = 'PIN must be exactly 4 digits'
    }

    if (formData.avatar_url && !formData.avatar_url.startsWith('http')) {
      newErrors.avatar_url = 'Avatar URL must be a valid URL'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleOpenCreate = () => {
    if (profiles.length >= 4) {
      toast.error('Profile limit reached. Maximum 4 profiles allowed.')
      return
    }
    setModalMode('create')
    setFormData({
      name: '',
      avatar: AVATAR_OPTIONS[0],
      avatar_url: '',
      maturity_rating: 'all',
      is_kids: false,
      pin: '',
      interests: [],
    })
    setErrors({})
    setShowModal(true)
  }

  const handleOpenEdit = (profile: any) => {
    setModalMode('edit')
    setFormData({
      uuid: profile.uuid,
      name: profile.name,
      avatar: profile.avatar,
      avatar_url: profile.avatar_url || '',
      maturity_rating: profile.maturity_rating || 'all',
      is_kids: profile.is_kids,
      pin: '',
      interests: profile.interests || [],
    })
    setErrors({})
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setFormData({
      name: '',
      avatar: AVATAR_OPTIONS[0],
      avatar_url: '',
      maturity_rating: 'all',
      is_kids: false,
      pin: '',
      interests: [],
    })
    setErrors({})
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    try {
      const payload: any = {
        name: formData.name.trim(),
        maturity_rating: formData.maturity_rating,
        is_kids: formData.is_kids,
      }

      // Only include optional fields if they have values
      if (formData.avatar_url) {
        payload.avatar_url = formData.avatar_url
      }
      if (formData.pin) {
        payload.pin = formData.pin
      }
      if (formData.interests.length > 0) {
        payload.interests = formData.interests
      }

      if (modalMode === 'create') {
        await dispatch(createProfile(payload)).unwrap()
        toast.success('Profile created successfully! 🎉')
      } else {
        await dispatch(updateProfile({
          uuid: formData.uuid!,
          data: payload
        })).unwrap()
        toast.success('Profile updated successfully! ✨')
      }
      handleCloseModal()
    } catch (error: any) {
      const errorMessage = error?.error || error?.message || `Failed to ${modalMode} profile`
      toast.error(errorMessage)
    }
  }

  const handleDeleteClick = (profile: any) => {
    setProfileToDelete({ uuid: profile.uuid, name: profile.name })
    setShowDeleteDialog(true)
  }

  const handleConfirmDelete = async () => {
    if (!profileToDelete) return

    try {
      await dispatch(deleteProfile(profileToDelete.uuid)).unwrap()
      toast.success('Profile deleted successfully! 🗑️')
      setShowDeleteDialog(false)
      setProfileToDelete(null)
    } catch (error: any) {
      const errorMessage = error?.error || error?.message || 'Failed to delete profile'
      toast.error(errorMessage)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Manage Profiles
              </h1>
              <p className="text-gray-400">
                Create and customize profiles for everyone in your household
              </p>
            </div>
            <button
              onClick={() => router.push('/profiles')}
              className="px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 rounded-2xl transition-all hover:scale-105 font-semibold shadow-lg"
            >
              Done
            </button>
          </div>

          {/* Profile Limit Warning */}
          {profiles.length >= 4 && (
            <div className="mb-8 p-4 bg-amber-500/10 border-2 border-amber-500/30 rounded-2xl flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-500 mb-1">Profile limit reached</h3>
                <p className="text-sm text-gray-300">
                  You've reached the maximum of 4 profiles. Delete a profile to create a new one.
                </p>
              </div>
            </div>
          )}

          {/* Profiles Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {/* Add Profile Button */}
            <button
              onClick={handleOpenCreate}
              disabled={profiles.length >= 4}
              className={`group aspect-square rounded-3xl flex flex-col items-center justify-center gap-4 transition-all border-4 border-dashed ${
                profiles.length >= 4
                  ? 'border-gray-700 opacity-50 cursor-not-allowed'
                  : 'border-gray-600 hover:border-blue-400 hover:scale-105 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]'
              }`}
            >
              <Plus size={64} className={profiles.length >= 4 ? 'text-gray-700' : 'text-gray-400 group-hover:text-blue-400'} />
              <span className={`text-xl font-semibold ${profiles.length >= 4 ? 'text-gray-700' : 'text-gray-400 group-hover:text-blue-400'}`}>
                Add Profile
              </span>
            </button>

            {/* Profile Cards */}
            {profiles.map((profile) => (
              <div
                key={profile.uuid}
                className="group aspect-square rounded-3xl overflow-hidden relative transition-all hover:scale-105"
                onMouseEnter={() => setHoveredProfile(profile.uuid)}
                onMouseLeave={() => setHoveredProfile(null)}
              >
                {/* Profile Avatar */}
                <div
                  className="w-full h-full flex items-center justify-center relative"
                  style={{ background: profile.avatar }}
                >
                  <span className="text-7xl font-bold text-white drop-shadow-2xl">
                    {profile.name.charAt(0).toUpperCase()}
                  </span>

                  {/* Kids Badge */}
                  {profile.is_kids && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-xl">
                      KIDS
                    </div>
                  )}

                  {/* Hover Overlay with Actions */}
                  <div
                    className={`absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center gap-4 transition-opacity duration-300 ${
                      hoveredProfile === profile.uuid ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <button
                      onClick={() => handleOpenEdit(profile)}
                      className="p-4 bg-blue-600 hover:bg-blue-500 rounded-2xl transition-all hover:scale-110 shadow-lg"
                      title="Edit Profile"
                    >
                      <Edit size={24} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(profile)}
                      className="p-4 bg-red-600 hover:bg-red-500 rounded-2xl transition-all hover:scale-110 shadow-lg"
                      title="Delete Profile"
                    >
                      <Trash2 size={24} />
                    </button>
                  </div>
                </div>

                {/* Profile Name Bar */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                  <p className="font-bold text-lg text-center truncate">{profile.name}</p>
                </div>
              </div>
            ))}
          </div>

          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
              <p className="text-gray-400 mt-4">Loading profiles...</p>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-gray-700 animate-in zoom-in duration-200">
            {/* Modal Header - Fixed */}
            <div className="flex items-center justify-between p-8 pb-4 flex-shrink-0">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {modalMode === 'create' ? 'Create New Profile' : 'Edit Profile'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto px-8 pb-4 flex-1">
              {/* Avatar Selection */}
              <div className="mb-6">
                <label className="block text-lg font-semibold mb-4">Choose Avatar Color</label>
                <div className="grid grid-cols-4 gap-3">
                  {AVATAR_OPTIONS.map((avatar, index) => (
                    <button
                      key={index}
                      onClick={() => setFormData({ ...formData, avatar })}
                      className={`aspect-square rounded-2xl flex items-center justify-center text-3xl font-bold transition-all ${
                        formData.avatar === avatar
                          ? 'ring-4 ring-blue-500 scale-105 shadow-[0_0_30px_rgba(59,130,246,0.5)]'
                          : 'ring-2 ring-gray-600 hover:ring-white/50 hover:scale-105'
                      }`}
                      style={{ background: avatar }}
                    >
                      {formData.name.charAt(0).toUpperCase() || '?'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name Input */}
              <div className="mb-6">
                <label className="block text-lg font-semibold mb-3">Profile Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-6 py-4 bg-slate-800 border-2 border-gray-700 rounded-2xl focus:outline-none focus:border-blue-500 text-lg transition-colors"
                  placeholder="Enter profile name"
                  maxLength={50}
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-red-400 flex items-center gap-2">
                    <AlertCircle size={16} />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Avatar URL (Optional) */}
              <div className="mb-6">
                <label className="block text-lg font-semibold mb-3">
                  Avatar URL <span className="text-sm text-gray-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="url"
                  value={formData.avatar_url}
                  onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                  className="w-full px-6 py-4 bg-slate-800 border-2 border-gray-700 rounded-2xl focus:outline-none focus:border-blue-500 text-lg transition-colors"
                  placeholder="https://example.com/avatar.png"
                />
                {errors.avatar_url && (
                  <p className="mt-2 text-sm text-red-400 flex items-center gap-2">
                    <AlertCircle size={16} />
                    {errors.avatar_url}
                  </p>
                )}
                <p className="mt-2 text-sm text-gray-400">
                  Custom profile picture URL (overrides gradient color)
                </p>
              </div>

              {/* Maturity Rating */}
              <div className="mb-6">
                <label className="block text-lg font-semibold mb-3">Maturity Rating *</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {[
                    { value: 'all', label: 'All Ages', desc: 'Everyone' },
                    { value: 'pg', label: 'PG', desc: 'Parental guidance' },
                    { value: 'pg13', label: 'PG-13', desc: '13+ content' },
                    { value: 'r', label: 'R', desc: '17+ content' },
                    { value: 'adult', label: 'Adult', desc: '18+ content' },
                  ].map((rating) => (
                    <button
                      key={rating.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, maturity_rating: rating.value as any })}
                      className={`p-4 rounded-2xl border-2 transition-all text-left ${
                        formData.maturity_rating === rating.value
                          ? 'border-blue-500 bg-blue-500/20'
                          : 'border-gray-700 bg-slate-800/50 hover:border-gray-600'
                      }`}
                    >
                      <div className="font-semibold mb-1">{rating.label}</div>
                      <div className="text-xs text-gray-400">{rating.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Kids Profile Toggle */}
              <div className="mb-6 p-6 bg-slate-800/50 rounded-2xl border border-gray-700">
                <label className="flex items-start gap-4 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.is_kids}
                    onChange={(e) => setFormData({ ...formData, is_kids: e.target.checked })}
                    className="w-6 h-6 mt-1 rounded-lg border-2 border-gray-600 bg-slate-700 checked:bg-gradient-to-r checked:from-blue-600 checked:to-purple-600 cursor-pointer"
                  />
                  <div className="flex-1">
                    <span className="text-lg font-semibold block mb-1 group-hover:text-blue-400 transition-colors">
                      Kids Profile
                    </span>
                    <p className="text-sm text-gray-400">
                      Only show age-appropriate content for children under 12
                    </p>
                  </div>
                </label>
              </div>

              {/* PIN Protection (Optional) */}
              <div className="mb-6">
                <label className="block text-lg font-semibold mb-3">
                  Profile PIN <span className="text-sm text-gray-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={formData.pin}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 4)
                    setFormData({ ...formData, pin: value })
                  }}
                  className="w-full px-6 py-4 bg-slate-800 border-2 border-gray-700 rounded-2xl focus:outline-none focus:border-blue-500 text-lg transition-colors"
                  placeholder="4-digit PIN"
                  maxLength={4}
                />
                {errors.pin && (
                  <p className="mt-2 text-sm text-red-400 flex items-center gap-2">
                    <AlertCircle size={16} />
                    {errors.pin}
                  </p>
                )}
                <p className="mt-2 text-sm text-gray-400">
                  Require a 4-digit PIN to access this profile
                </p>
              </div>

              {/* Interests (Optional) */}
              <div className="mb-6">
                <label className="block text-lg font-semibold mb-3">
                  Interests <span className="text-sm text-gray-400 font-normal">(Optional)</span>
                </label>
                <div className="space-y-4">
                  {Object.keys(interestsData).length === 0 ? (
                    <div className="p-4 bg-slate-800/50 rounded-2xl border border-gray-700 text-center text-gray-400">
                      Loading interests...
                    </div>
                  ) : (
                    Object.entries(interestsData).map(([category, interests]) => (
                      <div key={category} className="p-4 bg-slate-800/50 rounded-2xl border border-gray-700">
                        <h4 className="font-semibold text-base mb-3 capitalize">{category}</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {interests.map((interest) => {
                            const interestId = parseInt(interest.id, 10)
                            // Skip if ID is not a valid number
                            if (isNaN(interestId)) {
                              console.warn(`Invalid interest ID: ${interest.id}`)
                              return null
                            }
                            const isSelected = formData.interests.includes(interestId)
                            return (
                              <button
                                key={interest.id}
                                type="button"
                                onClick={() => {
                                  setFormData({
                                    ...formData,
                                    interests: isSelected
                                      ? formData.interests.filter((id) => id !== interestId)
                                      : [...formData.interests, interestId],
                                  })
                                }}
                                className={`p-3 rounded-xl text-sm font-medium transition-all text-left ${
                                  isSelected
                                    ? 'bg-blue-600 text-white shadow-lg'
                                    : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span>{interest.name}</span>
                                  {isSelected && <CheckCircle size={16} />}
                                </div>
                              </button>
                            )
                          }).filter(Boolean)}
                        </div>
                      </div>
                    ))
                  )}
                  {formData.interests.length > 0 && (
                    <p className="text-xs text-gray-400 px-4">
                      Selected: {formData.interests.length} interest{formData.interests.length !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons - Fixed */}
            <div className="flex gap-4 p-8 pt-4 border-t border-gray-700 flex-shrink-0">
              <button
                onClick={handleCloseModal}
                className="flex-1 px-6 py-4 bg-gray-700 hover:bg-gray-600 rounded-full transition-all hover:scale-105 font-semibold text-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-full transition-all hover:scale-105 font-semibold text-lg shadow-lg"
              >
                {modalMode === 'create' ? 'Create Profile' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && profileToDelete && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl max-w-md w-full p-8 shadow-2xl border border-red-500/30 animate-in zoom-in duration-200">
            {/* Warning Icon */}
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trash2 size={32} className="text-red-500" />
            </div>

            {/* Dialog Content */}
            <h2 className="text-2xl font-bold text-center mb-3">Delete Profile?</h2>
            <p className="text-gray-400 text-center mb-6">
              Are you sure you want to delete <span className="font-semibold text-white">"{profileToDelete.name}"</span>? This action cannot be undone.
            </p>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowDeleteDialog(false)
                  setProfileToDelete(null)
                }}
                className="flex-1 px-6 py-4 bg-gray-700 hover:bg-gray-600 rounded-2xl transition-all hover:scale-105 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-2xl transition-all hover:scale-105 font-semibold shadow-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
