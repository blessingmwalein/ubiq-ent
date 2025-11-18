'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Film, Tv, Laugh, Heart, Search, User, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { useAppSelector } from '@/store/hooks'

const mainNavItems = [
  { name: 'Home', href: '/browse', icon: Home },
  { name: 'Movies', href: '/movies', icon: Film },
  { name: 'Shows', href: '/shows', icon: Tv },
  { name: 'Search', href: '/search', icon: Search },
  { name: 'My List', href: '/my-list', icon: Heart },
]

const secondaryNavItems = [
  { name: 'Skits', href: '/skits', icon: Laugh },
  { name: 'Afrimations', href: '/afrimation', icon: Heart },
  { name: 'Real Estate', href: '/real-estate', icon: Home },
  { name: 'New & Popular', href: '/new', icon: Film },
  { name: 'Profile', href: '/profiles', icon: User },
  { name: 'Account', href: '/account', icon: User },
]

interface MobileNavProps {
  showHamburger?: boolean // For header
}

export default function MobileNav({ showHamburger = false }: MobileNavProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const { selectedProfile } = useAppSelector((state) => state.profiles)

  return (
    <>
      {/* Hamburger Menu Button - For Header */}
      {showHamburger && (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-white hover:bg-white/10"
            >
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent 
            side="left" 
            className="w-[280px] bg-black/98 backdrop-blur-xl border-r border-white/10 text-white z-[70]"
          >
            <SheetHeader>
              <SheetTitle className="text-left text-white">
                {selectedProfile ? (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-lg font-bold">
                      {selectedProfile.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Watching as</div>
                      <div className="font-semibold">{selectedProfile.name}</div>
                    </div>
                  </div>
                ) : (
                  'Menu'
                )}
              </SheetTitle>
            </SheetHeader>

            <div className="mt-8 space-y-6">
              {/* Main Navigation */}
              <div className="space-y-1">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mb-3">
                  Main
                </div>
                {mainNavItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-300 hover:bg-white/5 active:bg-white/10'
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  )
                })}
              </div>

              {/* Secondary Navigation */}
              <div className="space-y-1">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mb-3">
                  More
                </div>
                {secondaryNavItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-300 hover:bg-white/5 active:bg-white/10'
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}

      {/* Bottom Navigation Bar - Fixed with higher z-index */}
      <nav className="fixed bottom-0 left-0 right-0 z-[60] lg:hidden bg-black/95 backdrop-blur-lg border-t border-white/10 pb-safe">
        <div className="grid grid-cols-5 h-16">
          {mainNavItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 transition-colors',
                  isActive
                    ? 'text-blue-400'
                    : 'text-gray-400 active:text-white'
                )}
              >
                <Icon className="w-6 h-6" />
                <span className="text-[10px] font-medium">{item.name}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
