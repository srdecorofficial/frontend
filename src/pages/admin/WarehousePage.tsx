// TODO: Copy content from /app/admin/warehouse/page.tsx and apply conversions

import { useNavigate } from 'react-router-dom'
import { useApp } from '@/contexts/AppContext'

export default function WarehousePage() {
  const navigate = useNavigate()
  const { items } = useApp()

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Warehouse Page</h1>
      <p className="mt-4 text-red-600">⚠️ This is a placeholder. Copy content from app/admin/warehouse/page.tsx</p>
    </div>
  )
}
