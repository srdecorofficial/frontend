// TODO: Copy content from /app/admin/new-bill/page.tsx and apply conversions

import { useNavigate, useSearchParams } from 'react-router-dom'
import { useApp } from '@/contexts/AppContext'

export default function NewBillPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">New Bill Page</h1>
      <p className="mt-4 text-red-600">⚠️ This is a placeholder. Copy content from app/admin/new-bill/page.tsx</p>
    </div>
  )
}
