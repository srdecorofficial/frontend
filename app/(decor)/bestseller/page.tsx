'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ProductGrid } from '@/components/decor/ProductGrid'
import { Award } from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export default function BestsellerPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API_URL}/api/v1/products?bestseller=true`)
      .then((r) => r.json())
      .then((json) => setProducts(Array.isArray(json.data) ? json.data : []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <div className="flex items-center gap-3 mb-4">
          <Award className="text-light-accent dark:text-dark-accent" size={40} />
          <h1 className="font-sans text-4xl md:text-5xl font-bold text-light-text dark:text-dark-text">
            Bestsellers
          </h1>
        </div>
        <p className="text-light-textMuted dark:text-dark-textMuted">
          Our most loved products, handpicked by our customers
        </p>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-72 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  )
}
