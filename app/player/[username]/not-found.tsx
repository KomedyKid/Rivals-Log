import Link from "next/link"

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-b from-gray-900 to-gray-800">
      <h1 className="text-4xl font-bold mb-8 text-red-500">Player Not Found</h1>
      <p className="text-white mb-8">The player you're looking for doesn't exist in our database.</p>
      <Link href="/" className="text-blue-400 hover:text-blue-300">
        Go back to search
      </Link>
    </main>
  )
}

