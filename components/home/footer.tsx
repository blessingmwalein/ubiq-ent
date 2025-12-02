"use client"

import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-background py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <Link href="/" className="flex items-center">
            <Image src="/logo.png" alt="UBIQ" width={120} height={40} className="h-8 w-auto md:h-10" />
          </Link>

          {/* Links */}
          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-blue">
            <Link href="#" className="transition-colors hover:text-white">
              About
            </Link>
            <Link href="#" className="transition-colors hover:text-white">
              Help Center
            </Link>
            <Link href="#" className="transition-colors hover:text-white">
              Terms
            </Link>
            <Link href="#" className="transition-colors hover:text-white">
              Privacy
            </Link>
            <Link href="#" className="transition-colors hover:text-white">
              Contact
            </Link>
          </nav>

          {/* Copyright */}
          <p className="text-sm text-blue">© 2025 UBIQ Entertainment</p>
        </div>
      </div>
    </footer>
  )
}
