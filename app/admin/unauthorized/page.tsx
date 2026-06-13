'use client'

import { ShieldOff } from 'lucide-react'
import Link from 'next/link'

export default function UnauthorizedPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="text-center max-w-md">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShieldOff className="h-10 w-10 text-red-400" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
                <p className="text-gray-500 mb-8">
                    You don't have permission to view this page. Please contact the super administrator if you believe this is an error.
                </p>
                <Link href="/admin" className="btn btn-primary">
                    Back to Dashboard
                </Link>
            </div>
        </div>
    )
}
