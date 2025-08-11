// lib/validations.js
import { z } from 'zod'

export const reviewSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address')
    .min(1, 'Email is required'),
  rating: z
    .number()
    .min(1, 'Please select a rating')
    .max(5, 'Rating must be between 1-5'),
  feedback: z
    .string()
    .min(5, 'Please share what you liked (minimum 5 characters)')
    .max(1000, 'Feedback must be less than 1000 characters'),
  improvements: z
    .string()
    .max(1000, 'Improvements must be less than 1000 characters')
    .optional(),
  recommend: z
    .boolean()
    .optional()
})

// Validation function
export const validateReview = (data) => {
  try {
    return {
      success: true,
      data: reviewSchema.parse(data)
    }
  } catch (error) {
    return {
      success: false,
      errors: error.errors.reduce((acc, curr) => {
        acc[curr.path[0]] = curr.message
        return acc
      }, {})
    }
  }
}