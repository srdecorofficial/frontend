'use client'

import Link from 'next/link'
import { Linkedin, Instagram, MapPin, Mail, Phone } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-[#052A22] border-t border-[#1a5c48] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo.svg" alt="JayShree Furnish" className="h-14 w-auto" />
              <span className="font-sans text-xl font-bold text-[#bf9b23] tracking-wide">JayShree Furnish</span>
            </div>
            <p className="text-sm text-[#a8b8b3]">
              Elegant home décor for your living spaces. Premium quality, timeless design.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-[#bf9b23] mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-[#a8b8b3] hover:text-[#bf9b23] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-sm text-[#a8b8b3] hover:text-[#bf9b23] transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-[#a8b8b3] hover:text-[#bf9b23] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-[#bf9b23] mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products?category=Curtains" className="text-sm text-[#a8b8b3] hover:text-[#bf9b23] transition-colors">
                  Curtains
                </Link>
              </li>
              <li>
                <Link href="/products?category=Curtain Rods" className="text-sm text-[#a8b8b3] hover:text-[#bf9b23] transition-colors">
                  Curtain Rods
                </Link>
              </li>
              <li>
                <Link href="/products?category=Curtain Channels" className="text-sm text-[#a8b8b3] hover:text-[#bf9b23] transition-colors">
                  Curtain Channels
                </Link>
              </li>
              <li>
                <Link href="/products?category=Artefacts" className="text-sm text-[#a8b8b3] hover:text-[#bf9b23] transition-colors">
                  Artefacts
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-[#bf9b23] mb-4">Get in Touch</h3>
            <ul className="space-y-3 mb-5 text-sm text-[#a8b8b3]">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="shrink-0 mt-0.5 text-[#bf9b23]" />
                <span>
                  23/2, Rajendra Market Road, Sikanderpur, DLF Phase 1, Sector 24, Sikanderpur Ghosi, Gurugram, Haryana 122002
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Phone size={16} className="shrink-0 mt-0.5 text-[#bf9b23]" />
                <span className="flex flex-col">
                  <a href="tel:+919811627334" className="hover:text-[#bf9b23] transition-colors">+91-9811627334</a>
                  <a href="tel:+919315590584" className="hover:text-[#bf9b23] transition-colors">+91-9315590584</a>
                  <a href="tel:+919315586128" className="hover:text-[#bf9b23] transition-colors">+91-9315586128</a>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Mail size={16} className="shrink-0 mt-0.5 text-[#bf9b23]" />
                <a href="mailto:contact@jsfurnish.com" className="hover:text-[#bf9b23] transition-colors">
                  contact@jsfurnish.com
                </a>
              </li>
            </ul>
            <div className="flex gap-4">
              <a
                href="https://www.linkedin.com/company/jayshree-furnish/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-[#a8b8b3] hover:text-[#bf9b23] transition-colors"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="https://www.instagram.com/js_furnish/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-[#a8b8b3] hover:text-[#bf9b23] transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://maps.app.goo.gl/VrxNYVy8YM83Z8Ym8"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Location on Google Maps"
                className="text-[#a8b8b3] hover:text-[#bf9b23] transition-colors"
              >
                <MapPin size={20} />
              </a>
              <a
                href="mailto:contact@jsfurnish.com"
                aria-label="Email"
                className="text-[#a8b8b3] hover:text-[#bf9b23] transition-colors"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-[#1a5c48] text-center text-sm text-[#a8b8b3]">
          <p>&copy; {new Date().getFullYear()} JayShree Furnish. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}










