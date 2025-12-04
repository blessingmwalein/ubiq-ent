"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, Sparkles } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsSubmitting(false)
    setSubmitStatus("success")
    setFormData({ name: "", email: "", subject: "", message: "" })
    
    // Reset success message after 5 seconds
    setTimeout(() => setSubmitStatus("idle"), 5000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-950 via-blue-900 to-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-blue-950 via-blue-950/90 to-transparent">
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
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 px-5 py-2">
              <Sparkles className="h-4 w-4 text-green-400" />
              <span className="text-sm font-bold text-green-300 uppercase tracking-wide">Get In Touch</span>
            </div>

            <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
              <span className="block">We'd Love to</span>
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Hear From You
              </span>
            </h1>

            <p className="mx-auto mb-10 max-w-3xl text-xl leading-relaxed text-blue-100">
              Have questions, feedback, or partnership inquiries? Our team is here to help. 
              Reach out and we'll get back to you as soon as possible.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Contact Information */}
            <div>
              <h2 className="mb-8 text-3xl font-bold text-white">Contact Information</h2>
              
              <div className="space-y-6">
                {/* Email */}
                <div className="flex items-start gap-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 p-6">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-500/20">
                    <Mail className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-bold text-white">Email Us</h3>
                    <a 
                      href="mailto:support@ubiqent.com" 
                      className="text-blue-300 hover:text-blue-200 transition-colors"
                    >
                      support@ubiqent.com
                    </a>
                    <p className="mt-2 text-sm text-blue-200">
                      For general inquiries and support
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 p-6">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-purple-500/20">
                    <Phone className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-bold text-white">Call Us</h3>
                    <a 
                      href="tel:+263772440088" 
                      className="text-blue-300 hover:text-blue-200 transition-colors"
                    >
                      +263 772 440 088
                    </a>
                    <p className="mt-2 text-sm text-blue-200">
                      Available Monday - Friday
                    </p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-4 rounded-2xl bg-gradient-to-br from-pink-500/10 to-red-500/10 border border-pink-500/20 p-6">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-pink-500/20">
                    <Clock className="h-6 w-6 text-pink-400" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-bold text-white">Business Hours</h3>
                    <div className="space-y-1 text-blue-200">
                      <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
                      <p>Saturday: 9:00 AM - 2:00 PM</p>
                      <p>Sunday: Closed</p>
                    </div>
                  </div>
                </div>

                {/* Response Time */}
                <div className="flex items-start gap-4 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 p-6">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-500/20">
                    <MessageSquare className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-bold text-white">Response Time</h3>
                    <p className="text-blue-200">
                      We typically respond within 24 hours during business days
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <div className="rounded-3xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 border border-blue-500/20 p-8 lg:p-10">
                <h2 className="mb-6 text-3xl font-bold text-white">Send Us a Message</h2>

                {submitStatus === "success" && (
                  <div className="mb-6 rounded-xl bg-green-500/10 border border-green-500/30 p-4">
                    <p className="text-green-300 font-semibold">
                      ✓ Message sent successfully! We'll get back to you soon.
                    </p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="mb-2 block text-sm font-semibold text-blue-100">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-blue-500/30 bg-blue-950/30 px-4 py-3 text-white placeholder:text-blue-300/50 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-semibold text-blue-100">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-blue-500/30 bg-blue-950/30 px-4 py-3 text-white placeholder:text-blue-300/50 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="mb-2 block text-sm font-semibold text-blue-100">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-blue-500/30 bg-blue-950/30 px-4 py-3 text-white placeholder:text-blue-300/50 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                      placeholder="How can we help?"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="mb-2 block text-sm font-semibold text-blue-100">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full rounded-xl border border-blue-500/30 bg-blue-950/30 px-4 py-3 text-white placeholder:text-blue-300/50 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 resize-none"
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-400 hover:to-purple-500 shadow-xl shadow-blue-500/30 transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-background py-12">
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
