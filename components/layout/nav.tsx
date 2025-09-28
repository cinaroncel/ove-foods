'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navigationItems = [
  {
    label: 'About Us',
    href: '/our-story'
  },
  {
    label: 'Products',
    href: '/products',
    children: [
      { 
        label: 'Olive Oil', 
        href: '/categories/olive-oils',
        children: [
          { label: 'Organic Extra Virgin Olive Oil', href: '/categories/organic-extra-virgin-olive-oil' },
          { label: 'Extra Virgin Olive Oil', href: '/categories/extra-virgin-olive-oil' },
          { label: 'Pure Olive Oil', href: '/categories/pure-olive-oil' },
          { label: 'Infused Olive Oils', href: '/categories/infused-olive-oils' },
        ]
      },
      { label: 'Vinegars', href: '/categories/vinegars' },
      { label: 'Specialty Products', href: '/categories/specialty' },
      { label: 'Honey', href: '/categories/honey' },
      { label: 'Seasoning', href: '/categories/seasoning' },
      { label: 'Gourmet Products', href: '/categories/gourmet-products' },
    ]
  },
  {
    label: 'Recipes',
    href: '/recipes'
  },
  {
    label: 'Certifications',
    href: '/certifications'
  },
  {
    label: 'Sustainability',
    href: '/sustainability'
  }
]

export function Nav() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [activeDropdown, setActiveDropdown] = React.useState<string | null>(null)
  const pathname = usePathname()

  // Close mobile menu when route changes
  React.useEffect(() => {
    setIsOpen(false)
    setActiveDropdown(null)
  }, [pathname])

  // Handle escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
        setActiveDropdown(null)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  const toggleDropdown = (label: string) => {
    setActiveDropdown(activeDropdown === label ? null : label)
  }

  const isActivePath = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex h-20 items-center justify-between px-4" role="navigation" aria-label="Main navigation">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 focus-visible-ring">
          <Image
            src="/ovelogonet.png"
            alt="OVE Foods"
            width={150}
            height={50}
            priority
            className="h-[64px] w-auto md:h-[64px]"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:space-x-20">
          {navigationItems.map((item) => (
            <div key={item.label} className="relative">
              {item.children ? (
                <div className="group">
                  <Link
                    href={item.href as any}
                    className={cn(
                      "flex items-center space-x-1 text-lg font-medium transition-colors hover:text-primary focus-visible-ring",
                      isActivePath(item.href) ? "text-primary" : "text-foreground"
                    )}
                    onMouseEnter={() => setActiveDropdown(item.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <span>{item.label}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Link>

                  <AnimatePresence>
                    {activeDropdown === item.label && (
                      <motion.div
                        id={`dropdown-${item.label}`}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 top-full mt-2 w-48 rounded-md border bg-popover p-1 shadow-md"
                        onMouseEnter={() => setActiveDropdown(item.label)}
                        onMouseLeave={() => setActiveDropdown(null)}
                      >
                        {/* All Categories link at top */}
                        <Link
                          href={item.href as any}
                          className="block rounded-sm px-3 py-2 text-sm font-medium text-primary hover:bg-accent hover:text-accent-foreground focus-visible-ring border-b border-border/50 mb-1"
                        >
                          All Categories
                        </Link>
                        
                        {item.children.map((child) => (
                          <div key={child.href}>
                            {child.children ? (
                              // Category with subcategories (like Olive Oils)
                              <div className="relative group">
                                <Link
                                  href={child.href as any}
                                  className="flex items-center justify-between rounded-sm px-3 py-2 text-lg text-popover-foreground hover:bg-accent hover:text-accent-foreground focus-visible-ring"
                                >
                                  <span>{child.label}</span>
                                  <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
                                </Link>
                                
                                {/* Subcategories dropdown */}
                                <div className="absolute left-full top-0 ml-1 w-64 rounded-md border bg-popover p-1 shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                  {child.children.map((subchild) => (
                                    <Link
                                      key={subchild.href}
                                      href={subchild.href as any}
                                      className="block rounded-sm px-3 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground focus-visible-ring"
                                    >
                                      {subchild.label}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              // Regular category link
                              <Link
                                href={child.href as any}
                                className="block rounded-sm px-3 py-2 text-lg text-popover-foreground hover:bg-accent hover:text-accent-foreground focus-visible-ring"
                              >
                                {child.label}
                              </Link>
                            )}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  href={item.href as any}
                  className={cn(
                    "text-lg font-medium transition-colors hover:text-primary focus-visible-ring",
                    isActivePath(item.href) ? "text-primary" : "text-foreground"
                  )}
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden md:flex">
          <Button asChild size="lg" className="text-base px-6 py-3">
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t bg-background md:hidden"
          >
            <div className="container mx-auto px-4 py-4 space-y-4">
              {navigationItems.map((item) => (
                <div key={item.label} className="space-y-2">
                  {item.children ? (
                    <>
                      {/* Direct link to main page */}
                      <Link
                        href={item.href as any}
                        className={cn(
                          "block text-lg font-medium focus-visible-ring py-3 px-2 rounded-md",
                          isActivePath(item.href) ? "text-primary bg-primary/10" : "text-foreground"
                        )}
                      >
                        {item.label} - All Categories
                      </Link>
                      
                      {/* Dropdown toggle button */}
                      <button
                        className="flex w-full items-center justify-between text-left text-base text-muted-foreground focus-visible-ring py-2 px-2 mt-1"
                        onClick={() => toggleDropdown(item.label)}
                        aria-expanded={activeDropdown === item.label}
                      >
                        <span>Browse by Category</span>
                        <ChevronDown 
                          className={cn(
                            "h-4 w-4 transition-transform",
                            activeDropdown === item.label && "rotate-180"
                          )} 
                        />
                      </button>
                      <AnimatePresence>
                        {activeDropdown === item.label && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="ml-4 space-y-3 pt-2"
                          >
                            {item.children.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href as any}
                                className="block text-base text-muted-foreground hover:text-foreground focus-visible-ring py-2 px-2 rounded-md hover:bg-muted/50"
                              >
                                {child.label}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link
                      href={item.href as any}
                      className={cn(
                        "block text-lg font-medium focus-visible-ring",
                        isActivePath(item.href) ? "text-primary" : "text-foreground"
                      )}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
              <div className="pt-4">
                <Button asChild className="w-full" size="lg">
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
