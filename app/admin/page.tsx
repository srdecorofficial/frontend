'use client'

import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  Package,
  Tag,
  FileText,
  LayoutDashboard,
  ArrowRight,
  RefreshCw,
} from 'lucide-react'

interface DashboardStats {
  productCount: number
  categoryCount: number
  pageCount: number
  lastUpdated: string | null
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export default function AdminDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    productCount: 0,
    categoryCount: 0,
    pageCount: 5, // home, about, contact, bestseller, new-arrivals
    lastUpdated: null,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch(`${API_URL}/api/v1/products`),
          fetch(`${API_URL}/api/v1/categories`),
        ])
        const productsJson = productsRes.ok ? await productsRes.json() : null
        const categoriesJson = categoriesRes.ok ? await categoriesRes.json() : null
        const products = Array.isArray(productsJson) ? productsJson : productsJson?.data ?? []
        const categories = Array.isArray(categoriesJson) ? categoriesJson : categoriesJson?.data ?? []
        setStats({
          productCount: products.length,
          categoryCount: categories.length,
          pageCount: 5,
          lastUpdated: new Date().toISOString(),
        })
      } catch {
        // If backend isn't available yet, show zeroes
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  const statCards = [
    {
      name: 'Products',
      value: loading ? '...' : stats.productCount,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      href: '/admin/products',
    },
    {
      name: 'Categories',
      value: loading ? '...' : stats.categoryCount,
      icon: Tag,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      href: '/admin/categories',
    },
    {
      name: 'Pages',
      value: loading ? '...' : stats.pageCount,
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      href: '/admin/pages',
    },
  ]

  const quickActions = [
    { label: 'Edit Page Content', href: '/admin/pages', icon: FileText, color: 'bg-purple-50 text-purple-700 hover:bg-purple-100' },
    { label: 'Manage Products', href: '/admin/products', icon: Package, color: 'bg-blue-50 text-blue-700 hover:bg-blue-100' },
    { label: 'Manage Categories', href: '/admin/categories', icon: Tag, color: 'bg-green-50 text-green-700 hover:bg-green-100' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <LayoutDashboard className="h-8 w-8 text-gray-700" />
            Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Welcome back{user?.email ? `, ${user.email}` : ''}! Manage your store content from here.
          </p>
        </div>
        {stats.lastUpdated && (
          <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
            <RefreshCw className="h-3 w-3" />
            Updated {new Date(stats.lastUpdated).toLocaleTimeString()}
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat) => (
          <Link key={stat.name} href={stat.href} className="card hover:shadow-md transition-shadow group">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="space-y-3">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className={`flex items-center p-3 rounded-lg transition-colors ${action.color}`}
            >
              <action.icon className="h-5 w-5 mr-3" />
              {action.label}
              <ArrowRight className="h-4 w-4 ml-auto" />
            </Link>
          ))}
        </div>
      </div>

      {/* Info Banner */}
      <div className="card border border-blue-100 bg-blue-50">
        <h3 className="text-sm font-semibold text-blue-800 mb-1">About the CMS</h3>
        <p className="text-sm text-blue-700">
          Use <strong>Pages</strong> to edit meta tags and hero carousel content. Use <strong>Products</strong> to add, edit, and remove products displayed on the store. Use <strong>Categories</strong> to manage the category grid on the homepage.
        </p>
      </div>
    </div>
  )
}
