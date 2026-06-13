'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronRight } from 'lucide-react'

export interface CategoryItem {
  id: string
  label: string
}

export interface SubCategoryItem {
  id: string
  label: string
  categoryId: string
}

interface FilterSidebarProps {
  isOpen: boolean
  onClose?: () => void
  selectedCategory: string
  onCategoryChange: (category: string) => void
  categories?: CategoryItem[]
  selectedSubCategory?: string
  onSubCategoryChange?: (subCategory: string) => void
  subCategories?: SubCategoryItem[]
}

interface SidebarContentProps extends Omit<FilterSidebarProps, 'isOpen'> {
  isMobile?: boolean
}

function SidebarContent({
  selectedCategory,
  onCategoryChange,
  categories,
  selectedSubCategory,
  onSubCategoryChange,
  subCategories,
  onClose,
  isMobile = false,
}: SidebarContentProps) {
  const all = [{ id: '__all__', label: 'All' }, ...categories!]
  const filteredSubs = selectedCategory !== 'All'
    ? (subCategories ?? []).filter(s => {
      const cat = categories?.find(c => c.label === selectedCategory)
      return cat && s.categoryId === cat.id
    })
    : []

  const handleCatClick = (label: string) => {
    onCategoryChange(label)
    onSubCategoryChange?.('')
    if (isMobile) onClose?.()
  }

  const handleSubClick = (label: string) => {
    onSubCategoryChange?.(label)
    if (isMobile) onClose?.()
  }

  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-light-text dark:text-dark-text mb-3">Category</h3>
      {all.map(cat => (
        <div key={cat.id}>
          <button
            onClick={() => handleCatClick(cat.label)}
            className={`w-full text-left px-4 py-2 rounded-xl transition-colors flex items-center justify-between ${selectedCategory === cat.label
              ? 'bg-light-accent dark:bg-dark-accent text-white'
              : 'bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text hover:bg-light-border dark:hover:bg-dark-border'
              }`}
          >
            {cat.label}
            {cat.label !== 'All' && filteredSubs.length > 0 && selectedCategory === cat.label && (
              <ChevronRight size={14} className="shrink-0 opacity-70" />
            )}
          </button>

          {/* Subcategory buttons — shown when this category is selected and it has subcategories */}
          <AnimatePresence>
            {selectedCategory === cat.label && filteredSubs.length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="pl-4 mt-1 space-y-1">
                  <button
                    onClick={() => handleSubClick('')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${!selectedSubCategory
                      ? 'bg-light-accent/20 dark:bg-dark-accent/20 text-light-accent dark:text-dark-accent font-medium'
                      : 'text-light-textMuted dark:text-dark-textMuted hover:bg-light-border dark:hover:bg-dark-border'
                      }`}
                  >
                    All {cat.label}
                  </button>
                  {filteredSubs.map(sub => (
                    <button
                      key={sub.id}
                      onClick={() => handleSubClick(sub.label)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${selectedSubCategory === sub.label
                        ? 'bg-light-accent/20 dark:bg-dark-accent/20 text-light-accent dark:text-dark-accent font-medium'
                        : 'text-light-textMuted dark:text-dark-textMuted hover:bg-light-border dark:hover:bg-dark-border'
                        }`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}

export function FilterSidebar({
  isOpen,
  onClose,
  selectedCategory,
  onCategoryChange,
  categories = [],
  selectedSubCategory = '',
  onSubCategoryChange,
  subCategories = [],
}: FilterSidebarProps) {
  const sharedProps = { selectedCategory, onCategoryChange, categories, selectedSubCategory, onSubCategoryChange, subCategories }

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-full w-80 bg-light-card dark:bg-dark-card border-r border-light-border dark:border-dark-border z-50 md:hidden overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-sans text-xl font-semibold text-light-text dark:text-dark-text">Filters</h2>
                  <button onClick={onClose} className="text-light-text dark:text-dark-text">
                    <X size={24} />
                  </button>
                </div>
                <SidebarContent {...sharedProps} onClose={onClose} isMobile />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 bg-light-card dark:bg-dark-card rounded-2xl p-6 h-fit sticky top-24">
        <h2 className="font-sans text-xl font-semibold text-light-text dark:text-dark-text mb-6">Filters</h2>
        <SidebarContent {...sharedProps} />
      </aside>
    </>
  )
}
