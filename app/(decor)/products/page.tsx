'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Filter } from 'lucide-react'
import { ProductGrid } from '@/components/decor/ProductGrid'
import { FilterSidebar, type CategoryItem, type SubCategoryItem } from '@/components/decor/FilterSidebar'
import { SearchInput } from '@/components/decor/SearchInput'
import { ProductGridSkeleton } from '@/components/decor/Skeleton'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

function ProductsContent() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('category') || 'All'

  const [allProducts, setAllProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [subCategories, setSubCategories] = useState<SubCategoryItem[]>([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState(categoryParam)
  const [selectedSubCategory, setSelectedSubCategory] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/api/v1/products`).then(r => r.json()),
      fetch(`${API_URL}/api/v1/categories`).then(r => r.json()),
      fetch(`${API_URL}/api/v1/subcategories`).then(r => r.json()),
    ])
      .then(([prodData, catData, subData]) => {
        setAllProducts(Array.isArray(prodData.data) ? prodData.data : [])
        const rawCats: any[] = Array.isArray(catData.data) ? catData.data : []
        const cats: CategoryItem[] = rawCats
          .sort((a: any, b: any) => a.order - b.order)
          .map((c: any) => ({ id: c.id, label: c.label }))
        setCategories(cats)
        const subs: SubCategoryItem[] = Array.isArray(subData.data)
          ? subData.data.map((s: any) => ({ id: s.id, label: s.label, categoryId: s.categoryId }))
          : []
        setSubCategories(subs)

        // Resolve the ?category= URL param against real categories. It may arrive
        // as a label ("Curtains") or as a slug from a category href ("curtains" /
        // "wooden_flooring"). Products are filtered by label, so map it to a label.
        if (categoryParam !== 'All') {
          const slugify = (s: string) => s.toLowerCase().replace(/[\s_-]+/g, '')
          const match = rawCats.find((c: any) => {
            if (c.label?.toLowerCase() === categoryParam.toLowerCase()) return true
            const hrefSlug = String(c.href || '').split('category=')[1] || ''
            return slugify(hrefSlug) === slugify(categoryParam) || slugify(c.label || '') === slugify(categoryParam)
          })
          if (match) setSelectedCategory(match.label)
        }
      })
      .catch(() => { })
      .finally(() => setLoadingProducts(false))
  }, [categoryParam])

  const filteredProducts = useMemo(() => {
    let result = selectedCategory === 'All'
      ? allProducts
      : allProducts.filter((p) => p.category === selectedCategory)

    if (selectedSubCategory) {
      result = result.filter((p) => p.subCategory === selectedSubCategory)
    }

    if (searchQuery) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.description || '').toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return [...result].sort((a, b) => a.name.localeCompare(b.name))
  }, [allProducts, selectedCategory, selectedSubCategory, searchQuery])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="font-sans text-4xl md:text-5xl font-bold text-light-text dark:text-dark-text mb-4">
          Our Products
        </h1>
        <p className="text-light-textMuted dark:text-dark-textMuted">
          Discover our curated collection of premium home décor
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <FilterSidebar
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          selectedCategory={selectedCategory}
          onCategoryChange={(cat) => { setSelectedCategory(cat); setSelectedSubCategory('') }}
          categories={categories}
          selectedSubCategory={selectedSubCategory}
          onSubCategoryChange={setSelectedSubCategory}
          subCategories={subCategories}
        />

        <div className="flex-1">
          <div className="md:hidden mb-4">
            <button
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text"
            >
              <Filter size={20} />
              Filters
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <SearchInput
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-6 text-sm text-light-textMuted dark:text-dark-textMuted">
            {loadingProducts ? 'Loading…' : (
              `${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''} found${selectedSubCategory ? ` in ${selectedSubCategory}` : selectedCategory !== 'All' ? ` in ${selectedCategory}` : ''}`
            )}
          </div>

          {loadingProducts ? <ProductGridSkeleton /> : <ProductGrid products={filteredProducts} />}
        </div>
      </div>
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="h-12 bg-light-surface dark:bg-dark-surface rounded-xl w-64 mb-4 animate-pulse" />
          <div className="h-6 bg-light-surface dark:bg-dark-surface rounded-lg w-96 animate-pulse" />
        </div>
        <ProductGridSkeleton />
      </div>
    }>
      <ProductsContent />
    </Suspense>
  )
}
