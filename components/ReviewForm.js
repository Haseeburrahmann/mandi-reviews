// components/ReviewForm.js
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import StarRating from './StarRating'

export default function ReviewForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    rating: 0,
    feedback: '',
    improvements: '',
    recommend: true
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Enhanced email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const allowedDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'aol.com', 'live.com', 'msn.com', 'ymail.com', 'rocketmail.com']
    
    if (!email) {
      return 'Email is required'
    }
    
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address'
    }
    
    const domain = email.split('@')[1]?.toLowerCase()
    if (!allowedDomains.includes(domain)) {
      return 'Please use a valid email provider (Gmail, Yahoo, Outlook, etc.)'
    }
    
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    // Client-side validation
    const newErrors = {}
    
    // Email validation
    const emailError = validateEmail(formData.email)
    if (emailError) {
      newErrors.email = emailError
    }
    
    // Rating validation
    if (formData.rating === 0) {
      newErrors.rating = 'Please select a rating'
    }
    
    // Feedback validation
    if (!formData.feedback.trim() || formData.feedback.trim().length < 5) {
      newErrors.feedback = 'Please share what you liked (minimum 5 characters)'
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!response.ok) {
        if (result.error === 'Email already exists') {
          setErrors({ email: 'You have already submitted a review with this email address' })
        } else if (result.errors) {
          setErrors(result.errors)
        } else {
          setErrors({ general: result.error || 'Something went wrong. Please try again.' })
        }
        return
      }

      // Success - redirect to thank you page
      router.push('/thank-you')

    } catch (error) {
      console.error('Error submitting review:', error)
      setErrors({ general: 'Network error. Please check your connection and try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-8 px-4">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6 text-white text-center">
          <h1 className="text-2xl font-bold mb-2">🍽️ Rate Your Food</h1>
          <p className="text-orange-100">We value your feedback!</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* General Error */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {errors.general}
            </div>
          )}

          {/* Email Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              required
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500 ${
                errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
              }`}
              placeholder="your.email@gmail.com"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              We accept Gmail, Yahoo, Outlook, and other major email providers
            </p>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Overall Rating *
            </label>
            <StarRating
              rating={formData.rating}
              onRatingChange={(rating) => handleInputChange('rating', rating)}
            />
            {errors.rating && (
              <p className="text-red-500 text-sm mt-1">{errors.rating}</p>
            )}
          </div>

          {/* Feedback */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              What did you like most? *
            </label>
            <textarea
              required
              rows={3}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none text-gray-900 placeholder-gray-500 ${
                errors.feedback ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
              }`}
              placeholder="Tell us about the taste, portion size, packaging..."
              value={formData.feedback}
              onChange={(e) => handleInputChange('feedback', e.target.value)}
            />
            {errors.feedback && (
              <p className="text-red-500 text-sm mt-1">{errors.feedback}</p>
            )}
          </div>

          {/* Improvements */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              How can we improve? (Optional)
            </label>
            <textarea
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none text-gray-900 placeholder-gray-500"
              placeholder="Any suggestions for improvement..."
              value={formData.improvements}
              onChange={(e) => handleInputChange('improvements', e.target.value)}
            />
            {errors.improvements && (
              <p className="text-red-500 text-sm mt-1">{errors.improvements}</p>
            )}
          </div>

          {/* Recommendation */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="recommend"
              className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
              checked={formData.recommend}
              onChange={(e) => handleInputChange('recommend', e.target.checked)}
            />
            <label htmlFor="recommend" className="ml-2 text-sm text-gray-700">
              I would recommend this to others
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold py-4 px-6 rounded-lg hover:from-orange-600 hover:to-amber-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </span>
            ) : (
              'Submit Review ⭐'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}