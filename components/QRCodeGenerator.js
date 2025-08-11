// components/QRCodeGenerator.js
'use client'
import { useState, useEffect } from 'react'
import QRCode from 'react-qr-code'

export default function QRCodeGenerator() {
  const [reviewUrl, setReviewUrl] = useState('')
  const [showQR, setShowQR] = useState(false)

  useEffect(() => {
    // Get the current URL (works for both localhost and production)
    if (typeof window !== 'undefined') {
      const baseUrl = window.location.origin
      setReviewUrl(`${baseUrl}/review`)
    }
  }, [])

  const downloadQR = () => {
    const svg = document.getElementById('qr-code-svg')
    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    canvas.width = 400
    canvas.height = 400
    
    img.onload = () => {
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, 400, 400)
      ctx.drawImage(img, 0, 0, 400, 400)
      
      const link = document.createElement('a')
      link.download = 'food-review-qr-code.png'
      link.href = canvas.toDataURL()
      link.click()
    }
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-6 text-white text-center">
          <h1 className="text-2xl font-bold mb-2">📱 QR Code Generator</h1>
          <p className="text-blue-100">Generate QR codes for your food review system</p>
        </div>

        <div className="p-6 space-y-6">
          {/* URL Display */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Review URL
            </label>
            <div className="bg-gray-50 border border-gray-300 rounded-lg p-3">
              <code className="text-sm text-gray-700">{reviewUrl || 'Loading...'}</code>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              This URL will automatically work for both development and production
            </p>
          </div>

          {/* Generate Button */}
          <button
            onClick={() => setShowQR(true)}
            disabled={!reviewUrl}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold py-4 px-6 rounded-lg hover:from-blue-600 hover:to-indigo-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {showQR ? 'QR Code Generated!' : 'Generate QR Code 📱'}
          </button>

          {/* QR Code Display */}
          {showQR && reviewUrl && (
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Your QR Code</h3>
                <div className="flex justify-center mb-4">
                  <div className="bg-white p-4 rounded-lg border">
                    <QRCode
                      id="qr-code-svg"
                      value={reviewUrl}
                      size={200}
                      level="M"
                      bgColor="#ffffff"
                      fgColor="#000000"
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Customers can scan this QR code to leave reviews
                </p>
                
                {/* Download Button */}
                <button
                  onClick={downloadQR}
                  className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors font-medium"
                >
                  📥 Download QR Code (PNG)
                </button>
              </div>

              {/* Instructions */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h4 className="font-semibold text-orange-800 mb-2">📋 Next Steps:</h4>
                <ul className="text-sm text-orange-700 space-y-1">
                  <li>• Download the QR code image</li>
                  <li>• Print on waterproof stickers (2.5 x 2.5 cm minimum)</li>
                  <li>• Place on food boxes or packaging</li>
                  <li>• Add text: &quot;Scan to rate your food!&quot;</li>
                </ul>
              </div>

              {/* Printing Tips */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">🖨️ Printing Tips:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Use high-quality printers (300 DPI minimum)</li>
                  <li>• Choose waterproof BOPP material for food safety</li>
                  <li>• Test scan before mass printing</li>
                  <li>• Order from: VistaPrint, MakeStickers, or 48HourPrint</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}