// TODO: Copy content from /app/admin/payments/page.tsx and apply conversions

import { useNavigate, Link } from 'react-router-dom'
import { useApp } from '@/contexts/AppContext'

export default function PaymentsPage() {
  const navigate = useNavigate()
  const { bills, getPendingBills } = useApp()

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Payments Page</h1>
      <p className="mt-4 text-red-600">⚠️ This is a placeholder. Copy content from app/admin/payments/page.tsx</p>
    </div>
  )
}
