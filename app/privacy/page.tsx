"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Shield, Lock, Eye, UserCheck, Database, Globe, Sparkles } from "lucide-react"

export default function PrivacyPage() {
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
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 px-5 py-2">
              <Shield className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-bold text-blue-300 uppercase tracking-wide">Privacy Policy</span>
            </div>

            <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
              <span className="block">Your Privacy</span>
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Matters to Us
              </span>
            </h1>

            <p className="mx-auto mb-4 max-w-3xl text-xl leading-relaxed text-blue-100">
              We are committed to protecting your privacy and ensuring the security of your personal information.
            </p>
            <p className="text-sm text-blue-300">Last Updated: December 4, 2025</p>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 p-6 text-center">
              <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20">
                <Shield className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="font-bold text-white">Secure Platform</h3>
              <p className="mt-2 text-sm text-blue-200">Industry-standard security</p>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 p-6 text-center">
              <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/20">
                <Lock className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="font-bold text-white">Data Encryption</h3>
              <p className="mt-2 text-sm text-blue-200">Your data is encrypted</p>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-pink-500/10 to-red-500/10 border border-pink-500/20 p-6 text-center">
              <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-pink-500/20">
                <Eye className="h-6 w-6 text-pink-400" />
              </div>
              <h3 className="font-bold text-white">Transparency</h3>
              <p className="mt-2 text-sm text-blue-200">Clear data practices</p>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 p-6 text-center">
              <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20">
                <UserCheck className="h-6 w-6 text-green-400" />
              </div>
              <h3 className="font-bold text-white">Your Control</h3>
              <p className="mt-2 text-sm text-blue-200">You own your data</p>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {/* Introduction */}
            <div className="rounded-3xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 border border-blue-500/20 p-8 lg:p-10">
              <h2 className="mb-4 text-3xl font-bold text-white">Introduction</h2>
              <div className="space-y-4 text-blue-100 leading-relaxed">
                <p>
                  Welcome to UBIQ Entertainment ("we," "our," or "us"). This Privacy Policy explains how we collect, 
                  use, disclose, and safeguard your information when you visit our streaming platform and use our services.
                </p>
                <p>
                  Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, 
                  please do not access the site or use our services.
                </p>
              </div>
            </div>

            {/* Information We Collect */}
            <div className="rounded-3xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 border border-blue-500/20 p-8 lg:p-10">
              <h2 className="mb-6 text-3xl font-bold text-white">Information We Collect</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="mb-3 text-xl font-bold text-white flex items-center gap-2">
                    <Database className="h-5 w-5 text-blue-400" />
                    Personal Information
                  </h3>
                  <p className="text-blue-100 leading-relaxed">
                    When you register for an account, we may collect personal information including but not limited to:
                  </p>
                  <ul className="mt-3 ml-6 space-y-2 text-blue-100 list-disc">
                    <li>Name and email address</li>
                    <li>Username and password</li>
                    <li>Profile information and preferences</li>
                    <li>Payment information (processed securely by third-party payment processors)</li>
                    <li>Communication preferences</li>
                  </ul>
                </div>

                <div>
                  <h3 className="mb-3 text-xl font-bold text-white flex items-center gap-2">
                    <Globe className="h-5 w-5 text-purple-400" />
                    Usage Data
                  </h3>
                  <p className="text-blue-100 leading-relaxed">
                    We automatically collect certain information when you use our platform:
                  </p>
                  <ul className="mt-3 ml-6 space-y-2 text-blue-100 list-disc">
                    <li>Device information (type, operating system, browser)</li>
                    <li>IP address and location data</li>
                    <li>Viewing history and preferences</li>
                    <li>Search queries and interactions</li>
                    <li>Watch time and playback quality</li>
                    <li>Cookies and similar tracking technologies</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* How We Use Your Information */}
            <div className="rounded-3xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 border border-blue-500/20 p-8 lg:p-10">
              <h2 className="mb-4 text-3xl font-bold text-white">How We Use Your Information</h2>
              <div className="space-y-3 text-blue-100 leading-relaxed">
                <p>We use the information we collect to:</p>
                <ul className="ml-6 space-y-2 list-disc">
                  <li>Create and manage your account</li>
                  <li>Provide, maintain, and improve our streaming services</li>
                  <li>Personalize your content recommendations</li>
                  <li>Process transactions and send related information</li>
                  <li>Send you technical notices, updates, and support messages</li>
                  <li>Respond to your comments, questions, and customer service requests</li>
                  <li>Monitor and analyze trends, usage, and activities</li>
                  <li>Detect, prevent, and address technical issues and security threats</li>
                  <li>Comply with legal obligations and enforce our terms</li>
                </ul>
              </div>
            </div>

            {/* Information Sharing */}
            <div className="rounded-3xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 border border-blue-500/20 p-8 lg:p-10">
              <h2 className="mb-4 text-3xl font-bold text-white">Information Sharing and Disclosure</h2>
              <div className="space-y-4 text-blue-100 leading-relaxed">
                <p>We may share your information in the following situations:</p>
                <ul className="ml-6 space-y-2 list-disc">
                  <li>
                    <strong className="text-white">Service Providers:</strong> We share information with third-party vendors 
                    who perform services on our behalf (payment processing, analytics, customer support)
                  </li>
                  <li>
                    <strong className="text-white">Legal Requirements:</strong> We may disclose information if required by 
                    law or in response to valid legal requests
                  </li>
                  <li>
                    <strong className="text-white">Business Transfers:</strong> In connection with any merger, sale of 
                    company assets, or acquisition
                  </li>
                  <li>
                    <strong className="text-white">With Your Consent:</strong> We may share information for any other 
                    purpose with your consent
                  </li>
                </ul>
                <p className="mt-4">
                  <strong className="text-white">We do not sell your personal information to third parties.</strong>
                </p>
              </div>
            </div>

            {/* Data Security */}
            <div className="rounded-3xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 border border-blue-500/20 p-8 lg:p-10">
              <h2 className="mb-4 text-3xl font-bold text-white">Data Security</h2>
              <div className="space-y-4 text-blue-100 leading-relaxed">
                <p>
                  We implement appropriate technical and organizational security measures to protect your personal 
                  information against unauthorized access, alteration, disclosure, or destruction. These measures include:
                </p>
                <ul className="ml-6 space-y-2 list-disc">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security assessments and updates</li>
                  <li>Restricted access to personal information</li>
                  <li>Secure authentication mechanisms</li>
                  <li>Regular backups and disaster recovery procedures</li>
                </ul>
                <p className="mt-4">
                  However, no method of transmission over the Internet or electronic storage is 100% secure. While we 
                  strive to use commercially acceptable means to protect your information, we cannot guarantee absolute security.
                </p>
              </div>
            </div>

            {/* Your Rights */}
            <div className="rounded-3xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 border border-blue-500/20 p-8 lg:p-10">
              <h2 className="mb-4 text-3xl font-bold text-white">Your Privacy Rights</h2>
              <div className="space-y-4 text-blue-100 leading-relaxed">
                <p>You have the following rights regarding your personal information:</p>
                <ul className="ml-6 space-y-2 list-disc">
                  <li><strong className="text-white">Access:</strong> Request access to your personal information</li>
                  <li><strong className="text-white">Correction:</strong> Request correction of inaccurate information</li>
                  <li><strong className="text-white">Deletion:</strong> Request deletion of your personal information</li>
                  <li><strong className="text-white">Portability:</strong> Request a copy of your data in a portable format</li>
                  <li><strong className="text-white">Opt-out:</strong> Opt out of marketing communications at any time</li>
                  <li><strong className="text-white">Objection:</strong> Object to processing of your personal information</li>
                </ul>
                <p className="mt-4">
                  To exercise these rights, please contact us at{" "}
                  <a href="mailto:support@ubiqent.com" className="text-blue-400 hover:text-blue-300 underline">
                    support@ubiqent.com
                  </a>
                </p>
              </div>
            </div>

            {/* Cookies */}
            <div className="rounded-3xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 border border-blue-500/20 p-8 lg:p-10">
              <h2 className="mb-4 text-3xl font-bold text-white">Cookies and Tracking Technologies</h2>
              <div className="space-y-4 text-blue-100 leading-relaxed">
                <p>
                  We use cookies and similar tracking technologies to track activity on our platform and store certain 
                  information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                </p>
                <p>
                  Types of cookies we use:
                </p>
                <ul className="ml-6 space-y-2 list-disc">
                  <li><strong className="text-white">Essential Cookies:</strong> Required for the platform to function</li>
                  <li><strong className="text-white">Preference Cookies:</strong> Remember your settings and preferences</li>
                  <li><strong className="text-white">Analytics Cookies:</strong> Help us understand how you use our platform</li>
                  <li><strong className="text-white">Marketing Cookies:</strong> Track your activity to show relevant ads</li>
                </ul>
              </div>
            </div>

            {/* Children's Privacy */}
            <div className="rounded-3xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 border border-blue-500/20 p-8 lg:p-10">
              <h2 className="mb-4 text-3xl font-bold text-white">Children's Privacy</h2>
              <div className="space-y-4 text-blue-100 leading-relaxed">
                <p>
                  Our services are not intended for children under the age of 13. We do not knowingly collect personal 
                  information from children under 13. If you are a parent or guardian and believe your child has provided 
                  us with personal information, please contact us.
                </p>
              </div>
            </div>

            {/* Third-Party Links */}
            <div className="rounded-3xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 border border-blue-500/20 p-8 lg:p-10">
              <h2 className="mb-4 text-3xl font-bold text-white">Third-Party Links</h2>
              <div className="space-y-4 text-blue-100 leading-relaxed">
                <p>
                  Our platform may contain links to third-party websites. We are not responsible for the privacy practices 
                  or content of these external sites. We encourage you to review the privacy policies of any third-party 
                  sites you visit.
                </p>
              </div>
            </div>

            {/* Data Retention */}
            <div className="rounded-3xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 border border-blue-500/20 p-8 lg:p-10">
              <h2 className="mb-4 text-3xl font-bold text-white">Data Retention</h2>
              <div className="space-y-4 text-blue-100 leading-relaxed">
                <p>
                  We retain your personal information for as long as necessary to fulfill the purposes outlined in this 
                  privacy policy, unless a longer retention period is required or permitted by law. When we no longer need 
                  your information, we will securely delete or anonymize it.
                </p>
              </div>
            </div>

            {/* International Transfers */}
            <div className="rounded-3xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 border border-blue-500/20 p-8 lg:p-10">
              <h2 className="mb-4 text-3xl font-bold text-white">International Data Transfers</h2>
              <div className="space-y-4 text-blue-100 leading-relaxed">
                <p>
                  Your information may be transferred to and processed in countries other than your country of residence. 
                  These countries may have data protection laws that are different from the laws of your country. We take 
                  steps to ensure that your information receives an adequate level of protection.
                </p>
              </div>
            </div>

            {/* Changes to Policy */}
            <div className="rounded-3xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 border border-blue-500/20 p-8 lg:p-10">
              <h2 className="mb-4 text-3xl font-bold text-white">Changes to This Privacy Policy</h2>
              <div className="space-y-4 text-blue-100 leading-relaxed">
                <p>
                  We may update our Privacy Policy from time to time. We will notify you of any changes by posting the 
                  new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this 
                  Privacy Policy periodically for any changes.
                </p>
              </div>
            </div>

            {/* Contact */}
            <div className="rounded-3xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 p-8 lg:p-10">
              <h2 className="mb-4 text-3xl font-bold text-white">Contact Us</h2>
              <div className="space-y-4 text-blue-100 leading-relaxed">
                <p>
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="space-y-2 mt-4">
                  <p className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-green-400" />
                    <strong className="text-white">Email:</strong>{" "}
                    <a href="mailto:support@ubiqent.com" className="text-blue-400 hover:text-blue-300 underline">
                      support@ubiqent.com
                    </a>
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-green-400" />
                    <strong className="text-white">Phone:</strong>{" "}
                    <a href="tel:+263772440088" className="text-blue-400 hover:text-blue-300">
                      +263 772 440 088
                    </a>
                  </p>
                </div>
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
