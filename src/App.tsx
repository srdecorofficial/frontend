import { Routes, Route, Navigate } from 'react-router-dom'
import { Providers } from './Providers'
import { ThemeProvider } from './contexts/ThemeContext'

// Layouts
import DecorLayout from './layouts/DecorLayout'
import AdminLayout from './layouts/AdminLayout'

// Decor Pages
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ProductsPage from './pages/ProductsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import BestsellerPage from './pages/BestsellerPage'
import NewArrivalsPage from './pages/NewArrivalsPage'
import ContactPage from './pages/ContactPage'

// Admin Pages
import AdminLoginPage from './pages/admin/LoginPage'
import AdminDashboardPage from './pages/admin/DashboardPage'
import AdminBillsPage from './pages/admin/BillsPage'
import AdminNewBillPage from './pages/admin/NewBillPage'
import AdminCustomersPage from './pages/admin/CustomersPage'
import AdminLeadsPage from './pages/admin/LeadsPage'
import AdminPaymentsPage from './pages/admin/PaymentsPage'
import AdminProductsPage from './pages/admin/ProductsPage'
import AdminNewProductPage from './pages/admin/NewProductPage'
import AdminWarehousePage from './pages/admin/WarehousePage'
import AdminSettingsPage from './pages/admin/SettingsPage'

function App() {
  return (
    <ThemeProvider>
      <Providers>
        <Routes>
          {/* Decor Routes */}
          <Route element={<DecorLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/bestseller" element={<BestsellerPage />} />
            <Route path="/new-arrivals" element={<NewArrivalsPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/login" element={<AdminLoginPage />} />
          <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />
          
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="bills" element={<AdminBillsPage />} />
            <Route path="new-bill" element={<AdminNewBillPage />} />
            <Route path="customers" element={<AdminCustomersPage />} />
            <Route path="leads" element={<AdminLeadsPage />} />
            <Route path="payments" element={<AdminPaymentsPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="products/new" element={<AdminNewProductPage />} />
            <Route path="warehouse" element={<AdminWarehousePage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Providers>
    </ThemeProvider>
  )
}

export default App
