'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X, Search, Bell, User, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { logout } from '@/store/slices/authSlice'
import { useScrollDirection } from '@/lib/hooks'
import MobileNav from './MobileNav'

const navigation = [
  { name: 'Home', href: '/browse' },
  { name: 'Movies', href: '/movies' },
  { name: 'TV Shows', href: '/shows' },
  { name: 'Skits', href: '/skits' },
  { name: 'Afrimations', href: '/afrimation' },
  { name: 'Real Estate', href: '/real-estate' },
  { name: 'New & Popular', href: '/new' },
  { name: 'My List', href: '/my-list' },
]

export default function Header() {
  const pathname = usePathname()
  const dispatch = useAppDispatch()
  const { user, isAuthenticated } = useAppSelector((state) => state.auth)
  const { selectedProfile } = useAppSelector((state) => state.profiles)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const scrollDirection = useScrollDirection()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-blue-950/95 backdrop-blur-md shadow-lg'
            : 'bg-gradient-to-b from-black/60 to-transparent',
          // Hide header on mobile when scrolling down, but keep visible on desktop
          scrollDirection === 'down' && isScrolled && 'max-lg:-translate-y-full'
        )}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 md:h-16 lg:h-20">
            {/* Left: Mobile Menu + Logo */}
            <div className="flex items-center gap-3 md:gap-4 lg:gap-8">
              {/* Mobile Hamburger Menu */}
              <div className="lg:hidden">
                <MobileNav showHamburger={true} />
              </div>

              {/* Logo */}
              <Link href="/browse" className="flex-shrink-0">
                <Image
                  src="/logo.png"
                  alt="UBIQ Entertainment"
                  width={120}
                  height={35}
                  className="h-6 sm:h-7 md:h-8 lg:h-10 w-auto"
                  priority
                />
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center space-x-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'text-sm font-medium transition-colors hover:text-white',
                      pathname === item.href
                        ? 'text-white'
                        : 'text-blue-200/80'
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
              {/* Search Icon - Hidden on mobile (in bottom nav) */}
              <Link
                href="/search"
                className="hidden sm:block text-blue-200 hover:text-white transition-colors"
              >
                <Search className="w-5 h-5" />
              </Link>

              {/* Notifications */}
              {isAuthenticated && (
                <button className="hidden sm:block text-blue-200 hover:text-white transition-colors relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                </button>
              )}

              {/* Profile Menu */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors"
                  >
                    <div className="w-8 h-8 rounded-md bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                      {selectedProfile?.name?.[0] || user?.name?.[0] || 'U'}
                    </div>
                    <ChevronDown className="w-4 h-4 hidden md:block" />
                  </button>

                  {/* Profile Dropdown */}
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-black/95 backdrop-blur-xl border border-zinc-800 rounded-md shadow-xl py-2 z-50">
                      <div className="px-4 py-2 border-b border-zinc-800">
                        <p className="text-sm font-medium text-white">
                          {selectedProfile?.name || user?.name}
                        </p>
                        <p className="text-xs text-zinc-400">{user?.email}</p>
                      </div>
                      <Link
                        href="/profiles"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                      >
                        Switch Profile
                      </Link>
                      <Link
                        href="/account"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                      >
                        Account Settings
                      </Link>
                      <Link
                        href="/subscribe"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                      >
                        Subscription
                      </Link>
                      <div className="border-t border-zinc-800 mt-2 pt-2">
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="text-sm font-medium text-white hover:text-blue-200 transition-colors"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </>
  )
}
