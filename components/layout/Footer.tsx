import Link from 'next/link'
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react'

const footerLinks = {
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Privacy Policy', href: '/privacy' },

  ],
 
  content: [
    { name: 'Browse All', href: '/browse' },
    { name: 'Movies', href: '/movies' },
    { name: 'TV Shows', href: '/shows' },
    { name: 'Skits', href: '/skits' },
  ],
}

const socialLinks = [
  { name: 'Facebook', icon: Facebook, href: '#' },
  { name: 'Twitter', icon: Twitter, href: '#' },
  { name: 'Instagram', icon: Instagram, href: '#' },
  { name: 'YouTube', icon: Youtube, href: '#' },
]

export default function Footer() {
  return (
    <footer className="bg-black/50 border-t border-blue-900/30 mt-auto">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Social Links */}
        <div className="flex justify-center gap-6 mb-8">
          {socialLinks.map((social) => {
            const Icon = social.icon
            return (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-300 hover:text-white transition-colors"
                aria-label={social.name}
              >
                <Icon className="w-6 h-6" />
              </a>
            )
          })}
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-blue-300/80 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          

          {/* Content */}
          <div>
            <h3 className="text-white font-semibold mb-4">Content</h3>
            <ul className="space-y-2">
              {footerLinks.content.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-blue-300/80 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-semibold mb-4">Stay Updated</h3>
            <p className="text-sm text-blue-300/80 mb-4">
              Subscribe to our newsletter for the latest updates
            </p>
            <Link
              href="/"
              className="inline-block text-sm text-blue-400 hover:text-white font-medium hover:underline transition-colors"
            >
              Subscribe →
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-blue-900/30">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-blue-300/60">
              &copy; {new Date().getFullYear()} UBIQ Entertainment. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm text-blue-300/60">
              <button className="hover:text-white transition-colors">
                Language: English
              </button>
              <span>|</span>
              <button className="hover:text-white transition-colors">
                Region: Global
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
