'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { RoleGuard } from '@/components/admin/RoleGuard'
import { Plus, Pencil, Trash2, Save, X, AlertCircle, CheckCircle2, Layers } from 'lucide-react'

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

const EMPTY_FORM: Omit<SubCategory, 'id'> = {
    label: '',
    categoryId: '',
    order: 0,
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            {children}
        </div>
    )
}

export default function AdminSubCategoriesPage() {
    return (
        <RoleGuard allowed={['super_admin', 'marketing_admin']}>
            <SubCategoriesContent />
        </RoleGuard>
    )
}

function SubCategoriesContent() {
    const { user } = useAuth()
    const [subcategories, setSubCategories] = useState<SubCategory[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [status, setStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)
    const [editing, setEditing] = useState<SubCategory | null>(null)
    const [form, setForm] = useState<Omit<SubCategory, 'id'>>(EMPTY_FORM)
    const [showForm, setShowForm] = useState(false)
    const [saving, setSaving] = useState(false)
    const [filterCategoryId, setFilterCategoryId] = useState('')

    const getToken = useCallback(async () => user?.getIdToken() ?? null, [user])

    const loadSubCategories = useCallback(async () => {
        setLoading(true)
        try {
            const res = await fetch(`${API_URL}/api/v1/subcategories`)
            const json = await res.json()
            setSubCategories(Array.isArray(json.data) ? json.data : [])
        } catch {
            setStatus({ type: 'error', msg: 'Failed to load subcategories.' })
        } finally {
            setLoading(false)
        }
    }, [])

    const loadCategories = useCallback(async () => {
        try {
            const res = await fetch(`${API_URL}/api/v1/categories`)
            const json = await res.json()
            setCategories(Array.isArray(json.data) ? json.data.sort((a: Category, b: Category) => a.order - b.order) : [])
        } catch { }
    }, [])

    useEffect(() => { loadSubCategories(); loadCategories() }, [loadSubCategories, loadCategories])

    const getCategoryLabel = (id: string) => categories.find(c => c.id === id)?.label ?? id

    const openAdd = () => { setEditing(null); setForm({ ...EMPTY_FORM, order: subcategories.length }); setShowForm(true) }
    const openEdit = (s: SubCategory) => { setEditing(s); setForm({ label: s.label, categoryId: s.categoryId, order: s.order }); setShowForm(true) }
    const closeForm = () => { setShowForm(false); setEditing(null) }

    const saveSubCategory = async () => {
        const token = await getToken()
        if (!token) { setStatus({ type: 'error', msg: 'Not authenticated.' }); return }
        if (!form.categoryId) { setStatus({ type: 'error', msg: 'Please select a parent category.' }); return }
        setSaving(true)
        setStatus(null)
        try {
            const url = editing
                ? `${API_URL}/api/v1/subcategories/${editing.id}`
                : `${API_URL}/api/v1/subcategories`
            const method = editing ? 'PUT' : 'POST'

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ ...form, order: Number(form.order) }),
            })
            if (res.ok) {
                setStatus({ type: 'success', msg: editing ? 'SubCategory updated.' : 'SubCategory created.' })
                closeForm()
                await loadSubCategories()
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

    const deleteSubCategory = async (id: string) => {
        if (!confirm('Delete this subcategory?')) return
        const token = await getToken()
        if (!token) return
        try {
            await fetch(`${API_URL}/api/v1/subcategories/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            })
            setStatus({ type: 'success', msg: 'SubCategory deleted.' })
            setSubCategories((prev) => prev.filter((s) => s.id !== id))
        } catch {
            setStatus({ type: 'error', msg: 'Delete failed.' })
        }
    }

    const filteredSubCategories = filterCategoryId
        ? subcategories.filter(s => s.categoryId === filterCategoryId)
        : subcategories

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                    <Layers className="h-8 w-8" /> SubCategories
                </h1>
                <button onClick={openAdd} className="btn btn-primary flex items-center gap-2">
                    <Plus size={18} /> Add SubCategory
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
                <div className="card border border-purple-200 bg-purple-50/30 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">{editing ? 'Edit SubCategory' : 'New SubCategory'}</h2>
                        <button onClick={closeForm}><X size={20} className="text-gray-500 hover:text-gray-800" /></button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Field label="Parent Category">
                            <select
                                className="input w-full"
                                value={form.categoryId}
                                onChange={e => setForm({ ...form, categoryId: e.target.value })}
                            >
                                <option value="">— Select a category —</option>
                                {categories.map(c => (
                                    <option key={c.id} value={c.id}>{c.label}</option>
                                ))}
                            </select>
                        </Field>
                        <Field label="SubCategory Label">
                            <input
                                className="input w-full"
                                value={form.label}
                                onChange={e => setForm({ ...form, label: e.target.value })}
                                placeholder="e.g. Sofas, Cushions…"
                            />
                        </Field>
                        <Field label="Sort Order">
                            <input
                                className="input w-full"
                                type="number"
                                min="0"
                                value={form.order}
                                onChange={e => setForm({ ...form, order: Number(e.target.value) })}
                            />
                        </Field>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button onClick={saveSubCategory} disabled={saving} className="btn btn-primary flex items-center gap-2">
                            <Save size={16} />{saving ? 'Saving…' : 'Save'}
                        </button>
                        <button onClick={closeForm} className="btn btn-secondary">Cancel</button>
                    </div>
                </div>
            )}

            {/* Filter */}
            {!loading && subcategories.length > 0 && (
                <div className="card flex flex-wrap items-end gap-4">
                    <div className="min-w-[180px]">
                        <Field label="Filter by Category">
                            <select
                                className="input w-full"
                                value={filterCategoryId}
                                onChange={e => setFilterCategoryId(e.target.value)}
                            >
                                <option value="">All categories</option>
                                {categories.map(c => (
                                    <option key={c.id} value={c.id}>{c.label}</option>
                                ))}
                            </select>
                        </Field>
                    </div>
                    {filterCategoryId && (
                        <button onClick={() => setFilterCategoryId('')} className="btn btn-secondary flex items-center gap-2">
                            <X size={16} /> Clear
                        </button>
                    )}
                    <span className="ml-auto text-sm text-gray-500 self-center">
                        Showing {filteredSubCategories.length} of {subcategories.length}
                    </span>
                </div>
            )}

            {/* SubCategories Table */}
            <div className="card overflow-hidden p-0">
                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400" />
                    </div>
                ) : subcategories.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                        <Layers size={40} className="mb-3" />
                        <p>No subcategories yet. Add one above.</p>
                    </div>
                ) : filteredSubCategories.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                        <Layers size={40} className="mb-3" />
                        <p>No subcategories in this category.</p>
                        <button onClick={() => setFilterCategoryId('')} className="mt-3 text-blue-600 hover:underline text-sm">Clear filter</button>
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-600 text-left">
                            <tr>
                                <th className="px-4 py-3 font-medium w-16">Order</th>
                                <th className="px-4 py-3 font-medium">Parent Category</th>
                                <th className="px-4 py-3 font-medium">SubCategory</th>
                                <th className="px-4 py-3 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredSubCategories.map((s) => (
                                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 text-gray-500 text-center">{s.order}</td>
                                    <td className="px-4 py-3 text-gray-600">{getCategoryLabel(s.categoryId)}</td>
                                    <td className="px-4 py-3 font-medium text-gray-900">{s.label}</td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex gap-2 justify-end">
                                            <button onClick={() => openEdit(s)} className="p-1.5 rounded hover:bg-gray-100 text-gray-600"><Pencil size={15} /></button>
                                            <button onClick={() => deleteSubCategory(s.id)} className="p-1.5 rounded hover:bg-red-50 text-red-500"><Trash2 size={15} /></button>
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
