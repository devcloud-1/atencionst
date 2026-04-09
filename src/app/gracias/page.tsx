'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { StarDisplay } from '@/components/StarRating'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { CheckCircle2, ExternalLink, Heart } from 'lucide-react'

const GOOGLE_REVIEW_URL = process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL ?? '#'

function GraciasContent() {
  const params = useSearchParams()
  const reviewId = params.get('id')
  const rating = parseInt(params.get('rating') ?? '5')
  const [redirected, setRedirected] = useState(false)

  const highRating = rating >= 4

  const handleGoogleClick = async () => {
    if (reviewId && !redirected) {
      setRedirected(true)
      // Fire-and-forget: mark as redirected in DB
      fetch(`/api/reviews/${reviewId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ google_redirected: true }),
      }).catch(() => {})
    }
    window.open(GOOGLE_REVIEW_URL, '_blank', 'noopener,noreferrer')
  }

  return (
    <Card className="w-full max-w-md shadow-lg border-0 ring-1 ring-gray-100 text-center">
      <CardHeader className="pb-4">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-green-100 p-4">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
        </div>
        <CardTitle className="text-xl font-semibold text-gray-800">
          ¡Gracias por tu reseña!
        </CardTitle>
        <CardDescription className="mt-1">
          {highRating
            ? 'Nos alegra mucho que hayas tenido una buena experiencia.'
            : 'Tomamos nota de tus comentarios para seguir mejorando.'}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex justify-center">
          <StarDisplay value={rating} size="lg" />
        </div>

        {highRating && (
          <div className="bg-amber-50 rounded-xl p-4 space-y-3">
            <p className="text-sm text-amber-800 font-medium flex items-center justify-center gap-2">
              <Heart className="w-4 h-4 text-red-500" />
              ¿Nos ayudas con una reseña en Google?
            </p>
            <p className="text-xs text-amber-700">
              Solo toma un momento y ayuda a que otros clientes nos encuentren.
            </p>
            <Button
              onClick={handleGoogleClick}
              className="w-full bg-white border border-amber-200 text-amber-900 hover:bg-amber-100 gap-2"
              variant="outline"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Dejar reseña en Google
              <ExternalLink className="w-3 h-3" />
            </Button>
          </div>
        )}

        <p className="text-xs text-gray-400">
          Puedes cerrar esta ventana cuando quieras.
        </p>
      </CardContent>
    </Card>
  )
}

export default function GraciasPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <Suspense fallback={<div className="animate-pulse text-gray-400">Cargando...</div>}>
        <GraciasContent />
      </Suspense>
    </main>
  )
}
