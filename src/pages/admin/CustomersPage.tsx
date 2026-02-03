// TODO: Copy content from /app/admin/customers/page.tsx and apply conversions

import { useNavigate } from 'react-router-dom'
import { useApp } from '@/contexts/AppContext'

export default function CustomersPage() {
  const navigate = useNavigate()
  const { customers } = useApp()

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Customers Page</h1>
      <p className="mt-4 text-red-600">⚠️ This is a placeholder. Copy content from app/admin/customers/page.tsx</p>
    </div>
  )
}
