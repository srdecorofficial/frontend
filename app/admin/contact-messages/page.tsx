'use client'

import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { RoleGuard } from '@/components/admin/RoleGuard'
import { MessageCircle, Mail, Phone, MessageSquare, Calendar, RefreshCw } from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

interface ContactMessage {
    id: string
    name: string
    email: string
    phone?: string
    message: string
    status?: string
    createdAt: string
}

export default function ContactMessagesPage() {
    return (
        <RoleGuard allowed={['super_admin', 'sales_admin']}>
            <ContactMessagesContent />
        </RoleGuard>
    )
}

function ContactMessagesContent() {
    const { user } = useAuth()
    const [messages, setMessages] = useState<ContactMessage[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const loadMessages = useCallback(async () => {
        if (!user) return
        setLoading(true)
        setError('')
        try {
            const token = await user.getIdToken()
            const res = await fetch(`${API_URL}/api/v1/contact-messages`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            if (res.ok) {
                const json = await res.json()
                setMessages(Array.isArray(json) ? json : json.data ?? [])
            } else {
                setError('Failed to load contact messages.')
            }
        } catch {
            setError('Network error — could not fetch contact messages.')
        } finally {
            setLoading(false)
        }
    }, [user])

    useEffect(() => { loadMessages() }, [loadMessages])

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                        <MessageCircle className="h-8 w-8 text-gray-700" />
                        Contact Messages
                    </h1>
                    <p className="text-gray-600 mt-1">Messages submitted through the Get in Touch page</p>
                </div>
                <button
                    onClick={loadMessages}
                    disabled={loading}
                    className="btn btn-secondary flex items-center gap-2"
                >
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="card flex items-center justify-center py-16">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400" />
                </div>
            ) : messages.length === 0 ? (
                <div className="card text-center py-16">
                    <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg font-medium">No messages yet</p>
                    <p className="text-gray-400 text-sm mt-1">Contact form submissions will appear here once received.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    <p className="text-sm text-gray-500">{messages.length} message{messages.length !== 1 ? 's' : ''} total</p>
                    {messages.map((msg) => (
                        <div key={msg.id} className="card hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between flex-wrap gap-2">
                                <h3 className="font-semibold text-gray-900 text-lg">{msg.name}</h3>
                                <div className="flex items-center gap-1 text-xs text-gray-400">
                                    <Calendar className="h-3.5 w-3.5" />
                                    {new Date(msg.createdAt).toLocaleString('en-IN', {
                                        dateStyle: 'medium', timeStyle: 'short',
                                    })}
                                </div>
                            </div>

                            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-gray-400 shrink-0" />
                                    <a href={`mailto:${msg.email}`} className="hover:underline text-primary-600 truncate">
                                        {msg.email}
                                    </a>
                                </div>
                                {msg.phone && (
                                    <div className="flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-gray-400 shrink-0" />
                                        <a href={`tel:${msg.phone}`} className="hover:underline text-primary-600">
                                            {msg.phone}
                                        </a>
                                    </div>
                                )}
                            </div>

                            {msg.message && (
                                <div className="mt-3 flex gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                                    <MessageSquare className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                                    <p className="whitespace-pre-wrap">{msg.message}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
