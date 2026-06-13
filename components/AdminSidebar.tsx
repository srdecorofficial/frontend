'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard,
  FileText,
  Package,
  Tag,
  Layers,
  Settings,
  Users,
  MessageCircle,
} from 'lucide-react'
import { useRole, type AdminRole } from '@/contexts/AuthContext'

interface NavItem {
  name: string
  href: string
  icon: React.ElementType
  roles: AdminRole[]
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, roles: ['super_admin', 'marketing_admin', 'sales_admin'] },
  { name: 'Pages', href: '/admin/pages', icon: FileText, roles: ['super_admin', 'marketing_admin'] },
  { name: 'Products', href: '/admin/products', icon: Package, roles: ['super_admin'] },
  { name: 'Categories', href: '/admin/categories', icon: Tag, roles: ['super_admin', 'marketing_admin'] },
  { name: 'SubCategories', href: '/admin/subcategories', icon: Layers, roles: ['super_admin', 'marketing_admin'] },
  { name: 'Leads', href: '/admin/leads', icon: Users, roles: ['super_admin', 'sales_admin'] },
  { name: 'Contact Messages', href: '/admin/contact-messages', icon: MessageCircle, roles: ['super_admin', 'sales_admin'] },
  { name: 'Settings', href: '/admin/settings', icon: Settings, roles: ['super_admin'] },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const role = useRole()

  const visibleNav = role
    ? navigation.filter((item) => item.roles.includes(role))
    : navigation // show all while role is loading to avoid flicker

  return (
    <div className="sticky top-[73px] h-[calc(100vh-73px)] w-64 bg-white shadow-sm border-r border-gray-200 overflow-y-auto">
      <nav className="mt-6 px-3">
        <ul className="space-y-1">
          {visibleNav.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isActive
                    ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-500'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 ${isActive ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                  />
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Role badge at bottom */}
      {role && (
        <div className="absolute bottom-4 left-3 right-3">
          <div className="px-3 py-2 rounded-lg bg-gray-50 border border-gray-200">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Role</p>
            <p className="text-sm font-medium text-gray-700 capitalize mt-0.5">
              {role.replace(/_/g, ' ')}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
