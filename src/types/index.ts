export type VisitType = 'consulta' | 'reparacion'

export interface Review {
  id: string
  created_at: string
  rating: number
  visit_type: VisitType
  comment: string | null
  name: string | null
  phone: string | null
  email: string | null
  google_redirected: boolean
}

export interface ReviewStats {
  total: number
  average_rating: number
  by_rating: Record<number, number>
  by_type: Record<VisitType, number>
  google_redirected_count: number
  recent_trend: { date: string; average: number; count: number }[]
}
