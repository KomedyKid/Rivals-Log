import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/prisma"

type TopPlayer = {
  player_id: number
  username: string
  avg_rating: number
}

// Utility function to get top players
async function getTopPlayers(limit = 5): Promise<TopPlayer[]> {
  const topPlayers = await prisma.$queryRaw<TopPlayer[]>`
    SELECT p.player_id,
           p.username,
           COALESCE(ROUND(AVG(r.rating), 2), 0) as avg_rating
    FROM players p
    INNER JOIN reports r ON r.player_id = p.player_id
    WHERE r.rating IS NOT NULL
    GROUP BY p.player_id
    ORDER BY AVG(r.rating) DESC
    LIMIT ${limit}
  `
  return topPlayers
}

export default async function Home() {
  const topPlayers = await getTopPlayers(5)

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Search Form */}
      <h1 className="text-4xl font-bold mb-8 text-red-500">
        Marvel Rivals Player Lookup
      </h1>
      <form action="/api/search" method="GET" className="w-full max-w-md mb-12">
        <div className="flex space-x-2">
          <Input
            type="text"
            name="username"
            placeholder="Enter username"
            className="flex-grow"
            required
          />
          <Button type="submit">Search</Button>
        </div>
      </form>

      {/* Display Highest-Rated Players */}
      <section className="w-full max-w-md">
        <h2 className="text-2xl font-semibold text-white mb-4">
          Highest Rated Players
        </h2>
        {topPlayers.length > 0 ? (
          <ul className="space-y-2">
            {topPlayers.map((player) => (
              <li
                key={player.player_id}
                className="flex justify-between items-center bg-gray-800 p-3 rounded-md"
              >
                <Link
                  href={`/player/${encodeURIComponent(player.username)}`}
                  className="text-white font-medium hover:text-blue-400"
                >
                  {player.username}
                </Link>
                <span className="text-red-400 font-semibold">
                  {player.avg_rating.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No rated players found.</p>
        )}
      </section>
    </main>
  )
}
