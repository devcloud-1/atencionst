'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StarDisplay } from './StarRating'
import { Star, MessageSquare, Wrench, ExternalLink, TrendingUp } from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell
} from 'recharts'
import type { ReviewStats } from '@/types'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

const RATING_COLORS: Record<number, string> = {
  5: '#22c55e',
  4: '#84cc16',
  3: '#facc15',
  2: '#f97316',
  1: '#ef4444',
}

export function AdminStats() {
  const [stats, setStats] = useState<ReviewStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/stats')
      .then((r) => r.json())
      .then((data) => { setStats(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="animate-pulse text-gray-400 py-8 text-center">Cargando estadísticas...</div>
  if (!stats) return <div className="text-red-500 py-8 text-center">Error al cargar estadísticas.</div>

  const ratingBars = [5, 4, 3, 2, 1].map((r) => ({
    name: `${r}★`,
    count: stats.by_rating[r] ?? 0,
    rating: r,
  }))

  const googlePct = stats.total > 0 ? Math.round((stats.google_redirected_count / stats.total) * 100) : 0

  return (
    <div className="space-y-4">
      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-blue-500 shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Total reseñas</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <Star className="w-8 h-8 text-amber-400 shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Promedio</p>
                <p className="text-2xl font-bold">{stats.average_rating}</p>
                <StarDisplay value={Math.round(stats.average_rating)} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <Wrench className="w-8 h-8 text-purple-500 shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Consultas / Reparaciones</p>
                <p className="text-2xl font-bold">
                  {stats.by_type.consulta ?? 0} / {stats.by_type.reparacion ?? 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <ExternalLink className="w-8 h-8 text-green-500 shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Fueron a Google</p>
                <p className="text-2xl font-bold">{stats.google_redirected_count}</p>
                <p className="text-xs text-gray-400">{googlePct}% del total</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Trend chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Tendencia últimos 30 días
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recent_trend.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">Sin datos aún</p>
            ) : (
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={stats.recent_trend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10 }}
                    tickFormatter={(v) => format(new Date(v + 'T12:00:00'), 'd MMM', { locale: es })}
                  />
                  <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 10 }} />
                  <Tooltip
                    formatter={(v) => [`${v} ★`, 'Promedio']}
                    labelFormatter={(l) => format(new Date(l + 'T12:00:00'), 'dd MMM yyyy', { locale: es })}
                  />
                  <Line type="monotone" dataKey="average" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Rating distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Distribución de calificaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={ratingBars} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10 }} allowDecimals={false} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={28} />
                <Tooltip formatter={(v) => [v, 'Reseñas']} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {ratingBars.map((entry) => (
                    <Cell key={entry.rating} fill={RATING_COLORS[entry.rating]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
