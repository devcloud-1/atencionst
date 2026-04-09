import { redirect } from 'next/navigation'
import { verifyAdminSession } from '@/lib/auth'
import { AdminStats } from '@/components/AdminStats'
import { ReviewTable } from '@/components/ReviewTable'
import { LogoutButton } from '@/components/LogoutButton'
import { QRPanel } from '@/components/QRPanel'

export const metadata = {
  title: 'Panel Admin — Servicio Técnico Thermomix',
}

export default async function AdminPage() {
  const isAuth = await verifyAdminSession()
  if (!isAuth) redirect('/admin/login')

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="font-semibold text-gray-800">Panel de Reseñas</h1>
            <p className="text-xs text-gray-500">Servicio Técnico Thermomix</p>
          </div>
          <LogoutButton />
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <AdminStats />
        <QRPanel />
        <ReviewTable />
      </div>
    </main>
  )
}
