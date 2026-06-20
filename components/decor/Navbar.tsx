'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Phone } from 'lucide-react'
// import { ThemeToggle } from './ThemeToggle' // hidden for now

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/products', label: 'Products' },
  { href: '/bestseller', label: 'Bestseller' },
  { href: '/new-arrivals', label: 'New Arrivals' },
  { href: '/contact', label: 'Contact' },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [hasHero, setHasHero] = useState(false)
  const [pastHeroThreshold, setPastHeroThreshold] = useState(false)
  const heroElRef = useRef<HTMLElement | null>(null)
  const thresholdRef = useRef<number>(0)
  const pathname = usePathname()

  useEffect(() => {
    heroElRef.current = document.querySelector<HTMLElement>('[data-hero="true"]')
    setHasHero(Boolean(heroElRef.current))

    const computeThreshold = () => {
      const el = heroElRef.current
      if (!el) {
        thresholdRef.current = 0
        return
      }

      const rect = el.getBoundingClientRect()
      const top = rect.top + window.scrollY
      // Switch to the glass background once the user scrolls just past 5% of the hero.
      thresholdRef.current = top + rect.height * 0.05
    }

    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(() => {
        ticking = false
        const el = heroElRef.current
        if (!el) {
          setPastHeroThreshold(true)
          return
        }
        setPastHeroThreshold(window.scrollY >= thresholdRef.current)
      })
    }

    const onResize = () => {
      computeThreshold()
      onScroll()
    }

    computeThreshold()
    onScroll()

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [pathname])

  // Lock body scroll while the full-screen mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Close the menu on route change.
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const overlayMode = hasHero
  const showGlass = !overlayMode || isOpen || pastHeroThreshold
  const overlayText = overlayMode && !showGlass

  return (
    <nav
      className={[
        'sticky top-0 z-50 w-full transition-colors duration-300',
        showGlass
          ? 'bg-light-card/70 dark:bg-dark-card/60 backdrop-blur-xl border-b border-light-border/60 dark:border-dark-border/50 shadow-soft'
          : 'bg-transparent border-b border-transparent',
      ].join(' ')}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/logo.svg"
              alt="JayShree Furnish"
              className="h-12 w-auto"
            />
            <span
              className={[
                'font-sans text-xl font-bold tracking-wide transition-colors',
                overlayText ? 'text-[#bf9b23]' : 'text-[#bf9b23]',
              ].join(' ')}
            >
              JayShree Furnish
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={[
                  'text-sm font-medium transition-colors',
                  overlayText
                    ? 'text-white/90 hover:text-white'
                    : 'text-light-text dark:text-dark-text hover:text-light-accent dark:hover:text-dark-accent',
                ].join(' ')}
              >
                {link.label}
              </Link>
            ))}
            {/* <ThemeToggle /> hidden for now */}
          </div>

          {/* Mobile Menu Button — animated hamburger */}
          <div className="flex items-center gap-4 md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={[
                'relative z-[60] h-10 w-10 flex flex-col items-center justify-center gap-[5px] rounded-full transition-colors',
                // When the menu is open the bar shows its glass background, so use normal text.
                !isOpen && overlayText ? 'text-white' : 'text-light-text dark:text-dark-text',
              ].join(' ')}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
            >
              <motion.span
                animate={isOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3 }}
                className="block h-[2px] w-6 bg-current rounded-full"
              />
              <motion.span
                animate={isOpen ? { opacity: 0, x: -8 } : { opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="block h-[2px] w-6 bg-current rounded-full"
              />
              <motion.span
                animate={isOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3 }}
                className="block h-[2px] w-6 bg-current rounded-full"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu — compact dropdown sheet */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Dim backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
              className="md:hidden fixed inset-0 top-20 z-40 bg-black/40 backdrop-blur-[2px]"
            />

            {/* Dropdown card */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden absolute left-4 right-4 top-[calc(100%+0.5rem)] z-50 origin-top rounded-2xl bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border shadow-soft-lg overflow-hidden"
            >
              <nav className="p-2">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={[
                        'group flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition-colors',
                        isActive
                          ? 'bg-[#bf9b23]/10 text-[#bf9b23]'
                          : 'text-light-text dark:text-dark-text hover:bg-light-surface dark:hover:bg-dark-surface',
                      ].join(' ')}
                    >
                      <span className="flex items-center gap-3">
                        {isActive && <span className="h-1.5 w-1.5 rounded-full bg-[#bf9b23]" />}
                        {link.label}
                      </span>
                      <ChevronRight
                        size={18}
                        className={isActive ? 'text-[#bf9b23]' : 'text-light-textMuted dark:text-dark-textMuted opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0'}
                      />
                    </Link>
                  )
                })}
              </nav>

              {/* Contact row */}
              <a
                href="tel:+919315590584"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-6 py-4 border-t border-light-border dark:border-dark-border text-light-text dark:text-dark-text hover:bg-light-surface dark:hover:bg-dark-surface transition-colors"
              >
                <Phone size={18} className="text-[#bf9b23]" />
                <span className="text-sm font-semibold">+91 93155 90584</span>
              </a>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  )
}







