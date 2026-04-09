import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyAdminSession } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { rating, visit_type, comment, name, phone, email } = body

  if (!rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'Calificación inválida' }, { status: 400 })
  }
  if (!visit_type || !['consulta', 'reparacion'].includes(visit_type)) {
    return NextResponse.json({ error: 'Tipo de visita inválido' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('reviews')
    .insert({
      rating,
      visit_type,
      comment: comment?.trim() || null,
      name: name?.trim() || null,
      phone: phone?.trim() || null,
      email: email?.trim() || null,
      google_redirected: false,
    })
    .select('id')
    .single()

  if (error) {
    console.error('Supabase insert error:', error)
    return NextResponse.json({ error: 'Error al guardar reseña' }, { status: 500 })
  }

  return NextResponse.json({ id: data.id })
}

export async function GET(req: NextRequest) {
  const isAdmin = await verifyAdminSession()
  if (!isAdmin) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') ?? '1')
  const limit = parseInt(searchParams.get('limit') ?? '20')
  const visit_type = searchParams.get('visit_type')
  const rating = searchParams.get('rating')
  const from_date = searchParams.get('from')
  const to_date = searchParams.get('to')

  const offset = (page - 1) * limit

  let query = supabaseAdmin
    .from('reviews')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (visit_type && ['consulta', 'reparacion'].includes(visit_type)) {
    query = query.eq('visit_type', visit_type)
  }
  if (rating) {
    query = query.eq('rating', parseInt(rating))
  }
  if (from_date) {
    query = query.gte('created_at', from_date)
  }
  if (to_date) {
    query = query.lte('created_at', to_date + 'T23:59:59')
  }

  const { data, error, count } = await query

  if (error) {
    return NextResponse.json({ error: 'Error al obtener reseñas' }, { status: 500 })
  }

  return NextResponse.json({ reviews: data, total: count, page, limit })
}
