// components/StarRating.js
'use client'
import { useState } from 'react'
import { Star } from 'lucide-react'

export default function StarRating({ rating, onRatingChange, readOnly = false }) {
  const [hoverRating, setHoverRating] = useState(0)

  const handleClick = (value) => {
    if (!readOnly && onRatingChange) {
      onRatingChange(value)
    }
  }

  const handleMouseEnter = (value) => {
    if (!readOnly) {
      setHoverRating(value)
    }
  }

  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoverRating(0)
    }
  }

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isActive = (hoverRating || rating) >= star
        return (
          <button
            key={star}
            type="button"
            className={`p-1 transition-all duration-200 ${
              readOnly 
                ? 'cursor-default' 
                : 'cursor-pointer hover:scale-110 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 rounded'
            }`}
            onClick={() => handleClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
            disabled={readOnly}
            aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
          >
            <Star
              size={32}
              className={`${
                isActive 
                  ? 'fill-yellow-400 text-yellow-400' 
                  : 'fill-gray-200 text-gray-200'
              } transition-all duration-200`}
            />
          </button>
        )
      })}
      {!readOnly && (
        <span className="ml-2 text-sm text-gray-600">
          {rating > 0 ? `${rating}/5` : 'Click to rate'}
        </span>
      )}
    </div>
  )
}