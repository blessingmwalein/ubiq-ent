import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Cookie keys (must match api-client.ts)
const AUTH_TOKEN_KEY = 'ubiq_auth_token'
const USER_KEY = 'ubiq_user'
const ACCOUNT_KEY = 'ubiq_account'
const PROFILE_KEY = 'ubiq_selected_profile'

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
]

// Routes that require authentication but not onboarding/subscription
const authOnlyRoutes = [
  '/subscribe',
  '/checkout',
  '/onboarding',
]

// Routes that require profile selection
const profileRequiredRoutes = [
  '/browse',
  '/movies',
  '/shows',
  '/new',
  '/my-list',
  '/content',
  '/watch',
  '/search',
  '/skits',
  '/afrimation',
  '/real-estate',
]

// Routes that require authentication but not profile
const authButNoProfileRoutes = [
  '/profiles',
  '/account',
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  console.log('🔐 Middleware triggered for path:', pathname)
  
  // Get auth data from cookies
  const token = request.cookies.get(AUTH_TOKEN_KEY)?.value
  const userCookie = request.cookies.get(USER_KEY)?.value
  const accountCookie = request.cookies.get(ACCOUNT_KEY)?.value
  const profileCookie = request.cookies.get(PROFILE_KEY)?.value
  
  console.log('📝 Auth State:', {
    hasToken: !!token,
    hasUser: !!userCookie,
    hasAccount: !!accountCookie,
    hasProfile: !!profileCookie,
  })
  
  let user = null
  let account = null
  let selectedProfile = null
  
  try {
    if (userCookie) user = JSON.parse(userCookie)
    if (accountCookie) account = JSON.parse(accountCookie)
    if (profileCookie) selectedProfile = JSON.parse(profileCookie)
  } catch (error) {
    console.error('❌ Error parsing cookies:', error)
    // Clear corrupted cookies
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.delete(AUTH_TOKEN_KEY)
    response.cookies.delete(USER_KEY)
    response.cookies.delete(ACCOUNT_KEY)
    response.cookies.delete(PROFILE_KEY)
    return response
  }

  const isAuthenticated = !!(token && user)
  
  // Check route types
  const isPublicRoute = publicRoutes.some(route => pathname === route)
  const isAuthOnlyRoute = authOnlyRoutes.some(route => pathname.startsWith(route))
  const isProfileRequiredRoute = profileRequiredRoutes.some(route => pathname.startsWith(route))
  const isAuthButNoProfileRoute = authButNoProfileRoutes.some(route => pathname.startsWith(route))

  console.log('🎯 Route Analysis:', {
    isPublicRoute,
    isAuthOnlyRoute,
    isProfileRequiredRoute,
    isAuthButNoProfileRoute,
    isAuthenticated,
  })

  // === PUBLIC ROUTES ===
  if (isPublicRoute) {
    // Redirect authenticated users away from login/register
    if (isAuthenticated && (pathname === '/login' || pathname === '/register')) {
      console.log('✅ Authenticated user on auth page, redirecting...')
      
      // Check onboarding
      if (user && !user.onboarding_completed) {
        console.log('➡️  Redirecting to onboarding')
        return NextResponse.redirect(new URL('/onboarding', request.url))
      }
      
      // Check subscription
      // if (!account || !account.package_id) {
      //   console.log('➡️  Redirecting to subscribe (no package)')
      //   return NextResponse.redirect(new URL('/subscribe', request.url))
      // }
      
      const inactiveStatuses = ['inactive', 'suspended', 'expired', 'cancelled']
      // if (account && inactiveStatuses.includes(account.status)) {
      //   console.log('➡️  Redirecting to subscribe (inactive account)')
      //   return NextResponse.redirect(new URL('/subscribe', request.url))
      // }
      
      // Check profile
      if (!selectedProfile) {
        console.log('➡️  Redirecting to profiles (no profile selected)')
        return NextResponse.redirect(new URL('/profiles', request.url))
      }
      
      console.log('➡️  Redirecting to browse')
      return NextResponse.redirect(new URL('/browse', request.url))
    }
    
    console.log('✅ Allowing public route')
    return NextResponse.next()
  }

  // === AUTH-ONLY ROUTES (onboarding, subscribe, checkout) ===
  if (isAuthOnlyRoute) {
    if (!isAuthenticated) {
      console.log('❌ Not authenticated, redirecting to login')
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }
    console.log('✅ Allowing auth-only route')
    return NextResponse.next()
  }

  // === ROUTES REQUIRING AUTH BUT NO PROFILE (/profiles, /account) ===
  if (isAuthButNoProfileRoute) {
    if (!isAuthenticated) {
      console.log('❌ Not authenticated, redirecting to login')
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }
    
    // Check onboarding
    if (user && !user.onboarding_completed) {
      console.log('➡️  Redirecting to onboarding')
      return NextResponse.redirect(new URL('/onboarding', request.url))
    }
    
    // Check subscription (except for /profiles)
    // if (pathname.startsWith('/account')) {
    //   if (!account || !account.package_id) {
    //     console.log('➡️  Redirecting to subscribe (no package)')
    //     return NextResponse.redirect(new URL('/subscribe', request.url))
    //   }
      
    //   const inactiveStatuses = ['inactive', 'suspended', 'expired', 'cancelled']
    //   if (account && inactiveStatuses.includes(account.status)) {
    //     console.log('➡️  Redirecting to subscribe (inactive account)')
    //     return NextResponse.redirect(new URL('/subscribe', request.url))
    //   }
    // }
    
    console.log('✅ Allowing auth route (no profile required)')
    return NextResponse.next()
  }

  // === PROFILE REQUIRED ROUTES (content pages) ===
  if (isProfileRequiredRoute) {
    // Check authentication
    if (!isAuthenticated) {
      console.log('❌ Not authenticated, redirecting to login')
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Check onboarding
    if (user && !user.onboarding_completed) {
      console.log('➡️  Redirecting to onboarding')
      return NextResponse.redirect(new URL('/onboarding', request.url))
    }

    // Check subscription
    // if (!account || !account.package_id) {
    //   console.log('➡️  Redirecting to subscribe (no package)')
    //   return NextResponse.redirect(new URL('/subscribe', request.url))
    // }

    // const inactiveStatuses = ['inactive', 'suspended', 'expired', 'cancelled']
    // if (account && inactiveStatuses.includes(account.status)) {
    //   console.log('➡️  Redirecting to subscribe (inactive account)')
    //   return NextResponse.redirect(new URL('/subscribe', request.url))
    // }

    // Check profile selection
    if (!selectedProfile) {
      console.log('❌ No profile selected, redirecting to profiles')
      return NextResponse.redirect(new URL('/profiles', request.url))
    }

    console.log('✅ All checks passed, allowing access')
    return NextResponse.next()
  }

  // === DEFAULT: Allow unknown routes (will be handled by Next.js 404) ===
  console.log('⚠️  Unknown route, allowing')
  return NextResponse.next()
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|logo.png).*)',
  ],
}
