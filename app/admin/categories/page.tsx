'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { RoleGuard } from '@/components/admin/RoleGuard'
import { Plus, Pencil, Trash2, Save, X, AlertCircle, CheckCircle2, Tag } from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

interface Category {
    id: string
    label: string
    href: string
    imageSrc: string
    imageAlt: string
    order: number
}

const EMPTY_FORM: Omit<Category, 'id'> = {
    label: '',
    href: '',
    imageSrc: '',
    imageAlt: '',
    order: 0,
}

export default function AdminCategoriesPage() {
    return (
        <RoleGuard allowed={['super_admin', 'marketing_admin']}>
            <CategoriesContent />
        </RoleGuard>
    )
}

function CategoriesContent() {
    const { user } = useAuth()
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [status, setStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)
    const [editing, setEditing] = useState<Category | null>(null)
    const [form, setForm] = useState<Omit<Category, 'id'>>(EMPTY_FORM)
    const [showForm, setShowForm] = useState(false)
    const [saving, setSaving] = useState(false)

    const getToken = useCallback(async () => user?.getIdToken() ?? null, [user])

    const loadCategories = useCallback(async () => {
        setLoading(true)
        try {
            const res = await fetch(`${API_URL}/api/v1/categories`)
            const json = await res.json()
            setCategories(Array.isArray(json.data) ? json.data : [])
        } catch {
            setStatus({ type: 'error', msg: 'Failed to load categories.' })
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { loadCategories() }, [loadCategories])

    const openAdd = () => { setEditing(null); setForm({ ...EMPTY_FORM, order: categories.length }); setShowForm(true) }
    const openEdit = (c: Category) => { setEditing(c); setForm({ ...c }); setShowForm(true) }
    const closeForm = () => { setShowForm(false); setEditing(null) }

    const saveCategory = async () => {
        const token = await getToken()
        if (!token) { setStatus({ type: 'error', msg: 'Not authenticated.' }); return }
        setSaving(true)
        setStatus(null)
        try {
            const url = editing
                ? `${API_URL}/api/v1/categories/${editing.id}`
                : `${API_URL}/api/v1/categories`
            const method = editing ? 'PUT' : 'POST'

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ ...form, order: Number(form.order) }),
            })
            if (res.ok) {
                setStatus({ type: 'success', msg: editing ? 'Category updated.' : 'Category created.' })
                closeForm()
                await loadCategories()
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

    const deleteCategory = async (id: string) => {
        if (!confirm('Delete this category?')) return
        const token = await getToken()
        if (!token) return
        try {
            await fetch(`${API_URL}/api/v1/categories/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            })
            setStatus({ type: 'success', msg: 'Category deleted.' })
            setCategories((prev) => prev.filter((c) => c.id !== id))
        } catch {
            setStatus({ type: 'error', msg: 'Delete failed.' })
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                    <Tag className="h-8 w-8" /> Categories
                </h1>
                <button onClick={openAdd} className="btn btn-primary flex items-center gap-2">
                    <Plus size={18} /> Add Category
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
                <div className="card border border-green-200 bg-green-50/30 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">{editing ? 'Edit Category' : 'New Category'}</h2>
                        <button onClick={closeForm}><X size={20} className="text-gray-500 hover:text-gray-800" /></button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { label: 'Label', field: 'label', placeholder: 'Furniture' },
                            { label: 'Link (href)', field: 'href', placeholder: '/products?category=Furniture' },
                            { label: 'Image URL', field: 'imageSrc', placeholder: 'https://...' },
                            { label: 'Image Alt', field: 'imageAlt', placeholder: 'Describe image for accessibility' },
                        ].map(({ label, field, placeholder }) => (
                            <div key={field}>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                                <input
                                    className="input w-full"
                                    value={(form as any)[field]}
                                    onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                                    placeholder={placeholder}
                                />
                            </div>
                        ))}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                            <input
                                className="input w-full"
                                type="number"
                                min="0"
                                value={form.order}
                                onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                            />
                        </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button onClick={saveCategory} disabled={saving} className="btn btn-primary flex items-center gap-2">
                            <Save size={16} />{saving ? 'Saving…' : 'Save'}
                        </button>
                        <button onClick={closeForm} className="btn btn-secondary">Cancel</button>
                    </div>
                </div>
            )}

            {/* Categories Table */}
            <div className="card overflow-hidden p-0">
                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400" />
                    </div>
                ) : categories.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                        <Tag size={40} className="mb-3" />
                        <p>No categories yet. Add one above.</p>
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-600 text-left">
                            <tr>
                                <th className="px-4 py-3 font-medium w-16">Order</th>
                                <th className="px-4 py-3 font-medium">Label</th>
                                <th className="px-4 py-3 font-medium">Link</th>
                                <th className="px-4 py-3 font-medium hidden md:table-cell">Image</th>
                                <th className="px-4 py-3 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {categories.map((c) => (
                                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 text-gray-500 text-center">{c.order}</td>
                                    <td className="px-4 py-3 font-medium text-gray-900">{c.label}</td>
                                    <td className="px-4 py-3 text-gray-600 font-mono text-xs">{c.href}</td>
                                    <td className="px-4 py-3 hidden md:table-cell">
                                        {c.imageSrc && (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={c.imageSrc} alt={c.imageAlt} className="h-10 w-16 object-cover rounded" />
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex gap-2 justify-end">
                                            <button onClick={() => openEdit(c)} className="p-1.5 rounded hover:bg-gray-100 text-gray-600"><Pencil size={15} /></button>
                                            <button onClick={() => deleteCategory(c.id)} className="p-1.5 rounded hover:bg-red-50 text-red-500"><Trash2 size={15} /></button>
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
