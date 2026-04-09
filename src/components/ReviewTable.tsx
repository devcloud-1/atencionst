'use client'

import { useEffect, useState, useCallback } from 'react'
import { StarDisplay } from './StarRating'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChevronLeft, ChevronRight, Trash2, ExternalLink, User, Phone, Mail, SlidersHorizontal
} from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import type { Review } from '@/types'

export function ReviewTable() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  // Filters
  const [filterType, setFilterType] = useState('all')
  const [filterRating, setFilterRating] = useState('all')
  const [filterFrom, setFilterFrom] = useState('')
  const [filterTo, setFilterTo] = useState('')

  const limit = 15

  const fetchReviews = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    })
    if (filterType !== 'all') params.set('visit_type', filterType)
    if (filterRating !== 'all') params.set('rating', filterRating)
    if (filterFrom) params.set('from', filterFrom)
    if (filterTo) params.set('to', filterTo)

    const res = await fetch(`/api/reviews?${params}`)
    const data = await res.json()
    setReviews(data.reviews ?? [])
    setTotal(data.total ?? 0)
    setLoading(false)
  }, [page, filterType, filterRating, filterFrom, filterTo])

  useEffect(() => { fetchReviews() }, [fetchReviews])

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta reseña?')) return
    await fetch(`/api/reviews/${id}`, { method: 'DELETE' })
    fetchReviews()
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Todas las reseñas ({total})</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-1 text-xs"
          >
            <SlidersHorizontal className="w-3 h-3" /> Filtros
          </Button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2">
            <Select value={filterType} onValueChange={(v) => { setFilterType(v ?? 'all'); setPage(1) }}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="consulta">Consulta</SelectItem>
                <SelectItem value="reparacion">Reparación</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterRating} onValueChange={(v) => { setFilterRating(v ?? 'all'); setPage(1) }}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Calificación" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {[5, 4, 3, 2, 1].map((r) => (
                  <SelectItem key={r} value={String(r)}>{r} estrella{r > 1 ? 's' : ''}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              type="date"
              value={filterFrom}
              onChange={(e) => { setFilterFrom(e.target.value); setPage(1) }}
              className="h-8 text-xs"
              placeholder="Desde"
            />
            <Input
              type="date"
              value={filterTo}
              onChange={(e) => { setFilterTo(e.target.value); setPage(1) }}
              className="h-8 text-xs"
              placeholder="Hasta"
            />
          </div>
        )}
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="animate-pulse text-gray-400 text-center py-8">Cargando...</div>
        ) : reviews.length === 0 ? (
          <div className="text-gray-400 text-center py-8">No hay reseñas con estos filtros.</div>
        ) : (
          <div className="space-y-3">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="flex gap-3 p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
              >
                <div className="shrink-0 pt-0.5">
                  <StarDisplay value={review.rating} />
                  <span className="text-xs text-gray-400 mt-1 block text-center">{review.rating}/5</span>
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge
                      variant="secondary"
                      className={review.visit_type === 'reparacion'
                        ? 'bg-purple-100 text-purple-700 border-0'
                        : 'bg-blue-100 text-blue-700 border-0'}
                    >
                      {review.visit_type === 'reparacion' ? 'Reparación' : 'Consulta'}
                    </Badge>

                    {review.google_redirected && (
                      <Badge variant="outline" className="text-green-600 border-green-200 gap-1 text-xs">
                        <ExternalLink className="w-2.5 h-2.5" /> Google
                      </Badge>
                    )}

                    <span className="text-xs text-gray-400 ml-auto">
                      {format(new Date(review.created_at), "d MMM yyyy, HH:mm", { locale: es })}
                    </span>
                  </div>

                  {review.comment && (
                    <p className="text-sm text-gray-700 line-clamp-2">{review.comment}</p>
                  )}

                  {(review.name || review.phone || review.email) && (
                    <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                      {review.name && <span className="flex items-center gap-1"><User className="w-3 h-3" />{review.name}</span>}
                      {review.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{review.phone}</span>}
                      {review.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{review.email}</span>}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleDelete(review.id)}
                  className="shrink-0 text-gray-300 hover:text-red-400 transition-colors p-1"
                  title="Eliminar reseña"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              Página {page} de {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p - 1)}
                disabled={page <= 1}
                className="h-7 w-7 p-0"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= totalPages}
                className="h-7 w-7 p-0"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
