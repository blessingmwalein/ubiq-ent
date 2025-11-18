'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { 
  fetchDevices, 
  removeDevice, 
  fetchSubscription, 
  cancelSubscription, 
  renewSubscription,
  fetchPackages,
  registerDevice
} from '@/store/slices/accountSlice'
import { getCurrentUser, updateUser } from '@/store/slices/authSlice'
import { MainLayout, Container } from '@/components/layout'
import { User, Mail, Phone, Calendar, Globe, Smartphone, Monitor, Tablet, CreditCard, AlertCircle, Trash2, Crown, Shield, LogOut, Edit2 } from 'lucide-react'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { ProfileSkeleton, DevicesSkeleton, SubscriptionSkeleton } from '@/components/ui/skeleton'
import { buildDevicePayload, isDeviceRegistered, markDeviceRegistered } from '@/lib/device-utils'
import { Package } from '@/services/accountService'
import EditProfileModal from '@/components/account/EditProfileModal'
import { User as UserType } from '@/store/slices/authSlice'
import { useResponsive } from '@/lib/hooks'

export default function AccountPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { user, account } = useAppSelector((state) => state.auth)
  const { 
    devices, 
    subscription, 
    packages,
    devicesLoading, 
    subscriptionLoading,
    packagesLoading,
    registeringDevice
  } = useAppSelector((state) => state.account)
  const { isMobile, isTablet } = useResponsive()
  
  const [activeTab, setActiveTab] = useState<'profile' | 'devices' | 'subscription'>('profile')
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [deviceToRemove, setDeviceToRemove] = useState<string | null>(null)
  const [showEditProfile, setShowEditProfile] = useState(false)

  useEffect(() => {
    // Fetch current user data
    dispatch(getCurrentUser())

    // Register device if not already registered
    const registerCurrentDevice = async () => {
      if (!isDeviceRegistered() && user) {
        try {
          const devicePayload = await buildDevicePayload()
          await dispatch(registerDevice(devicePayload)).unwrap()
          markDeviceRegistered()
          console.log('Device registered successfully')
        } catch (error) {
          console.error('Failed to register device:', error)
        }
      }
    }

    registerCurrentDevice()

    // Fetch data
    dispatch(fetchDevices())
    dispatch(fetchSubscription())
    dispatch(fetchPackages())
  }, [dispatch])

  const getDeviceIcon = (deviceType: string) => {
    const type = deviceType.toLowerCase()
    if (type.includes('mobile') || type.includes('phone')) return <Smartphone className="w-6 h-6" />
    if (type.includes('tablet')) return <Tablet className="w-6 h-6" />
    return <Monitor className="w-6 h-6" />
  }

  const handleRemoveDevice = async (uuid: string) => {
    try {
      await dispatch(removeDevice(uuid)).unwrap()
      toast.success('Device removed successfully')
      setDeviceToRemove(null)
    } catch (error: any) {
      toast.error(error?.error || error?.message || 'Failed to remove device')
    }
  }

  const handleCancelSubscription = async () => {
    try {
      await dispatch(cancelSubscription()).unwrap()
      toast.success('Subscription will be cancelled at the end of billing period')
      setShowCancelDialog(false)
    } catch (error: any) {
      toast.error(error?.error || error?.message || 'Failed to cancel subscription')
    }
  }

  const handleRenewSubscription = async () => {
    try {
      await dispatch(renewSubscription()).unwrap()
      toast.success('Subscription renewed successfully')
    } catch (error: any) {
      toast.error(error?.error || error?.message || 'Failed to renew subscription')
    }
  }

  const handleUpdateProfile = async (data: Partial<UserType>) => {
    try {
      await dispatch(updateUser(data)).unwrap()
      toast.success('Profile updated successfully')
      setShowEditProfile(false)
    } catch (error: any) {
      toast.error(error?.error || error?.message || 'Failed to update profile')
      throw error // Re-throw to let modal handle it
    }
  }

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      active: 'bg-green-500/20 text-green-400 border-green-500/30',
      trial: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
      expired: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    }
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[status] || statusColors.expired}`}>
        {status.toUpperCase()}
      </span>
    )
  }

  if (!user) return null

  return (
    <MainLayout>
      <Container>
        <div className="py-6 md:py-12 pb-24 md:pb-12">
          {/* Header - Mobile Responsive */}
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Account Settings
            </h1>
            <p className="text-sm md:text-base text-gray-400">Manage your account, devices, and subscription</p>
          </div>

          {/* Tabs - Mobile Responsive */}
          <div className="flex gap-2 md:gap-4 mb-6 md:mb-8 border-b border-gray-700 overflow-x-auto scrollbar-hide">
            {[
              { id: 'profile', label: isMobile ? 'Profile' : 'Profile', icon: User },
              { id: 'devices', label: isMobile ? 'Devices' : 'Devices', icon: Smartphone },
              { id: 'subscription', label: isMobile ? 'Plan' : 'Subscription', icon: Crown },
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-6 py-2 md:py-3 text-sm md:text-base font-semibold transition-all border-b-2 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  <Icon size={isMobile ? 16 : 20} />
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Profile Tab - Mobile Responsive */}
          {activeTab === 'profile' && (
            <>
              {!user ? (
                <ProfileSkeleton />
              ) : (
                <div className="space-y-4 md:space-y-6">
                  {/* Personal Information */}
                  <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl md:rounded-3xl p-4 md:p-8 border border-gray-700">
                    <div className="flex items-center justify-between mb-4 md:mb-6">
                      <h2 className="text-lg md:text-2xl font-bold flex items-center gap-2 md:gap-3">
                        <User className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
                        <span className="hidden sm:inline">Personal Information</span>
                        <span className="sm:hidden">Profile</span>
                      </h2>
                      <button
                        onClick={() => setShowEditProfile(true)}
                        className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base bg-blue-600 hover:bg-blue-500 rounded-lg md:rounded-xl font-semibold transition-all hover:scale-105"
                      >
                        <Edit2 size={isMobile ? 14 : 18} />
                        {!isMobile && 'Edit Profile'}
                        {isMobile && 'Edit'}
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
                      <div>
                        <label className="block text-xs md:text-sm font-medium text-gray-400 mb-1.5 md:mb-2">Full Name</label>
                        <div className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 bg-slate-800 rounded-xl md:rounded-2xl border border-gray-700">
                          <User size={isMobile ? 16 : 20} className="text-gray-500" />
                          <span className="text-sm md:text-base text-white">{user.name || 'Not set'}</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs md:text-sm font-medium text-gray-400 mb-1.5 md:mb-2">Email Address</label>
                        <div className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 bg-slate-800 rounded-xl md:rounded-2xl border border-gray-700">
                          <Mail size={isMobile ? 16 : 20} className="text-gray-500" />
                          <span className="text-sm md:text-base text-white truncate">{user.email}</span>
                        </div>
                      </div>

                      {user.phone_number && (
                        <div>
                          <label className="block text-xs md:text-sm font-medium text-gray-400 mb-1.5 md:mb-2">Phone Number</label>
                          <div className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 bg-slate-800 rounded-xl md:rounded-2xl border border-gray-700">
                            <Phone size={isMobile ? 16 : 20} className="text-gray-500" />
                            <span className="text-sm md:text-base text-white">{user.phone_number}</span>
                          </div>
                        </div>
                      )}

                      {user.date_of_birth && (
                        <div>
                          <label className="block text-xs md:text-sm font-medium text-gray-400 mb-1.5 md:mb-2">Date of Birth</label>
                          <div className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 bg-slate-800 rounded-xl md:rounded-2xl border border-gray-700">
                            <Calendar size={isMobile ? 16 : 20} className="text-gray-500" />
                            <span className="text-sm md:text-base text-white">{format(new Date(user.date_of_birth), 'MMMM d, yyyy')}</span>
                          </div>
                        </div>
                      )}

                      {user.country_code && (
                        <div>
                          <label className="block text-xs md:text-sm font-medium text-gray-400 mb-1.5 md:mb-2">Country</label>
                          <div className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 bg-slate-800 rounded-xl md:rounded-2xl border border-gray-700">
                            <Globe size={isMobile ? 16 : 20} className="text-gray-500" />
                            <span className="text-sm md:text-base text-white">{user.country_code}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 md:mt-6 p-3 md:p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl md:rounded-2xl">
                      <p className="text-xs md:text-sm text-blue-400 flex items-start gap-2">
                        <Shield size={isMobile ? 14 : 16} className="mt-0.5 flex-shrink-0" />
                        <span>Your personal information is secure and encrypted{!isMobile && '. Contact support to update your details'}.</span>
                      </p>
                    </div>
                  </div>

                  {/* Account Information - Mobile Responsive */}
                  <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl md:rounded-3xl p-4 md:p-8 border border-gray-700">
                    <h2 className="text-lg md:text-2xl font-bold mb-4 md:mb-6">Account Details</h2>
                    
                    <div className="space-y-3 md:space-y-4">
                      <div className="flex justify-between items-center p-3 md:p-4 bg-slate-800/50 rounded-xl md:rounded-2xl">
                        <span className="text-sm md:text-base text-gray-400">Account Status</span>
                        <span className="font-semibold text-white">{getStatusBadge(account?.status || 'inactive')}</span>
                      </div>

                      <div className="flex justify-between items-center p-3 md:p-4 bg-slate-800/50 rounded-xl md:rounded-2xl">
                        <span className="text-sm md:text-base text-gray-400">Member Since</span>
                        <span className="font-semibold text-sm md:text-base text-white">
                          {user.created_at ? format(new Date(user.created_at), 'MMMM yyyy') : 'N/A'}
                        </span>
                      </div>

                      {account?.uuid && !isMobile && (
                        <div className="flex justify-between items-center p-4 bg-slate-800/50 rounded-2xl">
                          <span className="text-gray-400">Account ID</span>
                          <span className="font-semibold text-white font-mono text-sm">{account.uuid}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Devices Tab - Mobile Responsive */}
          {activeTab === 'devices' && (
            <>
              {devicesLoading ? (
                <DevicesSkeleton />
              ) : (
                <div className="space-y-4 md:space-y-6">
                  <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl md:rounded-3xl p-4 md:p-8 border border-gray-700">
                    <h2 className="text-lg md:text-2xl font-bold mb-1 md:mb-2">Manage Devices</h2>
                    <p className="text-xs md:text-base text-gray-400 mb-4 md:mb-6">View and manage devices that have access to your account</p>

                    {devices.length === 0 ? (
                      <div className="text-center py-8 md:py-12">
                        <Smartphone size={isMobile ? 40 : 48} className="mx-auto text-gray-600 mb-3 md:mb-4" />
                        <p className="text-sm md:text-base text-gray-400">No devices found</p>
                        {registeringDevice && (
                          <p className="text-xs md:text-sm text-blue-400 mt-2">Registering this device...</p>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-3 md:space-y-4">
                        {devices.map((device) => (
                          <div
                            key={device.uuid}
                            className={`p-3 md:p-6 rounded-xl md:rounded-2xl border-2 transition-all ${
                              device.is_current
                                ? 'bg-blue-500/10 border-blue-500/50'
                                : 'bg-slate-800/50 border-gray-700 hover:border-gray-600'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex gap-2 md:gap-4 flex-1 min-w-0">
                                <div className={`p-2 md:p-3 rounded-lg md:rounded-xl flex-shrink-0 ${device.is_current ? 'bg-blue-500/20' : 'bg-slate-700'}`}>
                                  {getDeviceIcon(device.device_type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <h3 className="font-semibold text-sm md:text-lg truncate">{device.device_name}</h3>
                                    {device.is_current && (
                                      <span className="px-1.5 md:px-2 py-0.5 md:py-1 bg-blue-500 text-white text-[10px] md:text-xs font-bold rounded-full whitespace-nowrap">
                                        {isMobile ? 'CURRENT' : 'THIS DEVICE'}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs md:text-sm text-gray-400 mb-0.5 md:mb-1 truncate">
                                    {device.os_name} {device.os_version}{!isMobile && ` • ${device.browser_name || device.device_type}`}
                                  </p>
                                  <p className="text-[10px] md:text-xs text-gray-500">
                                    {isMobile ? format(new Date(device.last_used_at), 'MMM d, yyyy') : `Last used: ${format(new Date(device.last_used_at), 'MMM d, yyyy h:mm a')}`}
                                  </p>
                                  {!isMobile && <p className="text-xs text-gray-500">IP: {device.ip_address}</p>}
                                </div>
                              </div>

                              {!device.is_current && (
                                <button
                                  onClick={() => setDeviceToRemove(device.uuid)}
                                  className="p-1.5 md:p-2 text-red-400 hover:bg-red-500/20 rounded-lg md:rounded-xl transition-all flex-shrink-0"
                                  title="Remove device"
                                >
                                  <Trash2 size={isMobile ? 16 : 20} />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Subscription Tab - Mobile Responsive */}
          {activeTab === 'subscription' && (
            <>
              {subscriptionLoading ? (
                <SubscriptionSkeleton />
              ) : !subscription ? (
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl md:rounded-3xl p-6 md:p-12 border border-gray-700 text-center">
                  <Crown size={isMobile ? 48 : 64} className="mx-auto text-gray-600 mb-3 md:mb-4" />
                  <h3 className="text-xl md:text-2xl font-bold mb-2">No Active Subscription</h3>
                  <p className="text-sm md:text-base text-gray-400 mb-4 md:mb-6">Subscribe to unlock unlimited streaming</p>
                  <button
                    onClick={() => router.push('/pricing')}
                    className="px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-full text-sm md:text-lg font-semibold shadow-lg transition-all hover:scale-105"
                  >
                    View Plans
                  </button>
                </div>
              ) : (
                <div className="space-y-4 md:space-y-6">
                  {/* Current Plan - Mobile Responsive */}
                  <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-2 border-blue-500/50 rounded-2xl md:rounded-3xl p-4 md:p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <Crown className="w-8 h-8 text-blue-400" />
                          <h2 className="text-3xl font-bold">{subscription.package?.title || subscription.package_title}</h2>
                        </div>
                        <p className="text-gray-300">{subscription.package?.description}</p>
                      </div>
                      {getStatusBadge(subscription.status)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="p-4 bg-slate-900/50 rounded-2xl">
                        <p className="text-sm text-gray-400 mb-1">Billing Cycle</p>
                        <p className="text-2xl font-bold capitalize">{subscription.billing_cycle}</p>
                      </div>

                      <div className="p-4 bg-slate-900/50 rounded-2xl">
                        <p className="text-sm text-gray-400 mb-1">Current Price</p>
                        <p className="text-2xl font-bold">
                          ${subscription.billing_cycle === 'monthly' 
                            ? subscription.package?.price_monthly || subscription.price_monthly 
                            : subscription.package?.price_yearly || subscription.price_yearly}
                          <span className="text-sm text-gray-400">/{subscription.billing_cycle === 'monthly' ? 'mo' : 'yr'}</span>
                        </p>
                      </div>

                      <div className="p-4 bg-slate-900/50 rounded-2xl">
                        <p className="text-sm text-gray-400 mb-1">Next Billing Date</p>
                        <p className="text-lg font-bold">
                          {format(new Date(subscription.current_period_end), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>

                    {subscription.is_trial && (
                      <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-2xl mb-4">
                        <p className="text-sm text-blue-400">
                          ✨ Free trial - Enjoy {subscription.package?.trial_days} days of premium content
                        </p>
                      </div>
                    )}

                    <div className="flex gap-4">
                      <button
                        onClick={() => router.push('/pricing')}
                        className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-2xl font-semibold transition-all hover:scale-105"
                      >
                        Upgrade Plan
                      </button>
                      {subscription.cancelled_at ? (
                        <button
                          onClick={handleRenewSubscription}
                          className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-2xl font-semibold transition-all hover:scale-105"
                        >
                          Renew Subscription
                        </button>
                      ) : null}
                    </div>
                  </div>

                  {/* Available Packages */}
                  {packages && packages.length > 0 && (
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 border border-gray-700">
                      <h2 className="text-2xl font-bold mb-6">Available Plans</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {packages.map((pkg: Package) => (
                          <div
                            key={pkg.id}
                            className={`p-6 rounded-2xl border-2 transition-all ${
                              subscription.package_id === pkg.id
                                ? 'bg-blue-500/10 border-blue-500'
                                : 'bg-slate-800/50 border-gray-700 hover:border-gray-600'
                            }`}
                          >
                            <h3 className="text-xl font-bold mb-2">{pkg.title}</h3>
                            <p className="text-sm text-gray-400 mb-4">{pkg.description}</p>
                            <div className="space-y-2 mb-4">
                              <p className="text-2xl font-bold">
                                ${pkg.price_monthly}
                                <span className="text-sm text-gray-400">/mo</span>
                              </p>
                              <p className="text-sm text-gray-400">
                                or ${pkg.price_yearly}/yr
                              </p>
                            </div>
                            <ul className="space-y-2 text-sm">
                              {pkg.features.map((feature, idx) => (
                                <li key={idx} className="flex items-center gap-2">
                                  <span className="text-green-400">✓</span>
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Billing Information */}
                  <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 border border-gray-700">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                      <CreditCard className="w-6 h-6 text-blue-400" />
                      Billing Information
                    </h2>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-4 bg-slate-800/50 rounded-2xl">
                        <span className="text-gray-400">Subscription Started</span>
                        <span className="font-semibold text-white">
                          {format(new Date(subscription.started_at), 'MMMM d, yyyy')}
                        </span>
                      </div>

                      <div className="flex justify-between items-center p-4 bg-slate-800/50 rounded-2xl">
                        <span className="text-gray-400">Plan Type</span>
                        <span className="font-semibold text-white uppercase">
                          {subscription.package?.key || subscription.package_key}
                        </span>
                      </div>

                      <div className="flex justify-between items-center p-4 bg-slate-800/50 rounded-2xl">
                        <span className="text-gray-400">Max Profiles</span>
                        <span className="font-semibold text-white">
                          {subscription.package?.max_profiles} profiles
                        </span>
                      </div>
                    </div>

                    {subscription.status === 'active' && !subscription.cancelled_at && (
                      <div className="mt-6">
                        <button
                          onClick={() => setShowCancelDialog(true)}
                          className="w-full px-6 py-3 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/50 rounded-2xl font-semibold transition-all"
                        >
                          Cancel Subscription
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </Container>

      {/* Remove Device Dialog */}
      {deviceToRemove && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl max-w-md w-full p-8 shadow-2xl border border-red-500/30">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={32} className="text-red-500" />
            </div>

            <h2 className="text-2xl font-bold text-center mb-3">Remove Device?</h2>
            <p className="text-gray-400 text-center mb-6">
              This device will be logged out and removed from your account.
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => setDeviceToRemove(null)}
                className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-2xl font-semibold transition-all hover:scale-105"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRemoveDevice(deviceToRemove)}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-2xl font-semibold transition-all hover:scale-105"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Subscription Dialog */}
      {showCancelDialog && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl max-w-md w-full p-8 shadow-2xl border border-red-500/30">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={32} className="text-red-500" />
            </div>

            <h2 className="text-2xl font-bold text-center mb-3">Cancel Subscription?</h2>
            <p className="text-gray-400 text-center mb-6">
              You'll lose access to premium content at the end of your current billing period.
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => setShowCancelDialog(false)}
                className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-2xl font-semibold transition-all hover:scale-105"
              >
                Keep Subscription
              </button>
              <button
                onClick={handleCancelSubscription}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-2xl font-semibold transition-all hover:scale-105"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditProfile && user && (
        <EditProfileModal
          user={user}
          onClose={() => setShowEditProfile(false)}
          onSave={handleUpdateProfile}
          loading={false}
        />
      )}
    </MainLayout>
  )
}
