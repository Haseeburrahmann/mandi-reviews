// app/api/reviews/route.js
import { NextResponse } from 'next/server'
import clientPromise from '../../../lib/mongodb'
import { validateReview } from '../../../lib/validations'

export async function POST(request) {
  try {
    const body = await request.json()
    
    // Validate request body
    const validation = validateReview(body)
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', errors: validation.errors },
        { status: 400 }
      )
    }

    const validatedData = validation.data

    // Connect to database
    const client = await clientPromise
    const db = client.db('mandi-reviews')
    const collection = db.collection('mandi-reviews')

    // Check if email already exists
    const existingReview = await collection.findOne({ 
      email: validatedData.email.toLowerCase() 
    })
    
    if (existingReview) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      )
    }

    // Insert new review
    const reviewDocument = {
      ...validatedData,
      email: validatedData.email.toLowerCase(), // Store email in lowercase
      createdAt: new Date(),
      updatedAt: new Date(),
      ipAddress: request.headers.get('x-forwarded-for') || 
                 request.headers.get('x-real-ip') || 
                 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown'
    }

    const result = await collection.insertOne(reviewDocument)

    console.log('Review saved successfully:', result.insertedId)

    return NextResponse.json(
      { 
        success: true, 
        id: result.insertedId.toString(),
        message: 'Review submitted successfully!'
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Error saving review:', error)
    
    // Handle MongoDB connection errors
    if (error.name === 'MongoServerError') {
      return NextResponse.json(
        { error: 'Database connection error. Please try again.' },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    )
  }
}

export async function GET(request) {
  try {
    const client = await clientPromise
    const db = client.db('mandi-reviews')
    const collection = db.collection('mandi-reviews')

    // Get query parameters for pagination (optional)
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit')) || 50
    const skip = parseInt(searchParams.get('skip')) || 0

    // Fetch reviews (most recent first)
    const reviews = await collection
      .find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()

    // Calculate analytics
    const totalReviews = await collection.countDocuments()
    
    const ratingStats = await collection.aggregate([
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalRatings: { $sum: 1 },
          ratingCounts: {
            $push: '$rating'
          }
        }
      }
    ]).toArray()

    // Calculate rating distribution
    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    if (ratingStats[0]?.ratingCounts) {
      ratingStats[0].ratingCounts.forEach(rating => {
        ratingDistribution[rating] = (ratingDistribution[rating] || 0) + 1
      })
    }

    // Calculate recent reviews (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    const recentReviews = await collection.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    })

    return NextResponse.json({
      reviews: reviews.map(review => ({
        ...review,
        _id: review._id.toString()
      })),
      analytics: {
        totalReviews,
        averageRating: ratingStats[0]?.averageRating || 0,
        recentReviews,
        ratingDistribution
      }
    })

  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}