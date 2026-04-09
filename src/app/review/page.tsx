import { Suspense } from 'react'
import { ReviewForm } from '@/components/ReviewForm'

export const metadata = {
  title: 'Deja tu reseña — Servicio Técnico Thermomix',
  description: 'Comparte tu experiencia con nosotros. Tu opinión nos ayuda a mejorar.',
}

export default function ReviewPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
      <Suspense fallback={<div className="animate-pulse text-gray-400">Cargando...</div>}>
        <ReviewForm />
      </Suspense>
    </main>
  )
}
