'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  useMotionTemplate,
} from 'framer-motion'
import { Product } from '@/data/products'
import { Tag } from './Tag'
import { Button } from './Button'
import { QuotationRequestModal } from './QuotationRequestModal'
import { MessageSquare } from 'lucide-react'

interface ProductCardProps {
  product: Product
  index?: number
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  // Normalised mouse position: 0 = top/left edge, 1 = bottom/right edge
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)

  // Spring-smoothed tilt: ±8° on each axis
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [8, -8]), {
    stiffness: 280,
    damping: 28,
  })
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-8, 8]), {
    stiffness: 280,
    damping: 28,
  })

  // Glare highlight that follows the cursor
  const glareOpacity = useSpring(0, { stiffness: 280, damping: 28 })
  const glareXPct = useTransform(mouseX, (x) => `${x * 100}%`)
  const glareYPct = useTransform(mouseY, (y) => `${y * 100}%`)
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareXPct} ${glareYPct}, rgba(255,255,255,0.55), transparent 65%)`

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set((e.clientX - rect.left) / rect.width)
    mouseY.set((e.clientY - rect.top) / rect.height)
    glareOpacity.set(0.14)
  }

  function handleMouseLeave() {
    mouseX.set(0.5)
    mouseY.set(0.5)
    glareOpacity.set(0)
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="group"
        style={{ perspective: '1000px' }}
      >
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ rotateX, rotateY }}
          className="relative bg-light-card dark:bg-dark-card rounded-2xl overflow-hidden shadow-soft hover:shadow-soft-lg transition-shadow duration-300"
        >
          {/* Glare overlay — pointer-events-none so clicks pass through */}
          <motion.div
            className="pointer-events-none absolute inset-0 z-10 rounded-2xl"
            style={{ opacity: glareOpacity, background: glareBackground }}
          />

          <div className="relative aspect-square overflow-hidden">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.isBestseller && <Tag variant="bestseller">Bestseller</Tag>}
              {product.isNewArrival && <Tag variant="new">New</Tag>}
            </div>
          </div>

          <div className="p-6">
            <div>
              <h3 className="font-sans text-xl font-semibold text-light-text dark:text-dark-text mb-2 group-hover:text-light-accent dark:group-hover:text-dark-accent transition-colors">
                {product.name}
              </h3>
              <p className="text-sm text-light-textMuted dark:text-dark-textMuted mb-4 line-clamp-2">
                {product.description}
              </p>
            </div>
            <Button
              variant="primary"
              className="w-full"
              onClick={(e) => {
                e.preventDefault()
                setIsModalOpen(true)
              }}
            >
              <MessageSquare size={18} className="mr-2 shrink-0" />
              Contact for Quotation
            </Button>
          </div>
        </motion.div>
      </motion.div>

      <QuotationRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={product}
      />
    </>
  )
}
