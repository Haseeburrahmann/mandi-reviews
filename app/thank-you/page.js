// app/thank-you/page.js
import Link from 'next/link'

export const metadata = {
  title: 'Thank You for Your Review!',
  description: 'We appreciate your feedback',
}

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center px-4">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
          <svg 
            className="w-10 h-10 text-green-500" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        
        {/* Thank You Message */}
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          🙏 Thank You!
        </h1>
        <p className="text-gray-600 mb-6">
          Your review has been submitted successfully. We truly appreciate your feedback and will use it to improve our service!
        </p>
        
        {/* Contact Info */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-orange-800">
            <strong>📱 Stay Connected</strong><br/>
            WhatsApp: <span className="font-mono font-semibold">+1234567890</span><br/>
            <span className="text-xs">For orders and updates</span>
          </p>
          <div className="mt-2 pt-2 border-t border-orange-200">
            <p className="text-sm text-orange-700">
              🕌 <strong>See you next Friday!</strong><br/>
              <span className="text-xs">Fresh mandi every week</span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link 
            href="/review"
            className="block w-full bg-orange-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Submit Another Review
          </Link>
          
          <div className="text-center">
            <p className="text-xs text-gray-500">
              Enjoyed your experience? Share with friends! 🌟
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}