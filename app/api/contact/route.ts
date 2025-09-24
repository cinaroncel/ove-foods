import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'

const contactFormSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  company: z.string().optional(),
  topic: z.enum(['general', 'wholesale', 'media', 'sustainability', 'careers']),
  message: z.string().min(10).max(1000),
  honeypot: z.string().max(0).optional(),
})

const topicLabels = {
  general: 'General Inquiry',
  wholesale: 'Wholesale & Distribution',
  media: 'Media & Press',
  sustainability: 'Sustainability',
  careers: 'Careers',
}

// Initialize Resend only when API key is available
let resend: Resend | null = null
if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 'your_resend_api_key_here') {
  resend = new Resend(process.env.RESEND_API_KEY)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the form data
    const validationResult = contactFormSchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid form data',
          details: validationResult.error.issues
        },
        { status: 400 }
      )
    }

    const { name, email, phone, company, topic, message, honeypot } = validationResult.data

    // Check honeypot field for bot detection
    if (honeypot && honeypot.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid submission' },
        { status: 400 }
      )
    }

    // Prepare email content
    const emailSubject = `New ${topicLabels[topic]} - OVE Foods Contact Form`
    const emailBody = `
New contact form submission from OVE Foods website:

Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}
Company: ${company || 'Not provided'}
Topic: ${topicLabels[topic]}

Message:
${message}

---
This email was sent from the OVE Foods contact form.
Please reply directly to the sender at: ${email}
    `.trim()

    // Send email using Resend
    if (resend) {
      const { data, error } = await resend.emails.send({
        from: 'OVE Foods Contact <onboarding@resend.dev>',
        to: ['hakan@ovefoods.com'],
        subject: emailSubject,
        text: emailBody,
        replyTo: email,
      })

      if (error) {
        console.error('Email sending error:', error)
        return NextResponse.json(
          { 
            success: false, 
            error: 'Failed to send email. Please try again or contact us directly.' 
          },
          { status: 500 }
        )
      }
      
      console.log('Email sent successfully:', data)
    } else {
      // For development/testing without API key - log the email instead
      console.log('=== Contact Form Submission ===')
      console.log('TO: hakan@ovefoods.com')
      console.log('FROM:', email)
      console.log('SUBJECT:', emailSubject)
      console.log('BODY:')
      console.log(emailBody)
      console.log('==============================')
      console.log('Note: Set RESEND_API_KEY in .env.local to actually send emails')
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you for your message! We\'ll get back to you soon.'
    })

  } catch (error) {
    console.error('Contact form error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Something went wrong. Please try again later.' 
      },
      { status: 500 }
    )
  }
}