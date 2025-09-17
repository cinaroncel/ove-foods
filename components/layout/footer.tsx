'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Instagram, Twitter, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAnalytics } from '@/lib/analytics'

const footerLinks = {
  products: [
    { label: 'Olive Oils', href: '/products?category=olive-oils' },
    { label: 'Vinegars', href: '/products?category=vinegars' },
    { label: 'Specialty Products', href: '/products?category=specialty' }
  ],
  company: [
    { label: 'Our Story', href: '/our-story' },
    { label: 'Sustainability', href: '/sustainability' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press', href: '/press' }
  ],
  support: [
    { label: 'Contact Us', href: '/contact' },
    { label: 'Recipes', href: '/recipes' },
    { label: 'FAQ', href: '/faq' }
  ],
  legal: [
    { label: 'Privacy Policy', href: '/legal/privacy' },
    { label: 'Terms of Service', href: '/legal/terms' },
    { label: 'Cookie Preferences', href: '/legal/cookies' }
  ]
}

const socialLinks = [
  { label: 'Facebook', href: 'https://facebook.com/ovefoods', icon: Facebook },
  { label: 'Instagram', href: 'https://instagram.com/ovefoods', icon: Instagram },
  { label: 'Twitter', href: 'https://twitter.com/ovefoods', icon: Twitter }
]

const certifications = [
  { label: 'Organic Certified', src: '/assets/certifications/organic.svg' },
  { label: 'Non-GMO', src: '/assets/certifications/non-gmo.svg' },
  { label: 'Fair Trade', src: '/assets/certifications/fair-trade.svg' }
]

export function Footer() {
  const [email, setEmail] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [message, setMessage] = React.useState('')
  const analytics = useAnalytics()

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Newsletter signup logic would go here
      // For now, just simulate success
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      analytics.newsletterSubmit({ source_page: 'footer' })
      setMessage('Thank you for subscribing!')
      setEmail('')
    } catch (error) {
      setMessage('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }

    // Clear message after 3 seconds
    setTimeout(() => setMessage(''), 3000)
  }

  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 py-12">
        {/* Newsletter Section */}
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Stay Connected</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Get the latest recipes, product updates, and exclusive offers delivered to your inbox.
          </p>
          <form onSubmit={handleNewsletterSubmit} className="flex max-w-md mx-auto gap-2">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting}
              aria-label="Email address for newsletter"
            />
            <Button type="submit" disabled={isSubmitting || !email}>
              {isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </Button>
          </form>
          {message && (
            <p className="mt-2 text-sm text-primary" role="status" aria-live="polite">
              {message}
            </p>
          )}
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/assets/logo.png"
                alt="OVE Foods"
                width={150}
                height={50}
                className="h-10 w-auto"
              />
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Premium Mediterranean olive oils, vinegars, and culinary products crafted with passion and tradition.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors focus-visible-ring"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-semibold mb-4">Products</h3>
            <ul className="space-y-2">
              {footerLinks.products.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors focus-visible-ring"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors focus-visible-ring"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors focus-visible-ring"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>1234 Mediterranean Way</p>
              <p>San Francisco, CA 94105</p>
              <p>
                <a 
                  href="tel:+15551234567" 
                  className="hover:text-primary transition-colors focus-visible-ring"
                >
                  (555) 123-4567
                </a>
              </p>
              <p>
                <a 
                  href="mailto:info@ovefoods.com" 
                  className="hover:text-primary transition-colors focus-visible-ring flex items-center gap-1"
                >
                  <Mail className="h-4 w-4" />
                  info@ovefoods.com
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Certifications */}
        <div className="flex flex-wrap items-center justify-center gap-6 mb-8 py-8 border-t">
          {certifications.map((cert) => (
            <div key={cert.label} className="flex items-center gap-2">
              <Image
                src={cert.src}
                alt={cert.label}
                width={32}
                height={32}
                className="h-8 w-8"
              />
              <span className="text-xs text-muted-foreground">{cert.label}</span>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t text-sm text-muted-foreground">
          <p>&copy; 2024 OVE Foods. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-primary transition-colors focus-visible-ring"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
