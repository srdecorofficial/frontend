'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react'
import { Button } from '@/components/decor/Button'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFeedback(null)

    if (!/^[0-9]{10}$/.test(formData.phone.trim())) {
      setFeedback({ type: 'error', msg: 'Please enter a valid 10-digit phone number.' })
      return
    }

    setSubmitting(true)

    try {
      const res = await fetch(`${API_URL}/api/v1/contact-messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const json = await res.json().catch(() => null)
        throw new Error(json?.error?.message || 'Request failed')
      }

      setFeedback({ type: 'success', msg: "Thank you for your message! We'll get back to you soon." })
      setFormData({ name: '', email: '', phone: '', message: '' })
    } catch (err: any) {
      setFeedback({
        type: 'error',
        msg: err?.message && err.message !== 'Request failed'
          ? err.message
          : 'Could not send your message. Please try again later.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12 text-center"
      >
        <h1 className="font-sans text-4xl md:text-5xl font-bold text-light-text dark:text-dark-text mb-4">
          Get in Touch
        </h1>
        <p className="text-light-textMuted dark:text-dark-textMuted">
          We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-6"
        >
          <div>
            <h2 className="font-sans text-2xl font-semibold text-light-text dark:text-dark-text mb-6">
              Contact Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-light-surface dark:bg-dark-surface">
                  <Mail className="text-light-accent dark:text-dark-accent" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-light-text dark:text-dark-text mb-1">Email</h3>
                  <a href="mailto:contact@jsfurnish.com" className="text-light-textMuted dark:text-dark-textMuted hover:text-light-accent dark:hover:text-dark-accent transition-colors">
                    contact@jsfurnish.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-light-surface dark:bg-dark-surface">
                  <Phone className="text-light-accent dark:text-dark-accent" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-light-text dark:text-dark-text mb-1">Phone</h3>
                  <p className="text-light-textMuted dark:text-dark-textMuted">
                    <a href="tel:+919811627334" className="hover:text-light-accent dark:hover:text-dark-accent transition-colors">
                      +91-9811627334
                    </a>
                    <br />
                    <a href="tel:+919315590584" className="hover:text-light-accent dark:hover:text-dark-accent transition-colors">
                      +91-9315590584
                    </a>
                    <br />
                    <a href="tel:+919315586128" className="hover:text-light-accent dark:hover:text-dark-accent transition-colors">
                      +91-9315586128
                    </a>
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-light-surface dark:bg-dark-surface">
                  <MapPin className="text-light-accent dark:text-dark-accent" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-light-text dark:text-dark-text mb-1">Address</h3>
                  <p className="text-light-textMuted dark:text-dark-textMuted">
                    23/2, Rajendra Market Road, Sikanderpur,<br />
                    DLF Phase 1, Sector 24, Sikanderpur Ghosi,<br />
                    Gurugram, Haryana 122002
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="mt-8">
            <div className="h-64 rounded-2xl overflow-hidden">
              <iframe
                title="JayShree Furnish location"
                src="https://maps.google.com/maps?q=JayShree+Furnish&ll=28.4825084,77.0969886&z=17&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
            <a
              href="https://maps.app.goo.gl/VrxNYVy8YM83Z8Ym8"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 text-sm text-light-accent dark:text-dark-accent hover:underline"
            >
              View on Google Maps →
            </a>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <form onSubmit={handleSubmit} className="bg-light-card dark:bg-dark-card rounded-2xl p-8 space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                Email <span className="text-light-textMuted dark:text-dark-textMuted">(Optional)</span>
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                required
                maxLength={10}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/[^0-9]/g, '') })}
                placeholder="10-digit phone number"
                className="w-full px-4 py-3 rounded-xl bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                Message
              </label>
              <textarea
                id="message"
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent resize-none"
              />
            </div>
            {feedback && (
              <div
                className={`rounded-xl p-4 text-sm ${
                  feedback.type === 'success'
                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200'
                    : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
                }`}
              >
                {feedback.msg}
              </div>
            )}
            <Button type="submit" variant="primary" className="w-full" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 size={18} className="mr-2 shrink-0 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  Send Message
                  <Send size={18} className="ml-2 shrink-0" />
                </>
              )}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}










