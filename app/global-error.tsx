"use client"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">🚨 Application Error</h1>
            <p className="text-red-500 mb-4">Something went wrong!</p>
            <button onClick={reset} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
