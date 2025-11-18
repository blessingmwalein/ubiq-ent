'use client'

import Header from './Header'
import Footer from './Footer'
import { cn } from '@/lib/utils'

interface MainLayoutProps {
  children: React.ReactNode
  className?: string
  showHeader?: boolean
  showFooter?: boolean
}

export default function MainLayout({
  children,
  className,
  showHeader = true,
  showFooter = true,
}: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 via-blue-900 to-black text-blue-100 flex flex-col">
      {showHeader && <Header />}
      <main className={cn('flex-1 pt-16 md:pt-20', className)}>
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  )
}
