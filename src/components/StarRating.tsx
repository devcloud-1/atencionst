'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  value: number
  onChange: (value: number) => void
  size?: 'sm' | 'lg'
}

const labels: Record<number, string> = {
  1: 'Muy malo',
  2: 'Malo',
  3: 'Regular',
  4: 'Bueno',
  5: 'Excelente',
}

export function StarRating({ value, onChange, size = 'lg' }: StarRatingProps) {
  const [hovered, setHovered] = useState(0)
  const active = hovered || value
  const starSize = size === 'lg' ? 'w-10 h-10' : 'w-5 h-5'

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className="transition-transform hover:scale-110 focus:outline-none"
            aria-label={`${star} estrella${star > 1 ? 's' : ''}`}
          >
            <Star
              className={cn(
                starSize,
                'transition-colors',
                star <= active
                  ? 'fill-amber-400 text-amber-400'
                  : 'fill-transparent text-gray-300'
              )}
            />
          </button>
        ))}
      </div>
      {size === 'lg' && (
        <span className={cn('text-sm font-medium h-5', active ? 'text-amber-600' : 'text-transparent')}>
          {active ? labels[active] : '—'}
        </span>
      )}
    </div>
  )
}

export function StarDisplay({ value, size = 'sm' }: { value: number; size?: 'sm' | 'lg' }) {
  const starSize = size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(starSize, star <= value ? 'fill-amber-400 text-amber-400' : 'fill-transparent text-gray-200')}
        />
      ))}
    </div>
  )
}
