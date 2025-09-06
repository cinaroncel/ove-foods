'use client'

export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="skip-link sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:no-underline focus:shadow-lg focus:rounded-md"
    >
      Skip to main content
    </a>
  )
}
