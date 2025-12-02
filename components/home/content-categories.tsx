"use client"

import Image from "next/image"
import { Play } from "lucide-react"
import Link from "next/link"

const categories = [
  {
    title: "Zim Celebs Lifestyle",
    description: "Behind the scenes with your favorite Zimbabwean celebrities",
    image: "/african-celebrity-lifestyle-glamour-red-carpet-zim.jpg",
    tag: "EXCLUSIVE",
    size: "large",
  },
  {
    title: "Local Dramas & Movies",
    description: "Authentic African storytelling that speaks to your soul",
    image: "/african-drama-movie-scene-emotional-storytelling.jpg",
    tag: "POPULAR",
    size: "medium",
  },
  {
    title: "Skits & Comedy",
    description: "Laugh out loud with the funniest African comedy content",
    image: "/african-comedy-skit-funny-comedians-laughing.jpg",
    tag: "TRENDING",
    size: "medium",
  },
  {
    title: "Afrimation",
    description: "African cartoons and animation for the whole family",
    image: "/african-cartoon-animation-colorful-characters-kids.jpg",
    tag: "FAMILY",
    size: "medium",
  },
  {
    title: "Real Estate",
    description: "Property tours, investment tips, and dream homes",
    image: "/luxury-african-real-estate-modern-house-property-t.jpg",
    tag: "NEW",
    size: "medium",
  },
  {
    title: "HD Streaming",
    description: "Crystal clear quality on every screen, every time",
    image: "/4k-hd-streaming-television-cinematic-quality.jpg",
    tag: "4K READY",
    size: "large",
  },
]

export function ContentCategories() {
  return (
    <section className="relative py-24 bg-gradient-to-b from-blue-950 to-blue-900 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 mb-4 text-xs font-semibold uppercase tracking-wider text-blue-300 bg-blue-500/20 rounded-full border border-blue-500/30">
            Explore Content
          </span>
          <h2 className="text-4xl font-bold text-white sm:text-5xl mb-4 text-balance">
            What's{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Streaming
            </span>
          </h2>
          <p className="text-lg text-blue-200 max-w-2xl mx-auto text-pretty">
            From lifestyle to laughs, dramas to dreams — discover content that celebrates African culture
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {categories.map((category, index) => (
            <div
              key={index}
              className={`group relative overflow-hidden rounded-3xl cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/20 ${index === 0 || index === 5 ? "md:col-span-2 lg:col-span-1 lg:row-span-2" : ""
                }`}
            >
              {/* Background Image */}
              <div className="relative aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[280px]">
                <Image
                  src={category.image || "/placeholder.svg"}
                  alt={category.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                {/* Tag Badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-blue-500 text-white rounded-full shadow-lg">
                    {category.tag}
                  </span>
                </div>

                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-100 scale-75">
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                    <Play className="w-6 h-6 text-white fill-white ml-1" />
                  </div>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl lg:text-2xl font-bold text-white mb-2 group-hover:text-blue-200 transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-sm text-white/70 leading-relaxed line-clamp-2 group-hover:text-white/90 transition-colors">
                    {category.description}
                  </p>

                  {/* Watch Now Link */}
                  <Link className="mt-4 flex items-center gap-2 text-blue-400 font-medium text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
                    href={"/browse"}>
                    <span>Browse Category</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
