import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { ReportForm } from "@/components/report-form"

export default async function NotFound() {
  const heroes = await prisma.heroes.findMany({
    select: { hero_id: true, hero_name: true },
  })

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-b from-gray-900 to-gray-800">
      <h1 className="text-4xl font-bold mb-8 text-red-500">Player Not Found</h1>
      <p className="text-white mb-8">The player you're looking for doesn't exist in our database.</p>
      <div className="space-y-4">
        {/* Omit the username prop or pass empty, the form now shows a text input */}
        <ReportForm username="" heroes={heroes} isNewPlayer={true} />
        <Link href="/" className="text-blue-400 hover:text-blue-300 block text-center">
          Go back to search
        </Link>
      </div>
    </main>
  )
}
