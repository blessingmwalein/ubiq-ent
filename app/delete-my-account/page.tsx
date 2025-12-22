"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Trash2, Shield, Database, Clock, CheckCircle, Mail, Phone } from "lucide-react"

export default function DeleteAccountPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-red-950 via-red-900 to-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-red-950 via-red-950/90 to-transparent">
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
                  className="rounded-full text-red-100 hover:text-white hover:bg-white/10"
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
        <div className="absolute inset-0 bg-gradient-to-b from-red-950/50 to-transparent" />
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 px-5 py-2">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <span className="text-sm font-bold text-red-300 uppercase tracking-wide">Account Deletion</span>
            </div>

            <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
              <span className="block">Delete Your</span>
              <span className="block bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
                UBIQ Account
              </span>
            </h1>

            <p className="mx-auto mb-4 max-w-3xl text-xl leading-relaxed text-red-100">
              We're sorry to see you go. Learn about what happens when you delete your account and how to proceed.
            </p>
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/30 p-8 lg:p-10">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-8 w-8 text-red-400" />
              </div>
              <div>
                <h2 className="mb-3 text-2xl font-bold text-white">Important: This Action is Permanent</h2>
                <p className="text-red-100 leading-relaxed">
                  Once you delete your account, there is no going back. Please be certain before proceeding with 
                  account deletion. All your data will be permanently removed from our systems.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Gets Deleted */}
      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-3xl font-bold text-white text-center">What Gets Deleted</h2>
          
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20 p-6">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20">
                <Trash2 className="h-6 w-6 text-red-400" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-white">Personal Information</h3>
              <ul className="space-y-2 text-red-100 text-sm">
                <li>• Your name, email, and profile details</li>
                <li>• Account credentials and login information</li>
                <li>• Payment and billing information</li>
                <li>• Contact preferences</li>
              </ul>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border border-orange-500/20 p-6">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/20">
                <Database className="h-6 w-6 text-orange-400" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-white">Viewing Data</h3>
              <ul className="space-y-2 text-red-100 text-sm">
                <li>• Watch history and progress</li>
                <li>• My List and favorites</li>
                <li>• Viewing preferences</li>
                <li>• Ratings and reviews</li>
              </ul>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 p-6">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/20">
                <Shield className="h-6 w-6 text-yellow-400" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-white">Subscription Data</h3>
              <ul className="space-y-2 text-red-100 text-sm">
                <li>• Active subscription (will be cancelled)</li>
                <li>• Subscription history</li>
                <li>• Payment methods</li>
                <li>• Billing records</li>
              </ul>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-amber-500/10 to-red-500/10 border border-amber-500/20 p-6">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/20">
                <Clock className="h-6 w-6 text-amber-400" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-white">Activity Logs</h3>
              <ul className="space-y-2 text-red-100 text-sm">
                <li>• Login history and sessions</li>
                <li>• Device information</li>
                <li>• Search history</li>
                <li>• App usage data</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Deletion Process */}
      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-red-500/5 to-orange-500/5 border border-red-500/20 p-8 lg:p-10">
            <h2 className="mb-6 text-3xl font-bold text-white">Account Deletion Process</h2>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/20 text-red-400 font-bold">
                    1
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-bold text-white">Submit Deletion Request</h3>
                  <p className="text-red-100 leading-relaxed">
                    Contact our support team via email or phone to request account deletion. You'll need to verify 
                    your identity for security purposes.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/20 text-orange-400 font-bold">
                    2
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-bold text-white">Verification</h3>
                  <p className="text-red-100 leading-relaxed">
                    We'll send you a verification email to confirm your identity and ensure the request is legitimate. 
                    Click the link in the email to proceed.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/20 text-yellow-400 font-bold">
                    3
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-bold text-white">Grace Period</h3>
                  <p className="text-red-100 leading-relaxed">
                    Your account will be deactivated immediately, but we'll keep your data for 30 days in case you 
                    change your mind. You can reactivate during this period.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20 text-green-400 font-bold">
                    4
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-bold text-white">Permanent Deletion</h3>
                  <p className="text-red-100 leading-relaxed">
                    After 30 days, all your data will be permanently deleted from our systems. This action cannot 
                    be undone.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Before You Go */}
      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 p-8 lg:p-10">
            <h2 className="mb-4 text-3xl font-bold text-white">Before You Go...</h2>
            <div className="space-y-4 text-blue-100 leading-relaxed">
              <p>
                Consider these alternatives to deleting your account:
              </p>
              <ul className="ml-6 space-y-2 list-disc">
                <li>
                  <strong className="text-white">Pause Your Subscription:</strong> Take a break without losing your 
                  watch history and preferences
                </li>
                <li>
                  <strong className="text-white">Adjust Privacy Settings:</strong> Control what data we collect and 
                  how we use it
                </li>
                <li>
                  <strong className="text-white">Update Email Preferences:</strong> Reduce or stop marketing emails 
                  while keeping your account
                </li>
                <li>
                  <strong className="text-white">Contact Support:</strong> Let us know if there's an issue we can help 
                  resolve
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Data Retention */}
      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-red-500/5 to-orange-500/5 border border-red-500/20 p-8 lg:p-10">
            <h2 className="mb-4 text-3xl font-bold text-white">Data Retention Policy</h2>
            <div className="space-y-4 text-red-100 leading-relaxed">
              <p>
                After you delete your account:
              </p>
              <ul className="ml-6 space-y-2 list-disc">
                <li>
                  <strong className="text-white">Immediate:</strong> Your account is deactivated and you can no longer 
                  access our services
                </li>
                <li>
                  <strong className="text-white">30-Day Grace Period:</strong> Your data is retained but inaccessible. 
                  You can reactivate your account during this time
                </li>
                <li>
                  <strong className="text-white">After 30 Days:</strong> All personal data is permanently deleted from 
                  our active systems
                </li>
                <li>
                  <strong className="text-white">Legal Requirements:</strong> Some data may be retained for longer 
                  periods if required by law (e.g., financial records for tax purposes)
                </li>
                <li>
                  <strong className="text-white">Anonymized Data:</strong> Aggregated, anonymized usage statistics may 
                  be retained for analytics purposes
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 p-8 lg:p-10">
            <h2 className="mb-4 text-3xl font-bold text-white">Request Account Deletion</h2>
            <div className="space-y-4 text-green-100 leading-relaxed">
              <p>
                To delete your account, please contact our support team using one of the following methods:
              </p>
              <div className="space-y-3 mt-6">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                  <Mail className="h-6 w-6 text-green-400 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-white">Email Support</p>
                    <a 
                      href="mailto:support@ubiqent.com?subject=Account%20Deletion%20Request" 
                      className="text-green-400 hover:text-green-300 underline"
                    >
                      support@ubiqent.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                  <Phone className="h-6 w-6 text-green-400 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-white">Phone Support</p>
                    <a 
                      href="tel:+263772440088" 
                      className="text-green-400 hover:text-green-300"
                    >
                      +263 772 440 088
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                <p className="text-sm text-yellow-100">
                  <strong className="text-white">Note:</strong> Please include your registered email address and 
                  account username in your deletion request. You may be asked to verify your identity for security purposes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-3xl font-bold text-white text-center">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <div className="rounded-2xl bg-gradient-to-br from-red-500/5 to-orange-500/5 border border-red-500/20 p-6">
              <h3 className="mb-2 text-lg font-bold text-white">Can I reactivate my account after deletion?</h3>
              <p className="text-red-100 text-sm leading-relaxed">
                Yes, but only within the 30-day grace period. After 30 days, your data is permanently deleted and 
                cannot be recovered.
              </p>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-red-500/5 to-orange-500/5 border border-red-500/20 p-6">
              <h3 className="mb-2 text-lg font-bold text-white">Will I receive a refund for my subscription?</h3>
              <p className="text-red-100 text-sm leading-relaxed">
                Refunds are handled on a case-by-case basis according to our refund policy. Please contact support 
                to discuss your specific situation.
              </p>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-red-500/5 to-orange-500/5 border border-red-500/20 p-6">
              <h3 className="mb-2 text-lg font-bold text-white">How long does the deletion process take?</h3>
              <p className="text-red-100 text-sm leading-relaxed">
                Your account is deactivated immediately upon request. Complete data deletion occurs after the 30-day 
                grace period.
              </p>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-red-500/5 to-orange-500/5 border border-red-500/20 p-6">
              <h3 className="mb-2 text-lg font-bold text-white">Can I download my data before deletion?</h3>
              <p className="text-red-100 text-sm leading-relaxed">
                Yes, you can request a copy of your data before deleting your account. Contact support to request 
                a data export.
              </p>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-red-500/5 to-orange-500/5 border border-red-500/20 p-6">
              <h3 className="mb-2 text-lg font-bold text-white">What happens to my active subscription?</h3>
              <p className="text-red-100 text-sm leading-relaxed">
                Your subscription will be cancelled immediately when your account is deleted. You will not be charged 
                for any future billing cycles.
              </p>
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

            <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-red-200">
              <Link href="/about" className="transition-colors hover:text-white">
                About Us
              </Link>
              <Link href="/contact" className="transition-colors hover:text-white">
                Contact
              </Link>
              <Link href="/privacy" className="transition-colors hover:text-white">
                Privacy Policy
              </Link>
              <Link href="/delete-my-account" className="transition-colors hover:text-white">
                Delete Account
              </Link>
            </nav>

            <p className="text-sm text-red-200">© 2025 UBIQ Entertainment</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
