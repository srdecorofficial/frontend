'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { RoleGuard } from '@/components/admin/RoleGuard'
import { FileText, Save, Plus, Trash2, AlertCircle, CheckCircle2 } from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

const PAGE_SLUGS = ['home', 'about', 'contact', 'bestseller', 'new-arrivals'] as const
type PageSlug = typeof PAGE_SLUGS[number]

interface HeroSlide {
    id: string
    imageSrc: string
    imageAlt: string
    eyebrow?: string
    title: string
    subtitle?: string
    ctaLabel?: string
    href?: string
    desktopAlign?: 'left' | 'center' | 'right'
}

interface PageData {
    metaTitle: string
    metaDescription: string
    ogImage: string
    heroSlides: HeroSlide[]
}

const EMPTY_SLIDE = (): HeroSlide => ({
    id: Date.now().toString(),
    imageSrc: '',
    imageAlt: '',
    eyebrow: '',
    title: '',
    subtitle: '',
    ctaLabel: 'Shop Now',
    href: '/products',
    desktopAlign: 'left',
})

const EMPTY_PAGE: PageData = { metaTitle: '', metaDescription: '', ogImage: '', heroSlides: [] }

export default function PagesPage() {
    return (
        <RoleGuard allowed={['super_admin', 'marketing_admin']}>
            <PagesContent />
        </RoleGuard>
    )
}

function PagesContent() {
    const { user } = useAuth()
    const [slug, setSlug] = useState<PageSlug>('home')
    const [page, setPage] = useState<PageData>(EMPTY_PAGE)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [status, setStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)

    const getToken = useCallback(async () => {
        if (!user) return null
        return user.getIdToken()
    }, [user])

    const loadPage = useCallback(async (s: PageSlug) => {
        setLoading(true)
        setStatus(null)
        try {
            const res = await fetch(`${API_URL}/api/v1/pages/${s}`)
            if (res.ok) {
                const json = await res.json()
                setPage({ ...EMPTY_PAGE, ...json.data, heroSlides: json.data.heroSlides || [] })
            } else {
                setPage(EMPTY_PAGE) // page doesn't exist yet
            }
        } catch {
            setStatus({ type: 'error', msg: 'Failed to load page data.' })
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { loadPage(slug) }, [slug, loadPage])

    const savePage = async () => {
        const token = await getToken()
        if (!token) { setStatus({ type: 'error', msg: 'Not authenticated.' }); return }
        setSaving(true)
        setStatus(null)
        try {
            const res = await fetch(`${API_URL}/api/v1/pages/${slug}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(page),
            })
            if (res.ok) {
                setStatus({ type: 'success', msg: 'Page saved successfully!' })
            } else {
                const err = await res.json()
                setStatus({ type: 'error', msg: err.error?.message || 'Save failed' })
            }
        } catch {
            setStatus({ type: 'error', msg: 'Network error — could not save.' })
        } finally {
            setSaving(false)
        }
    }

    const updateSlide = (idx: number, field: keyof HeroSlide, value: string) => {
        const slides = [...page.heroSlides]
        slides[idx] = { ...slides[idx], [field]: value }
        setPage({ ...page, heroSlides: slides })
    }

    const addSlide = () => setPage({ ...page, heroSlides: [...page.heroSlides, EMPTY_SLIDE()] })
    const removeSlide = (idx: number) =>
        setPage({ ...page, heroSlides: page.heroSlides.filter((_, i) => i !== idx) })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                    <FileText className="h-8 w-8" /> Pages
                </h1>
                <button onClick={savePage} disabled={saving || loading} className="btn btn-primary flex items-center gap-2">
                    <Save size={18} />
                    {saving ? 'Saving…' : 'Save Changes'}
                </button>
            </div>

            {status && (
                <div className={`flex items-center gap-2 p-4 rounded-lg text-sm font-medium ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    }`}>
                    {status.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                    {status.msg}
                </div>
            )}

            {/* Page Selector */}
            <div className="card">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Page</label>
                <select
                    value={slug}
                    onChange={(e) => setSlug(e.target.value as PageSlug)}
                    className="input w-full max-w-xs"
                >
                    {PAGE_SLUGS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
            </div>

            {loading ? (
                <div className="card flex items-center justify-center py-16">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400" />
                </div>
            ) : (
                <>
                    {/* SEO Fields */}
                    <div className="card space-y-4">
                        <h2 className="text-lg font-semibold text-gray-900">SEO & Meta</h2>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
                            <input
                                className="input w-full"
                                value={page.metaTitle}
                                onChange={(e) => setPage({ ...page, metaTitle: e.target.value })}
                                placeholder="e.g. JayShree Furnish – Premium Home Décor"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                            <textarea
                                className="input w-full"
                                rows={3}
                                value={page.metaDescription}
                                onChange={(e) => setPage({ ...page, metaDescription: e.target.value })}
                                placeholder="Short description for search engines (150–160 chars)"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">OG Image URL</label>
                            <input
                                className="input w-full"
                                value={page.ogImage}
                                onChange={(e) => setPage({ ...page, ogImage: e.target.value })}
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    {/* Hero Slides (only for pages that have them) */}
                    {['home', 'bestseller', 'new-arrivals'].includes(slug) && (
                        <div className="card space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900">Hero Slides</h2>
                                <button onClick={addSlide} className="btn btn-secondary flex items-center gap-1 text-sm">
                                    <Plus size={16} /> Add Slide
                                </button>
                            </div>
                            {page.heroSlides.length === 0 && (
                                <p className="text-sm text-gray-500 italic">No slides yet. Click "Add Slide" to create one.</p>
                            )}
                            {page.heroSlides.map((slide, idx) => (
                                <div key={slide.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-semibold text-gray-700">Slide {idx + 1}</span>
                                        <button onClick={() => removeSlide(idx)} className="text-red-500 hover:text-red-700">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {[
                                            { label: 'Image URL', field: 'imageSrc', placeholder: 'https://...' },
                                            { label: 'Image Alt', field: 'imageAlt', placeholder: 'Describe the image' },
                                            { label: 'Eyebrow', field: 'eyebrow', placeholder: 'e.g. New Season • Premium Décor' },
                                            { label: 'Title', field: 'title', placeholder: 'Main heading' },
                                            { label: 'Subtitle', field: 'subtitle', placeholder: 'Supporting text' },
                                            { label: 'CTA Label', field: 'ctaLabel', placeholder: 'e.g. Shop Now' },
                                            { label: 'CTA Link', field: 'href', placeholder: '/products' },
                                        ].map(({ label, field, placeholder }) => (
                                            <div key={field}>
                                                <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                                                <input
                                                    className="input w-full text-sm"
                                                    value={(slide as any)[field] || ''}
                                                    onChange={(e) => updateSlide(idx, field as keyof HeroSlide, e.target.value)}
                                                    placeholder={placeholder}
                                                />
                                            </div>
                                        ))}
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">Text Align</label>
                                            <select
                                                className="input w-full text-sm"
                                                value={slide.desktopAlign || 'left'}
                                                onChange={(e) => updateSlide(idx, 'desktopAlign', e.target.value)}
                                            >
                                                <option value="left">Left</option>
                                                <option value="center">Center</option>
                                                <option value="right">Right</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
