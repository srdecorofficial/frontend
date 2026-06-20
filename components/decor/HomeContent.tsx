'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ProductRail } from '@/components/decor/ProductRail'
import { Button } from '@/components/decor/Button'
import { HeroCarousel, type HeroCarouselSlide } from '@/components/decor/HeroCarousel'
import { CategoryGrid } from '@/components/decor/CategoryGrid'
import { ArrowRight, Sparkles } from 'lucide-react'

interface CategoryCardItem {
  label: string
  href: string
  imageSrc: string
  imageAlt: string
}

interface HomeContentProps {
  heroSlides: HeroCarouselSlide[]
  categories: CategoryCardItem[]
  bestsellers: any[]
  newArrivals: any[]
}

const categoryTextBlock = {
  headline: 'Magical\nIllumination',
  description: 'Create the perfect ambiance with lighting that adds warmth and style to every room',
}

export function HomeContent({ heroSlides, categories, bestsellers, newArrivals }: HomeContentProps) {
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
      <section className="mb-16 md:mb-20 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6 md:mb-12">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="font-sans text-3xl md:text-4xl font-bold text-light-text dark:text-dark-text"
            >
              Bestsellers
            </motion.h2>
            <Link href="/bestseller" className="flex items-center shrink-0">
              <Button variant="ghost" className="flex items-center gap-2">
                View All
                <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
          <ProductRail products={bestsellers} />
        </div>
      </section>

      {/* New Arrivals */}
      <section className="mb-16 md:mb-20 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6 md:mb-12">
            <div className="flex items-center gap-3">
              <Sparkles className="text-light-accent dark:text-dark-accent h-7 w-7 md:h-8 md:w-8 shrink-0" />
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="font-sans text-3xl md:text-4xl font-bold text-light-text dark:text-dark-text"
              >
                New Arrivals
              </motion.h2>
            </div>
            <Link href="/new-arrivals" className="flex items-center shrink-0">
              <Button variant="ghost" className="flex items-center gap-2">
                View All
                <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
          <ProductRail products={newArrivals} />
        </div>
      </section>
    </div>
  )
}
