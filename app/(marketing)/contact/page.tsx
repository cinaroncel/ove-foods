'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import ReCAPTCHA from 'react-google-recaptcha'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ContactBlockGrid } from '@/components/blocks/contact-block'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAnalytics } from '@/lib/analytics'
import { getLocations } from '@/lib/cms/data-provider'
import type { Location } from '@/lib/cms/types'

// Form validation schema
const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  company: z.string().optional(),
  topic: z.enum(['general', 'wholesale', 'media', 'sustainability', 'careers']),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000),
  honeypot: z.string().max(0).optional(), // Bot detection
})

type ContactFormData = z.infer<typeof contactFormSchema>

const topicOptions = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'wholesale', label: 'Wholesale & Distribution' },
  { value: 'media', label: 'Media & Press' },
  { value: 'sustainability', label: 'Sustainability' },
  { value: 'careers', label: 'Careers' },
]

export default function ContactPage() {
  const [locations, setLocations] = React.useState<Location[]>([])
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [submitStatus, setSubmitStatus] = React.useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })
  const [recaptchaToken, setRecaptchaToken] = React.useState<string | null>(null)
  
  const analytics = useAnalytics()
  const recaptchaRef = React.useRef<ReCAPTCHA>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema)
  })

  // Load locations
  React.useEffect(() => {
    async function loadLocations() {
      try {
        const locationsData = await getLocations()
        setLocations(locationsData)
      } catch (error) {
        console.error('Error loading locations:', error)
      }
    }
    loadLocations()
  }, [])

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: '' })

    // Check if reCAPTCHA is completed
    if (!recaptchaToken) {
      setSubmitStatus({
        type: 'error',
        message: 'Please complete the reCAPTCHA verification.'
      })
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...data, recaptchaToken }),
      })

      const result = await response.json()

      if (result.success) {
        setSubmitStatus({
          type: 'success',
          message: result.message || 'Thank you for your message!'
        })
        analytics.contactSubmit({ topic: data.topic })
        reset()
        setRecaptchaToken(null)
        recaptchaRef.current?.reset()
      } else {
        setSubmitStatus({
          type: 'error',
          message: result.error || 'Something went wrong. Please try again.'
        })
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Network error. Please check your connection and try again.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-muted/20 py-12">
        <div className="container mx-auto container-padding">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">Get in Touch</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="section-padding">
        <div className="container mx-auto container-padding">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {/* Honeypot field - hidden from users */}
                  <input
                    {...register('honeypot')}
                    type="text"
                    className="sr-only"
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">
                        Name *
                      </label>
                      <Input
                        id="name"
                        {...register('name')}
                        className={errors.name ? 'border-red-500' : ''}
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Email *
                      </label>
                      <Input
                        id="email"
                        type="email"
                        {...register('email')}
                        className={errors.email ? 'border-red-500' : ''}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium mb-2">
                        Phone
                      </label>
                      <Input
                        id="phone"
                        type="tel"
                        {...register('phone')}
                      />
                    </div>

                    <div>
                      <label htmlFor="company" className="block text-sm font-medium mb-2">
                        Company
                      </label>
                      <Input
                        id="company"
                        {...register('company')}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="topic" className="block text-sm font-medium mb-2">
                      Topic *
                    </label>
                    <select
                      id="topic"
                      {...register('topic')}
                      className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    >
                      <option value="">Select a topic</option>
                      {topicOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {errors.topic && (
                      <p className="text-red-500 text-sm mt-1">{errors.topic.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      Message *
                    </label>
                    <Textarea
                      id="message"
                      rows={6}
                      {...register('message')}
                      className={errors.message ? 'border-red-500' : ''}
                      placeholder="Tell us how we can help you..."
                    />
                    {errors.message && (
                      <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                    )}
                  </div>

                  {/* reCAPTCHA */}
                  <div>
                    {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY !== 'your_recaptcha_site_key_here' ? (
                      <ReCAPTCHA
                        ref={recaptchaRef}
                        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                        onChange={(token) => setRecaptchaToken(token)}
                        onExpired={() => setRecaptchaToken(null)}
                        onError={() => setRecaptchaToken(null)}
                      />
                    ) : (
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                        <p className="text-sm text-yellow-800">
                          reCAPTCHA is not configured. Please set up your reCAPTCHA keys in the environment variables.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Submit Status */}
                  {submitStatus.type && (
                    <div
                      className={`p-3 rounded-md ${
                        submitStatus.type === 'success'
                          ? 'bg-green-50 text-green-800 border border-green-200'
                          : 'bg-red-50 text-red-800 border border-red-200'
                      }`}
                      role="alert"
                      aria-live="polite"
                    >
                      {submitStatus.message}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>

                  <p className="text-xs text-muted-foreground">
                    * Required fields. We'll never share your information with third parties.
                  </p>
                </form>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">Other Ways to Reach Us</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">General Inquiries</h3>
                    <p className="text-muted-foreground">info@ovefoods.com</p>
                    <p className="text-muted-foreground">(555) 123-4567</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold">Wholesale & Distribution</h3>
                    <p className="text-muted-foreground">wholesale@ovefoods.com</p>
                    <p className="text-muted-foreground">(555) 123-4568</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold">Media & Press</h3>
                    <p className="text-muted-foreground">press@ovefoods.com</p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Business Hours</h2>
                <div className="space-y-2 text-muted-foreground">
                  <p>Monday - Friday: 9:00 AM - 6:00 PM PST</p>
                  <p>Saturday: 10:00 AM - 4:00 PM PST</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Locations */}
      {locations.length > 0 && (
        <section className="section-padding bg-muted/20">
          <div className="container mx-auto container-padding">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Our Locations
              </h2>
              <p className="text-lg text-muted-foreground">
                Visit us at our facilities around the world.
              </p>
            </div>
            
            <ContactBlockGrid locations={locations} />
          </div>
        </section>
      )}
    </div>
  )
}
