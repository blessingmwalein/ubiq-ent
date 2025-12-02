"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Play, Sparkles } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/african-celebration-cinema-vibrant-colors-entertai.jpg"
          alt="African entertainment"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950 via-blue-950/90 to-blue-900/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-transparent to-blue-950/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-4 pt-20 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          {/* Free Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 px-5 py-2">
            <Sparkles className="h-4 w-4 text-green-400" />
            <span className="text-sm font-bold text-green-300 uppercase tracking-wide">Stream Free in HD</span>
          </div>

          {/* Title */}
          <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
            <span className="block text-balance">Your Home for</span>
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              African Entertainment
            </span>
          </h1>

          {/* Description */}
          <p className="mb-10 max-w-xl text-xl leading-relaxed text-blue-100">
            Zim celebs lifestyle, local dramas, hilarious skits, Afrimation cartoons, Real Estate shows and more — all
            streaming free in HD.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/register">
              <Button
                size="lg"
                className="h-14 gap-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-10 text-lg font-bold text-white hover:from-blue-400 hover:to-purple-500 shadow-xl shadow-blue-500/30 transition-all hover:scale-105"
              >
                <Play className="h-6 w-6 fill-current" />
                Start Watching — It's Free
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-8 flex items-center gap-6 text-sm text-blue-200">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-400" />
              No credit card
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-400" />
              Instant access
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-400" />
              HD quality
            </span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="h-10 w-6 rounded-full border-2 border-white/30 p-1">
          <div className="h-2 w-1 mx-auto rounded-full bg-white/50 animate-pulse" />
        </div>
      </div>
    </section>
  )
}
