// app/test/page.js
export default function TestPage() {
    return (
      <div className="min-h-screen bg-blue-500 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">✅ Tailwind Working!</h1>
          <p className="text-gray-600 mb-4">
            If you can see this blue background and white card with proper styling, 
            Tailwind CSS is working correctly.
          </p>
          <button className="w-full bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors">
            Test Button
          </button>
        </div>
      </div>
    )
  }