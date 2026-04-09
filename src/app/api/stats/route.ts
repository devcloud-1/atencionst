import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyAdminSession } from '@/lib/auth'

export async function GET() {
  const isAdmin = await verifyAdminSession()
  if (!isAdmin) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { data: reviews, error } = await supabaseAdmin
    .from('reviews')
    .select('rating, visit_type, google_redirected, created_at')

  if (error) {
    return NextResponse.json({ error: 'Error al obtener estadísticas' }, { status: 500 })
  }

  const total = reviews.length
  const average_rating = total > 0
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / total
    : 0

  const by_rating: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  const by_type: Record<string, number> = { consulta: 0, reparacion: 0 }
  let google_redirected_count = 0

  for (const r of reviews) {
    by_rating[r.rating] = (by_rating[r.rating] || 0) + 1
    by_type[r.visit_type] = (by_type[r.visit_type] || 0) + 1
    if (r.google_redirected) google_redirected_count++
  }

  // Last 30 days trend grouped by day
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29)

  const recentMap: Record<string, { sum: number; count: number }> = {}
  for (const r of reviews) {
    const date = r.created_at.slice(0, 10)
    if (new Date(date) >= thirtyDaysAgo) {
      if (!recentMap[date]) recentMap[date] = { sum: 0, count: 0 }
      recentMap[date].sum += r.rating
      recentMap[date].count++
    }
  }

  const recent_trend = Object.entries(recentMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, { sum, count }]) => ({
      date,
      average: Math.round((sum / count) * 10) / 10,
      count,
    }))

  return NextResponse.json({
    total,
    average_rating: Math.round(average_rating * 10) / 10,
    by_rating,
    by_type,
    google_redirected_count,
    recent_trend,
  })
}
