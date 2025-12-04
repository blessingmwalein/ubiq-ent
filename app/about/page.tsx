"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Play, Users, Globe, Heart, Sparkles, TrendingUp } from "lucide-react"

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-950 via-blue-900 to-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-blue-950 via-blue-950/90 ">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/logo.png"
                alt="UBIQ Entertainment"
                width={120}
                height={35}
                className="h-8 lg:h-10 w-auto"
                priority
              />
            </Link>

            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full text-blue-100 hover:text-white hover:bg-white/10"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="sm"
                  className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-400 hover:to-purple-500 shadow-lg shadow-blue-500/30"
                >
                  Join Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/50 to-transparent" />
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 px-5 py-2">
              <Sparkles className="h-4 w-4 text-purple-400" />
              <span className="text-sm font-bold text-purple-300 uppercase tracking-wide">About UBIQ</span>
            </div>

            <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
              <span className="block">Celebrating</span>
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                African Stories
              </span>
            </h1>

            <p className="mx-auto mb-10 max-w-3xl text-xl leading-relaxed text-blue-100">
              UBIQ Entertainment is Zimbabwe's premier streaming platform, bringing you authentic African content 
              that celebrates our culture, stories, and creativity — all streaming free in HD.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <h2 className="mb-6 text-4xl font-bold text-white">Our Mission</h2>
              <p className="mb-6 text-lg leading-relaxed text-blue-100">
                We're on a mission to showcase the best of African entertainment to the world. From Zimbabwe's 
                celebrity lifestyles to gripping local dramas, hilarious skits, educational Afrimation cartoons, 
                and exciting real estate shows — we bring it all to your screen.
              </p>
              <p className="text-lg leading-relaxed text-blue-100">
                Our platform empowers local creators and gives audiences unlimited access to quality content 
                that reflects our rich cultural heritage and contemporary stories.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 p-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20">
                  <Users className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-white">Community First</h3>
                <p className="text-blue-200">
                  Supporting local creators and bringing communities together through storytelling.
                </p>
              </div>

              <div className="rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 p-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/20">
                  <Globe className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-white">Global Reach</h3>
                <p className="text-blue-200">
                  Sharing African content with audiences across the continent and beyond.
                </p>
              </div>

              <div className="rounded-2xl bg-gradient-to-br from-pink-500/10 to-red-500/10 border border-pink-500/20 p-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-pink-500/20">
                  <Heart className="h-6 w-6 text-pink-400" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-white">Quality Content</h3>
                <p className="text-blue-200">
                  Curated selection of premium shows, movies, and series in stunning HD quality.
                </p>
              </div>

              <div className="rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 p-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20">
                  <TrendingUp className="h-6 w-6 text-green-400" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-white">Always Growing</h3>
                <p className="text-blue-200">
                  New content added regularly to keep you entertained and engaged.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="mb-4 text-4xl font-bold text-white">What We Offer</h2>
            <p className="text-xl text-blue-100">Diverse content for every taste</p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Celebrity Lifestyle",
                description: "Follow Zimbabwe's top celebrities and influencers in exclusive shows.",
                gradient: "from-blue-500/10 to-cyan-500/10",
                border: "border-blue-500/20"
              },
              {
                title: "Local Dramas",
                description: "Captivating stories that reflect our culture and contemporary life.",
                gradient: "from-purple-500/10 to-pink-500/10",
                border: "border-purple-500/20"
              },
              {
                title: "Comedy Skits",
                description: "Laugh out loud with hilarious content from local comedians.",
                gradient: "from-pink-500/10 to-red-500/10",
                border: "border-pink-500/20"
              },
              {
                title: "Afrimation Cartoons",
                description: "Educational and entertaining animation for the whole family.",
                gradient: "from-green-500/10 to-emerald-500/10",
                border: "border-green-500/20"
              },
              {
                title: "Real Estate Shows",
                description: "Explore stunning properties and get insights into the property market.",
                gradient: "from-yellow-500/10 to-orange-500/10",
                border: "border-yellow-500/20"
              },
              {
                title: "And Much More",
                description: "Discover documentaries, music videos, talk shows, and exclusive content.",
                gradient: "from-indigo-500/10 to-purple-500/10",
                border: "border-indigo-500/20"
              }
            ].map((item, index) => (
              <div
                key={index}
                className={`rounded-2xl bg-gradient-to-br ${item.gradient} border ${item.border} p-8 transition-transform hover:scale-105`}
              >
                <h3 className="mb-3 text-2xl font-bold text-white">{item.title}</h3>
                <p className="text-blue-200">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="mb-6 text-4xl font-bold text-white">Ready to Start Watching?</h2>
          <p className="mb-8 text-xl text-blue-100">
            Join thousands of viewers enjoying authentic African entertainment, completely free.
          </p>
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
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10  py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <Link href="/" className="flex items-center">
              <Image src="/logo.png" alt="UBIQ" width={120} height={40} className="h-8 w-auto md:h-10" />
            </Link>

            <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-blue-200">
              <Link href="/about" className="transition-colors hover:text-white">
                About Us
              </Link>
              <Link href="/contact" className="transition-colors hover:text-white">
                Contact
              </Link>
              <Link href="/privacy" className="transition-colors hover:text-white">
                Privacy Policy
              </Link>
            </nav>

            <p className="text-sm text-blue-200">© 2025 UBIQ Entertainment</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
