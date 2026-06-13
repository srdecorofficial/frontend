'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { RoleGuard } from '@/components/admin/RoleGuard'
import { Plus, Pencil, Trash2, Save, X, AlertCircle, CheckCircle2, Package } from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

interface Category {
  id: string
  label: string
  order: number
}

interface SubCategory {
  id: string
  label: string
  categoryId: string
  order: number
}

interface Product {
  id: string
  name: string
  price: number
  category: string
  subCategory?: string
  images: string[]
  description: string
  isBestseller: boolean
  isNewArrival: boolean
  inStock: boolean
}

const EMPTY_PRODUCT: Omit<Product, 'id'> = {
  name: '',
  price: 0,
  category: '',
  subCategory: '',
  images: [],
  description: '',
  isBestseller: false,
  isNewArrival: false,
  inStock: true,
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
    </div>
  )
}

export default function AdminProductsPage() {
  return (
    <RoleGuard allowed={['super_admin']}>
      <ProductsContent />
    </RoleGuard>
  )
}

function ProductsContent() {
  const { user } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [allSubCategories, setAllSubCategories] = useState<SubCategory[]>([])
  const [availableSubCats, setAvailableSubCats] = useState<SubCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState<Omit<Product, 'id'>>(EMPTY_PRODUCT)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [filterCategory, setFilterCategory] = useState('')
  const [filterSubCategory, setFilterSubCategory] = useState('')

  const getToken = useCallback(async () => user?.getIdToken() ?? null, [user])

  const loadProducts = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/v1/products`)
      const json = await res.json()
      setProducts(Array.isArray(json.data) ? json.data : [])
    } catch {
      setStatus({ type: 'error', msg: 'Failed to load products.' })
    } finally {
      setLoading(false)
    }
  }, [])

  const loadCategoriesAndSubs = useCallback(async () => {
    try {
      const [catRes, subRes] = await Promise.all([
        fetch(`${API_URL}/api/v1/categories`),
        fetch(`${API_URL}/api/v1/subcategories`),
      ])
      const [catJson, subJson] = await Promise.all([catRes.json(), subRes.json()])
      setCategories(
        Array.isArray(catJson.data)
          ? catJson.data.sort((a: Category, b: Category) => a.order - b.order)
          : []
      )
      setAllSubCategories(Array.isArray(subJson.data) ? subJson.data : [])
    } catch { }
  }, [])

  useEffect(() => { loadProducts(); loadCategoriesAndSubs() }, [loadProducts, loadCategoriesAndSubs])

  // Cascade subcategories when the form category changes
  const handleCategoryChange = (categoryLabel: string) => {
    const cat = categories.find(c => c.label === categoryLabel)
    const subs = cat ? allSubCategories.filter(s => s.categoryId === cat.id) : []
    setAvailableSubCats(subs.sort((a, b) => a.order - b.order))
    setForm(prev => ({ ...prev, category: categoryLabel, subCategory: '' }))
  }

  const openAdd = () => {
    setEditing(null)
    setForm(EMPTY_PRODUCT)
    setAvailableSubCats([])
    setShowForm(true)
  }
  const openEdit = (p: Product) => {
    setEditing(p)
    const cat = categories.find(c => c.label === p.category)
    const subs = cat ? allSubCategories.filter(s => s.categoryId === cat.id) : []
    setAvailableSubCats(subs.sort((a, b) => a.order - b.order))
    setForm({ ...p })
    setShowForm(true)
  }
  const closeForm = () => { setShowForm(false); setEditing(null) }

  const saveProduct = async () => {
    const token = await getToken()
    if (!token) { setStatus({ type: 'error', msg: 'Not authenticated.' }); return }
    setSaving(true)
    setStatus(null)
    try {
      const url = editing
        ? `${API_URL}/api/v1/products/${editing.id}`
        : `${API_URL}/api/v1/products`
      const method = editing ? 'PUT' : 'POST'
      const body = { ...form, price: Number(form.price) }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      })
      if (res.ok) {
        setStatus({ type: 'success', msg: editing ? 'Product updated.' : 'Product created.' })
        closeForm()
        await loadProducts()
      } else {
        const err = await res.json()
        setStatus({ type: 'error', msg: err.error?.message || 'Save failed' })
      }
    } catch {
      setStatus({ type: 'error', msg: 'Network error.' })
    } finally {
      setSaving(false)
    }
  }

  const deleteProduct = async (id: string) => {
    if (!confirm('Delete this product? This cannot be undone.')) return
    const token = await getToken()
    if (!token) return
    try {
      await fetch(`${API_URL}/api/v1/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      setStatus({ type: 'success', msg: 'Product deleted.' })
      setProducts((prev) => prev.filter((p) => p.id !== id))
    } catch {
      setStatus({ type: 'error', msg: 'Delete failed.' })
    }
  }

  // Subcategories available for the selected filter category
  const filterSubCatOptions = (() => {
    const cat = categories.find(c => c.label === filterCategory)
    if (!cat) return []
    return allSubCategories
      .filter(s => s.categoryId === cat.id)
      .sort((a, b) => a.order - b.order)
  })()

  const filteredProducts = products.filter(p => {
    if (filterCategory && p.category !== filterCategory) return false
    if (filterSubCategory && p.subCategory !== filterSubCategory) return false
    return true
  })

  const handleFilterCategoryChange = (label: string) => {
    setFilterCategory(label)
    setFilterSubCategory('')
  }

  const clearFilters = () => {
    setFilterCategory('')
    setFilterSubCategory('')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Package className="h-8 w-8" /> Products
        </h1>
        <button onClick={openAdd} className="btn btn-primary flex items-center gap-2">
          <Plus size={18} /> Add Product
        </button>
      </div>

      {status && (
        <div className={`flex items-center gap-2 p-4 rounded-lg text-sm font-medium ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
          {status.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {status.msg}
          <button className="ml-auto" onClick={() => setStatus(null)}><X size={14} /></button>
        </div>
      )}

      {/* Add / Edit Form */}
      {showForm && (
        <div className="card border border-blue-200 bg-blue-50/30 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">{editing ? 'Edit Product' : 'New Product'}</h2>
            <button onClick={closeForm}><X size={20} className="text-gray-500 hover:text-gray-800" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Name"><input className="input w-full" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Product name" /></Field>
            <Field label="Price (₹)"><input className="input w-full" type="number" min="0" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} /></Field>

            <Field label="Category">
              {categories.length > 0 ? (
                <select
                  className="input w-full"
                  value={form.category}
                  onChange={e => handleCategoryChange(e.target.value)}
                >
                  <option value="">— Select a category —</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.label}>{c.label}</option>
                  ))}
                </select>
              ) : (
                <input className="input w-full" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="Furniture, Textiles…" />
              )}
            </Field>

            <Field label="SubCategory (optional)">
              {availableSubCats.length > 0 ? (
                <select
                  className="input w-full"
                  value={form.subCategory ?? ''}
                  onChange={e => setForm({ ...form, subCategory: e.target.value })}
                >
                  <option value="">— None —</option>
                  {availableSubCats.map(s => (
                    <option key={s.id} value={s.label}>{s.label}</option>
                  ))}
                </select>
              ) : (
                <input
                  className="input w-full bg-gray-50 text-gray-400"
                  value={form.category ? 'No subcategories for this category' : 'Select a category first'}
                  readOnly
                />
              )}
            </Field>

            <Field label="Images (one URL per line)">
              <textarea className="input w-full text-sm" rows={3}
                value={form.images.join('\n')}
                onChange={e => setForm({ ...form, images: e.target.value.split('\n').filter(Boolean) })}
                placeholder="https://example.com/img.jpg" />
            </Field>
            <div className="md:col-span-2">
              <Field label="Description"><textarea className="input w-full" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Product description…" /></Field>
            </div>
            <div className="flex items-center gap-6">
              {([['isBestseller', 'Bestseller'], ['isNewArrival', 'New Arrival'], ['inStock', 'In Stock']] as const).map(([field, label]) => (
                <label key={field} className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={form[field]} onChange={e => setForm({ ...form, [field]: e.target.checked })} className="w-4 h-4 accent-blue-600" />
                  {label}
                </label>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={saveProduct} disabled={saving} className="btn btn-primary flex items-center gap-2">
              <Save size={16} />{saving ? 'Saving…' : 'Save'}
            </button>
            <button onClick={closeForm} className="btn btn-secondary">Cancel</button>
          </div>
        </div>
      )}

      {/* Filters */}
      {!loading && products.length > 0 && (
        <div className="card flex flex-wrap items-end gap-4">
          <div className="min-w-[180px]">
            <Field label="Filter by Category">
              <select
                className="input w-full"
                value={filterCategory}
                onChange={e => handleFilterCategoryChange(e.target.value)}
              >
                <option value="">All categories</option>
                {categories.map(c => (
                  <option key={c.id} value={c.label}>{c.label}</option>
                ))}
              </select>
            </Field>
          </div>
          <div className="min-w-[180px]">
            <Field label="Filter by SubCategory">
              <select
                className="input w-full"
                value={filterSubCategory}
                onChange={e => setFilterSubCategory(e.target.value)}
                disabled={!filterCategory || filterSubCatOptions.length === 0}
              >
                <option value="">All subcategories</option>
                {filterSubCatOptions.map(s => (
                  <option key={s.id} value={s.label}>{s.label}</option>
                ))}
              </select>
            </Field>
          </div>
          {(filterCategory || filterSubCategory) && (
            <button onClick={clearFilters} className="btn btn-secondary flex items-center gap-2">
              <X size={16} /> Clear
            </button>
          )}
          <span className="ml-auto text-sm text-gray-500 self-center">
            Showing {filteredProducts.length} of {products.length}
          </span>
        </div>
      )}

      {/* Products Table */}
      <div className="card overflow-hidden p-0">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400" />
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Package size={40} className="mb-3" />
            <p>No products yet. Add your first product above.</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Package size={40} className="mb-3" />
            <p>No products match the selected filters.</p>
            <button onClick={clearFilters} className="mt-3 text-blue-600 hover:underline text-sm">Clear filters</button>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">SubCategory</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Flags</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
                  <td className="px-4 py-3 text-gray-600">{p.category}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{p.subCategory || <span className="italic text-gray-300">—</span>}</td>
                  <td className="px-4 py-3 text-gray-900">₹{p.price.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 flex-wrap">
                      {p.isBestseller && <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-xs font-medium">Bestseller</span>}
                      {p.isNewArrival && <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">New</span>}
                      {!p.inStock && <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-600 text-xs font-medium">Out of stock</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => openEdit(p)} className="p-1.5 rounded hover:bg-gray-100 text-gray-600"><Pencil size={15} /></button>
                      <button onClick={() => deleteProduct(p.id)} className="p-1.5 rounded hover:bg-red-50 text-red-500"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
