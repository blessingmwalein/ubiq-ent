'use client'

import { useState } from 'react'
import { X, User, Mail, Phone, Calendar, Globe, Loader2 } from 'lucide-react'
import { User as UserType } from '@/store/slices/authSlice'
import { format } from 'date-fns'

interface EditProfileModalProps {
  user: UserType
  onClose: () => void
  onSave: (data: Partial<UserType>) => Promise<void>
  loading?: boolean
}

export default function EditProfileModal({ user, onClose, onSave, loading }: EditProfileModalProps) {
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    phone_number: user.phone_number || '',
    date_of_birth: user.date_of_birth ? format(new Date(user.date_of_birth), 'yyyy-MM-dd') : '',
    country_code: user.country_code || '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    if (formData.phone_number && !/^\+?[\d\s-()]+$/.test(formData.phone_number)) {
      newErrors.phone_number = 'Invalid phone number format'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) return

    setIsSubmitting(true)
    try {
      const updateData: Partial<UserType> = {
        name: formData.name,
        email: formData.email,
        phone_number: formData.phone_number || undefined,
        date_of_birth: formData.date_of_birth || undefined,
        country_code: formData.country_code || undefined,
      }

      await onSave(updateData)
    } catch (error) {
      console.error('Failed to update profile:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-700">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-br from-slate-900 to-slate-800 p-6 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold">Edit Profile</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-xl transition-all"
            disabled={isSubmitting}
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Full Name *
            </label>
            <div className="relative">
              <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={`w-full pl-12 pr-4 py-3 bg-slate-800 border ${
                  errors.name ? 'border-red-500' : 'border-gray-700'
                } rounded-2xl text-white focus:outline-none focus:border-blue-500 transition-all`}
                placeholder="Enter your full name"
                disabled={isSubmitting}
              />
            </div>
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Email Address *
            </label>
            <div className="relative">
              <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={`w-full pl-12 pr-4 py-3 bg-slate-800 border ${
                  errors.email ? 'border-red-500' : 'border-gray-700'
                } rounded-2xl text-white focus:outline-none focus:border-blue-500 transition-all`}
                placeholder="Enter your email"
                disabled={isSubmitting}
              />
            </div>
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Phone Number
            </label>
            <div className="relative">
              <Phone size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="tel"
                value={formData.phone_number}
                onChange={(e) => handleChange('phone_number', e.target.value)}
                className={`w-full pl-12 pr-4 py-3 bg-slate-800 border ${
                  errors.phone_number ? 'border-red-500' : 'border-gray-700'
                } rounded-2xl text-white focus:outline-none focus:border-blue-500 transition-all`}
                placeholder="+1 234 567 8900"
                disabled={isSubmitting}
              />
            </div>
            {errors.phone_number && (
              <p className="text-red-400 text-sm mt-1">{errors.phone_number}</p>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Date of Birth
            </label>
            <div className="relative">
              <Calendar size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="date"
                value={formData.date_of_birth}
                onChange={(e) => handleChange('date_of_birth', e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-gray-700 rounded-2xl text-white focus:outline-none focus:border-blue-500 transition-all"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Country Code */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Country Code
            </label>
            <div className="relative">
              <Globe size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={formData.country_code}
                onChange={(e) => handleChange('country_code', e.target.value.toUpperCase())}
                className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-gray-700 rounded-2xl text-white focus:outline-none focus:border-blue-500 transition-all uppercase"
                placeholder="US, UK, ZW, etc."
                maxLength={2}
                disabled={isSubmitting}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Two-letter ISO country code</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-2xl font-semibold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-2xl font-semibold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={isSubmitting || loading}
            >
              {isSubmitting || loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
