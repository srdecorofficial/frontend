'use client'

import { ProductGrid } from './ProductGrid'
import { ProductCard } from './ProductCard'
import type { Product } from '@/data/products'

/**
 * Homepage product showcase: a horizontal swipe carousel on mobile (thumb-friendly,
 * shows several products per screen with the next peeking in) and the standard
 * grid on tablet/desktop.
 */
export function ProductRail({ products }: { products: Product[] }) {
  if (!products?.length) return null

  return (
    <>
      {/* Mobile: horizontal snap carousel */}
      <div className="md:hidden -mx-4 px-4">
        <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2">
          {products.map((product, index) => (
            <div key={product.id} className="snap-start shrink-0 w-[60%]">
              <ProductCard product={product} index={index} />
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-light-textMuted dark:text-dark-textMuted mt-3">
          Swipe to see more →
        </p>
      </div>

      {/* Tablet / desktop: grid */}
      <div className="hidden md:block">
        <ProductGrid products={products} />
      </div>
    </>
  )
}
