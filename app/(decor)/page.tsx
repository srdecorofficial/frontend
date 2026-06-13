'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { ProductGrid } from '@/components/decor/ProductGrid'
import { Button } from '@/components/decor/Button'
import { HeroCarousel, type HeroCarouselSlide } from '@/components/decor/HeroCarousel'
import { CategoryGrid } from '@/components/decor/CategoryGrid'
import { ArrowRight, Sparkles } from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

const FALLBACK_SLIDES: HeroCarouselSlide[] = [
  {
    id: 'curtains',
    imageSrc: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=2400',
    imageAlt: 'Luxury interiors with warm tones',
    eyebrow: 'New Season • Premium Décor',
    title: 'Elevate Every Room',
    subtitle: 'Curated home décor designed for modern, elegant living.',
    ctaLabel: 'Explore Collection',
    href: '/products',
    desktopAlign: 'left',
  },
  {
    id: 'textiles',
    imageSrc: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=2400',
    imageAlt: 'Minimal living room décor',
    eyebrow: 'Textures • Neutrals • Layers',
    title: 'Soft Textiles, Bold Impact',
    subtitle: 'Refresh your space with premium fabrics and timeless patterns.',
    ctaLabel: 'Shop Textiles',
    href: '/products?category=curtains',
    desktopAlign: 'left',
  },
  {
    id: 'motorized-blinds',
    imageSrc: 'https://images.unsplash.com/photo-1609423433459-a65b330ef5da?w=2400',
    imageAlt: 'Striped window blinds casting shadows in a bright room',
    eyebrow: 'Smart Living • Motorized Blinds',
    title: 'Effortless Light Control',
    subtitle: 'Automate your windows with motorized blinds for comfort and style at the touch of a button.',
    ctaLabel: 'Shop Motorized Blinds',
    href: '/products?category=Motorized Blinds',
    desktopAlign: 'left',
  },
]

const FALLBACK_CATEGORIES = [
  { label: 'Furniture', href: '/products?category=Furniture', imageSrc: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800', imageAlt: 'Luxury furniture collection' },
  { label: 'Accessories', href: '/products?category=Accessories', imageSrc: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800', imageAlt: 'Home accessories and decor' },
  { label: 'Textiles', href: '/products?category=Textiles', imageSrc: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800', imageAlt: 'Premium textiles and fabrics' },
  { label: 'Lighting', href: '/products?category=Lighting', imageSrc: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800', imageAlt: 'Modern lighting fixtures' },
]

export default function HomePage() {
  const [loaded, setLoaded] = useState(false)
  const [heroSlides, setHeroSlides] = useState<HeroCarouselSlide[]>(FALLBACK_SLIDES)
  const [categories, setCategories] = useState<any[]>(FALLBACK_CATEGORIES)
  const [bestsellers, setBestsellers] = useState<any[]>([])
  const [newArrivals, setNewArrivals] = useState<any[]>([])

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/api/v1/pages/home`).then(r => r.ok ? r.json() : null).catch(() => null),
      fetch(`${API_URL}/api/v1/categories`).then(r => r.json()).catch(() => ({ data: [] })),
      fetch(`${API_URL}/api/v1/products?bestseller=true`).then(r => r.json()).catch(() => ({ data: [] })),
      fetch(`${API_URL}/api/v1/products?newArrival=true`).then(r => r.json()).catch(() => ({ data: [] })),
    ]).then(([pageData, catsData, bestData, newData]) => {
      if (pageData?.data?.heroSlides?.length) setHeroSlides(pageData.data.heroSlides)
      if (catsData?.data?.length) setCategories(catsData.data)
      if (bestData?.data?.length) setBestsellers(bestData.data.slice(0, 4))
      if (newData?.data?.length) setNewArrivals(newData.data.slice(0, 4))
      setLoaded(true)
    })
  }, [])

  const categoryTextBlock = {
    headline: 'Magical\nIllumination',
    description: 'Create the perfect ambiance with lighting that adds warmth and style to every room',
  }

  return (
    <div className="w-full">
      {/* Hero Section */}
      <HeroCarousel id="home-hero" slides={heroSlides} className="h-[100svh]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        {/* Categories */}
        <section className="mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-sans text-3xl md:text-4xl font-bold text-center text-light-text dark:text-dark-text mb-12"
          >
            Shop by Category
          </motion.h2>
          <CategoryGrid items={categories} textBlock={categoryTextBlock} />
        </section>
      </div>

      {/* Bestsellers */}
      <section className="mb-20 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="font-sans text-3xl md:text-4xl font-bold text-light-text dark:text-dark-text"
            >
              Bestsellers
            </motion.h2>
            <Link href="/bestseller" className="flex items-center">
              <Button variant="ghost" className="flex items-center gap-2">
                View All
                <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
          {bestsellers.length > 0
            ? <ProductGrid products={bestsellers} />
            : !loaded && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => <div key={i} className="h-72 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />)}
              </div>
            )
          }
        </div>
      </section>

      {/* New Arrivals - Full Width */}
      <section className="mb-20 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-3">
              <Sparkles className="text-light-accent dark:text-dark-accent h-7 w-7 md:h-8 md:w-8" />
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="font-sans text-3xl md:text-4xl font-bold text-light-text dark:text-dark-text"
              >
                New Arrivals
              </motion.h2>
            </div>
            <Link href="/new-arrivals" className="flex items-center">
              <Button variant="ghost" className="flex items-center gap-2">
                View All
                <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
          {newArrivals.length > 0
            ? <ProductGrid products={newArrivals} />
            : !loaded && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => <div key={i} className="h-72 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />)}
              </div>
            )
          }
        </div>
      </section>
    </div>
  )
}
