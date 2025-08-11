// app/dashboard/page.js
'use client'
import { useState, useEffect } from 'react'
import StarRating from '../../components/StarRating'

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await fetch('/api/reviews')
      if (!response.ok) {
        throw new Error('Failed to fetch reviews')
      }
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error('Error fetching data:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Dashboard</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchData}
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">📊 Food Reviews Dashboard</h1>
          <p className="text-gray-600">Monitor customer feedback and business analytics</p>
        </div>
        
        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-orange-500">
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Reviews</h3>
            <p className="text-3xl font-bold text-orange-500 mt-2">
              {data?.analytics?.totalReviews || 0}
            </p>
            <p className="text-xs text-gray-500 mt-1">All time</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Average Rating</h3>
            <p className="text-3xl font-bold text-green-500 mt-2">
              {data?.analytics?.averageRating?.toFixed(1) || '0.0'}
            </p>
            <div className="mt-1">
              <StarRating rating={Math.round(data?.analytics?.averageRating || 0)} readOnly />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">This Week</h3>
            <p className="text-3xl font-bold text-blue-500 mt-2">
              {data?.analytics?.recentReviews || 0}
            </p>
            <p className="text-xs text-gray-500 mt-1">Last 7 days</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-purple-500">
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Response Rate</h3>
            <p className="text-3xl font-bold text-purple-500 mt-2">
              {data?.analytics?.totalReviews > 0 ? Math.round((data.analytics.totalReviews / 40) * 100) : 0}%
            </p>
            <p className="text-xs text-gray-500 mt-1">Of 40 boxes sold</p>
          </div>
        </div>

        {/* Rating Distribution */}
        {data?.analytics?.ratingDistribution && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Rating Distribution</h2>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map(rating => {
                const count = data.analytics.ratingDistribution[rating] || 0
                const total = data.analytics.totalReviews || 1
                const percentage = (count / total) * 100
                
                return (
                  <div key={rating} className="flex items-center">
                    <span className="w-8 text-sm font-medium">{rating}★</span>
                    <div className="flex-1 mx-4">
                      <div className="bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-yellow-400 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="w-12 text-sm text-gray-600">{count}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Recent Reviews */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Recent Reviews</h2>
            <button 
              onClick={fetchData}
              className="bg-orange-500 text-white px-3 py-1 rounded text-sm hover:bg-orange-600"
            >
              Refresh
            </button>
          </div>
          
          {!data?.reviews?.length ? (
            <div className="p-8 text-center">
              <div className="text-gray-400 text-6xl mb-4">📝</div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Reviews Yet</h3>
              <p className="text-gray-500">When customers submit reviews, they&apos;ll appear here.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
              {data.reviews.slice(0, 20).map((review) => (
                <div key={review._id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <StarRating rating={review.rating} readOnly />
                      <span className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <span className="text-sm text-gray-400 bg-gray-100 px-2 py-1 rounded">
                      {review.email}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Liked: </span>
                      <span className="text-gray-600">{review.feedback}</span>
                    </div>
                    
                    {review.improvements && (
                      <div>
                        <span className="text-sm font-medium text-gray-700">Improvements: </span>
                        <span className="text-gray-600">{review.improvements}</span>
                      </div>
                    )}
                    
                    {review.recommend && (
                      <div className="flex items-center text-sm">
                        <span className="text-green-600">✓ Would recommend to others</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}