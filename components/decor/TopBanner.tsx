'use client'

import { Linkedin, Instagram, MapPin } from 'lucide-react'

export function TopBanner() {
  return (
    <div className="relative bg-light-surface dark:bg-dark-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between py-3 gap-4">
          {/* Social Media Icons */}
          <div className="flex items-center gap-3">
            <a
              href="https://www.linkedin.com/company/jayshree-furnish/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full border-2 border-light-text dark:border-dark-text flex items-center justify-center text-light-text dark:text-dark-text hover:bg-light-border dark:hover:bg-dark-border transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={16} />
            </a>
            <a
              href="https://maps.app.goo.gl/VrxNYVy8YM83Z8Ym8"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full border-2 border-light-text dark:border-dark-text flex items-center justify-center text-light-text dark:text-dark-text hover:bg-light-border dark:hover:bg-dark-border transition-colors"
              aria-label="Location on Google Maps"
            >
              <MapPin size={16} />
            </a>
            <a
              href="https://www.instagram.com/js_furnish/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full border-2 border-light-text dark:border-dark-text flex items-center justify-center text-light-text dark:text-dark-text hover:bg-light-border dark:hover:bg-dark-border transition-colors"
              aria-label="Instagram"
            >
              <Instagram size={16} />
            </a>
          </div>

          {/* Contact Text */}
          <div className="text-light-text dark:text-dark-text text-sm sm:text-base text-center sm:text-left">
            Call <a href="tel:+919811627334" className="hover:underline text-light-accent dark:text-dark-accent">+91 9811627334</a> For All Sales Inquiries
          </div>
        </div>
      </div>
    </div>
  )
}

