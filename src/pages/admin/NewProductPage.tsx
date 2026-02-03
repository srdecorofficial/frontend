// TODO: Copy content from /app/admin/products/new/page.tsx and apply conversions

import { useNavigate, Link } from 'react-router-dom'
import { ScreenSizeGuard } from '@/components/admin/ScreenSizeGuard'

export default function NewProductPage() {
  const navigate = useNavigate()

  return (
    <ScreenSizeGuard>
      <div className="p-8">
        <h1 className="text-3xl font-bold">New Product Page</h1>
        <p className="mt-4 text-red-600">⚠️ This is a placeholder. Copy content from app/admin/products/new/page.tsx</p>
      </div>
    </ScreenSizeGuard>
  )
}
