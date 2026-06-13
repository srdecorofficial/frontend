'use client'

import { useAuth, type AdminRole } from '@/contexts/AuthContext'
import { ShieldOff } from 'lucide-react'
import Link from 'next/link'

interface RoleGuardProps {
    allowed: AdminRole[]
    children: React.ReactNode
}

/**
 * Renders children only if the current user's role is in the `allowed` list.
 * Shows a spinner while the role is being fetched, and an access-denied card
 * if the role is not in the allowed list.
 */
export function RoleGuard({ allowed, children }: RoleGuardProps) {
    const { role, roleLoading } = useAuth()

    // Show a spinner while we're still fetching the role from the backend.
    if (roleLoading) {
        return (
            <div className="flex items-center justify-center py-24">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400" />
            </div>
        )
    }

    // After loading, if role is still null the user is not an admin — show nothing
    // (the admin layout handles the broader redirect).
    if (!role) return null

    if (!allowed.includes(role)) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                    <ShieldOff className="h-8 w-8 text-red-400" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
                <p className="text-gray-500 mb-6 max-w-sm">
                    Your role (<span className="font-medium text-gray-700">{role}</span>) does not have permission to view this page.
                </p>
                <Link href="/admin" className="btn btn-secondary">
                    Back to Dashboard
                </Link>
            </div>
        )
    }

    return <>{children}</>
}
