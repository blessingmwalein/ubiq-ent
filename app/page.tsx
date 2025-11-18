'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/layout'
import Footer from '@/components/layout/Footer'
import { Play, Monitor, Smartphone, Tablet, Tv, Check, Sparkles } from 'lucide-react'

export default function LandingPage() {
  const freeFeatures = [
    'Unlimited movies and shows',
    'Watch on any device',
    'HD video quality',
    'Create multiple profiles',
    'No ads, no commitments',
    'New content weekly',
    'African stories & global content',
    'Cancel anytime'
  ]

  const devices = [
    { icon: Monitor, name: 'Desktop', description: 'Watch on your computer' },
    { icon: Smartphone, name: 'Mobile', description: 'Stream on your phone' },
    { icon: Tablet, name: 'Tablet', description: 'Enjoy on your tablet' },
    { icon: Tv, name: 'Smart TV', description: 'Big screen experience' }
  ]

  const features = [
    {
      title: 'African Stories',
      description: 'Discover authentic African narratives from across the continent, celebrating our rich cultures and diverse voices.',
      image: '/images/feature-stories.jpg'
    },
    {
      title: 'Global Content',
      description: 'Access a vast library of international movies, series, and documentaries from around the world.',
      image: '/images/feature-global.jpg'
    },
    {
      title: 'Original Productions',
      description: 'Exclusive UBIQ Originals featuring award-winning African creators and storytellers.',
      image: '/images/feature-originals.jpg'
    },
    {
      title: 'Live Events',
      description: 'Stream live concerts, sports, and cultural events as they happen across Africa.',
      image: '/images/feature-live.jpg'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 via-blue-900 to-black text-blue-100">
      {/* Header/Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm">
        <Container>
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/logo.png"
                alt="UBIQ Entertainment"
                width={120}
                height={40}
                className="h-10 w-auto"
                priority
              />
            </Link>

            {/* Auth Buttons */}
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost" size="default" className="text-blue-100 hover:text-white">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button size="default">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        {/* Background Image/Video Overlay */}
        <div className="absolute inset-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-blue-950/50 to-transparent" />

        <Container className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Unlimited African Stories
          </h1>
          <p className="text-xl md:text-2xl text-blue-200 mb-8 max-w-3xl mx-auto">
            Stream thousands of movies, series, and documentaries. Watch anywhere. Cancel anytime.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="text-lg px-8 py-6 w-full sm:w-auto">
                <Play className="w-5 h-5 mr-2" />
                Start Watching Now
              </Button>
            </Link>
            <Link href="/browse">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6 w-full sm:w-auto">
                Browse Content
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-black/30">
        <Container>
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-white">
            What You'll Love
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900/50 to-black/50 border border-blue-800/30 p-8 hover:border-blue-600/50 transition-all duration-300"
              >
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-blue-300 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-blue-200 text-lg leading-relaxed">
                    {feature.description}
                  </p>
                </div>
                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Devices Section */}
      <section className="py-24 bg-gradient-to-b from-black/30 to-blue-950/30">
        <Container>
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-6 text-white">
            Watch Everywhere
          </h2>
          <p className="text-xl text-blue-200 text-center mb-16 max-w-2xl mx-auto">
            Stream on your favorite devices. Seamless experience across all screens.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {devices.map((device, index) => (
              <div
                key={index}
                className="flex flex-col items-center p-8 rounded-2xl bg-black/40 border border-blue-800/30 hover:border-blue-600/50 hover:bg-blue-900/20 transition-all duration-300 group"
              >
                <device.icon className="w-16 h-16 mb-4 text-blue-400 group-hover:text-blue-300 transition-colors" />
                <h3 className="text-xl font-semibold mb-2 text-white">{device.name}</h3>
                <p className="text-sm text-blue-300 text-center">{device.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Free Streaming Section */}
      <section className="py-24 bg-black/30">
        <Container>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-full mb-6">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <span className="text-sm font-semibold text-green-200">Limited Time Offer</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Stream for <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">Free</span>
            </h2>
            <p className="text-xl text-blue-200 max-w-2xl mx-auto">
              Enjoy unlimited entertainment at no cost. No credit card required.
            </p>
          </div>

          {/* Free Plan Card */}
          <div className="max-w-2xl mx-auto">
            <div className="relative rounded-3xl p-12 border-2 bg-gradient-to-br from-blue-900/60 to-purple-900/60 border-blue-500 shadow-2xl shadow-blue-500/30">
              {/* Badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-bold px-8 py-2 rounded-full shadow-lg animate-pulse">
                🎉 Free for Starters
              </div>

              <div className="text-center mb-8">
                <h3 className="text-3xl md:text-4xl font-bold mb-3 text-white">
                  UBIQ Entertainment
                </h3>
                <p className="text-lg text-blue-300 mb-6">
                  Premium streaming experience, absolutely free
                </p>
                <div className="flex items-center justify-center gap-3 mb-6">
                  <span className="text-7xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                    $0
                  </span>
                  <div className="text-left">
                    <div className="text-2xl font-bold text-white">Forever</div>
                    <div className="text-sm text-blue-300">No hidden fees</div>
                  </div>
                </div>
              </div>

              {/* Features List */}
              <ul className="space-y-4 mb-8 max-w-md mx-auto">
                {freeFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                      <Check className="w-4 h-4 text-green-400" />
                    </div>
                    <span className="text-blue-100 text-base font-medium">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Link href="/register" className="block">
                <Button
                  size="lg"
                  className="w-full text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white shadow-lg shadow-green-500/30 transition-all duration-300 hover:scale-105 py-6"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Start Watching Free
                </Button>
              </Link>

              <p className="text-center text-sm text-blue-300/70 mt-4">
                No credit card required • Instant access • Cancel anytime
              </p>
            </div>
          </div>

          {/* Info Cards */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="text-center p-6 rounded-xl bg-black/20 border border-blue-800/30">
              <div className="text-4xl mb-3">🎬</div>
              <h3 className="text-lg font-bold text-white mb-2">Unlimited Content</h3>
              <p className="text-sm text-blue-300">
                Access thousands of movies, shows, and originals
              </p>
            </div>
            <div className="text-center p-6 rounded-xl bg-black/20 border border-blue-800/30">
              <div className="text-4xl mb-3">📱</div>
              <h3 className="text-lg font-bold text-white mb-2">Any Device</h3>
              <p className="text-sm text-blue-300">
                Watch on phone, tablet, laptop, and TV
              </p>
            </div>
            <div className="text-center p-6 rounded-xl bg-black/20 border border-blue-800/30">
              <div className="text-4xl mb-3">🚀</div>
              <h3 className="text-lg font-bold text-white mb-2">Instant Access</h3>
              <p className="text-sm text-blue-300">
                No waiting, start streaming immediately
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-900/40 to-purple-900/40">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-blue-200 mb-8">
              Join thousands of viewers enjoying the best of African and global entertainment completely free
            </p>
            <Link href="/register">
              <Button size="lg" className="text-lg px-10 py-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500">
                <Play className="w-5 h-5 mr-2" />
                Get Started Free
              </Button>
            </Link>
            <p className="text-sm text-blue-300/70 mt-4">
              No credit card required • 100% Free • Instant access
            </p>
          </div>
        </Container>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
