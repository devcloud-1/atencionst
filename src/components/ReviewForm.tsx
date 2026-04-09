'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { StarRating } from './StarRating'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Wrench, MessageCircleQuestion, ChevronDown, ChevronUp, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { VisitType } from '@/types'

export function ReviewForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [rating, setRating] = useState(0)
  const [visitType, setVisitType] = useState<VisitType | null>(null)

  useEffect(() => {
    const type = searchParams.get('type')
    if (type === 'consulta' || type === 'reparacion') {
      setVisitType(type)
    }
  }, [searchParams])
  const [comment, setComment] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [showOptional, setShowOptional] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!rating) return setError('Por favor selecciona una calificación.')
    if (!visitType) return setError('Por favor selecciona el tipo de visita.')

    setError('')
    setLoading(true)

    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating, visit_type: visitType, comment, name, phone, email }),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error || 'Ocurrió un error. Intenta de nuevo.')
      return
    }

    router.push(`/gracias?id=${data.id}&rating=${rating}`)
  }

  return (
    <Card className="w-full max-w-md shadow-lg border-0 ring-1 ring-gray-100">
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-3">
          <img src="/logo.png" alt="Thermomix" className="h-10 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
        </div>
        <CardTitle className="text-xl font-semibold text-gray-800">
          ¿Cómo fue tu experiencia?
        </CardTitle>
        <CardDescription>
          Tu opinión nos ayuda a mejorar. Es anónima y tarda menos de un minuto.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div className="flex flex-col items-center gap-2">
            <Label className="text-sm text-gray-600">Califica tu atención</Label>
            <StarRating value={rating} onChange={setRating} />
          </div>

          {/* Visit type */}
          <div>
            <Label className="text-sm text-gray-600 block mb-2 text-center">Tipo de visita</Label>
            <div className="grid grid-cols-2 gap-3">
              {(['consulta', 'reparacion'] as VisitType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setVisitType(type)}
                  className={cn(
                    'flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all',
                    visitType === type
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  )}
                >
                  {type === 'consulta' ? (
                    <MessageCircleQuestion className="w-6 h-6" />
                  ) : (
                    <Wrench className="w-6 h-6" />
                  )}
                  <span className="text-sm font-medium capitalize">
                    {type === 'reparacion' ? 'Reparación' : 'Consulta'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div>
            <Label htmlFor="comment" className="text-sm text-gray-600">
              Comentario <span className="text-gray-400">(opcional)</span>
            </Label>
            <Textarea
              id="comment"
              placeholder="Cuéntanos cómo fue tu visita..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              maxLength={500}
              className="mt-1 resize-none"
            />
            <p className="text-xs text-gray-400 text-right mt-1">{comment.length}/500</p>
          </div>

          {/* Optional data toggle */}
          <button
            type="button"
            onClick={() => setShowOptional(!showOptional)}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            {showOptional ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            Agregar datos de contacto (opcional)
          </button>

          {showOptional && (
            <div className="space-y-3 pt-1 border-t border-gray-100">
              <p className="text-xs text-gray-400">
                Solo si deseas que te contactemos o hacer seguimiento.
              </p>
              <div>
                <Label htmlFor="name" className="text-sm text-gray-600">Nombre</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre"
                  maxLength={100}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-sm text-gray-600">Teléfono</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+56 9 1234 5678"
                  maxLength={20}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-sm text-gray-600">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="correo@ejemplo.com"
                  maxLength={100}
                  className="mt-1"
                />
              </div>
            </div>
          )}

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-6 text-base"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Enviando...</>
            ) : (
              'Enviar reseña'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
