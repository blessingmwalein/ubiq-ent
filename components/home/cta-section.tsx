"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Play, ArrowRight } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-b from-blue-950 to-background relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent" />

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Ready to Start{" "}
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Watching?</span>
        </h2>
        <p className="mb-10 text-xl text-blue-200 max-w-2xl mx-auto">
          Join thousands streaming the best African entertainment for free. No credit card, no commitment.
        </p>
        <Link href="/register">
          <Button
            size="lg"
            className="h-16 gap-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-12 text-xl font-bold text-white hover:from-blue-400 hover:to-purple-500 shadow-xl shadow-blue-500/30 transition-all hover:scale-105"
          >
            <Play className="h-6 w-6 fill-current" />
            Join Free Now
            <ArrowRight className="h-5 w-5" />
          </Button>
        </Link>
        <p className="mt-6 text-blue">Instant access • HD streaming • All devices</p>
      </div>
    </section>
  )
}
