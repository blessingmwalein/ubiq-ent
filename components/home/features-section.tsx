"use client"

import { Monitor, Smartphone, Tablet, Tv, Zap, Shield, Globe } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "100% Free Forever",
    description: "No subscriptions, no hidden fees. Just press play and enjoy.",
  },
  {
    icon: Shield,
    title: "HD Quality",
    description: "Crystal clear streaming on any screen, any time.",
  },
  {
    icon: Globe,
    title: "Stream Anywhere",
    description: "Watch on any device, wherever you are in the world.",
  },
]

const devices = [
  { icon: Smartphone, name: "Phone" },
  { icon: Tablet, name: "Tablet" },
  { icon: Monitor, name: "Desktop" },
  { icon: Tv, name: "Smart TV" },
]

export function FeaturesSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-blue-900 to-blue-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Features Grid */}
        <div className="mb-20 grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-2xl bg-white/5 border border-white/10 p-8 text-center transition-all hover:bg-white/10 hover:border-white/20"
            >
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/30">
                <feature.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-white">{feature.title}</h3>
              <p className="text-blue-200 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Devices */}
        <div className="text-center">
          <h3 className="mb-10 text-3xl font-bold text-white">Watch on Any Device</h3>
          <div className="flex flex-wrap items-center justify-center gap-12">
            {devices.map((device, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-3 text-blue-200 transition-all hover:text-white hover:scale-110"
              >
                <device.icon className="h-12 w-12" />
                <span className="text-sm font-semibold">{device.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
