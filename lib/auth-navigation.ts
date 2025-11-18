import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

/**
 * Auth Navigation Helper
 * Determines where to redirect user after login/register based on their state
 */

interface User {
  id: number
  name: string
  email: string
  onboarding_completed: boolean
  email_verified_at: string | null
}

interface Account {
  id: number
  user_id: number
  package_id: number | null
  account_name: string
  status: string // Can be 'active' | 'inactive' | 'suspended' | 'expired' | 'cancelled'
  subscription_start?: string
  subscription_end?: string
}

interface AuthData {
  user: User
  account: Account | null
  token: string
}

export const determineAuthRedirect = (authData: AuthData): string => {
  const { user, account } = authData

  // Priority 1: Check if onboarding is completed
  if (!user.onboarding_completed) {
    return '/onboarding'
  }

  // Priority 2: Check if user has an account/subscription
  if (!account || !account.package_id) {
    return '/subscribe'
  }

  // Priority 3: Check account status
  const inactiveStatuses = ['inactive', 'suspended', 'expired', 'cancelled']
  if (inactiveStatuses.includes(account.status)) {
    return '/subscribe'
  }

  // Priority 4: User has active subscription - check profiles
  // This will be handled by the profiles page itself
  return '/profiles'
}

/**
 * Navigate user after authentication based on their state
 */
export const navigateAfterAuth = (
  router: AppRouterInstance,
  authData: AuthData,
  context: 'login' | 'register' = 'login'
) => {
  const redirectPath = determineAuthRedirect(authData)
  
  console.log(`Auth Navigation [${context}]:`, {
    user: authData.user.email,
    onboarding: authData.user.onboarding_completed,
    hasAccount: !!authData.account,
    packageId: authData.account?.package_id,
    accountStatus: authData.account?.status,
    redirectTo: redirectPath,
  })

  router.push(redirectPath)
}

/**
 * Check if user can access protected routes
 */
export const canAccessProtectedRoute = (
  user: User | null,
  account: Account | null,
  route: string
): { canAccess: boolean; redirectTo?: string } => {
  // Not authenticated
  if (!user) {
    return { canAccess: false, redirectTo: '/login' }
  }

  // Routes that require onboarding completion
  const onboardingRequiredRoutes = ['/browse', '/content', '/watch', '/search', '/profiles']
  const requiresOnboarding = onboardingRequiredRoutes.some(r => route.startsWith(r))
  
  if (requiresOnboarding && !user.onboarding_completed) {
    return { canAccess: false, redirectTo: '/onboarding' }
  }

  // Routes that require active subscription (browse, content, watch, search)
  const subscriptionRequiredRoutes = ['/browse', '/content', '/watch', '/search']
  const requiresSubscription = subscriptionRequiredRoutes.some(r => route.startsWith(r))
  
  if (requiresSubscription) {
    // Check if user has account and package
    if (!account || !account.package_id) {
      return { canAccess: false, redirectTo: '/subscribe' }
    }

    // Check account status
    const inactiveStatuses = ['inactive', 'suspended', 'expired', 'cancelled']
    if (inactiveStatuses.includes(account.status)) {
      return { canAccess: false, redirectTo: '/subscribe' }
    }
  }

  // All checks passed
  return { canAccess: true }
}
