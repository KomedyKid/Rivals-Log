import Link from "next/link"
import { prisma } from "@/lib/prisma"
import SearchBar from "@/components/SearchBar"

type TopPlayer = {
  player_id: number
  username: string
  avg_rating: number
}

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
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Title Section */}
      <div className="text-center mb-3">
        <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-red-500 via-red-400 to-red-500 text-transparent bg-clip-text tracking-tight">
          Rivals Log
        </h1>
        <p className="text-gray-400 font-medium tracking-wide">
          Unmask Your Opponents
        </p>
      </div>

      {/* Search Bar */}
      <div className="w-full mb-4 flex justify-center">
        <SearchBar />
      </div>

      {/* Highest Rated Players */}
      <section className="w-full max-w-md">
        <h2 className="text-2xl font-semibold text-white mb-2">
          Highest Rated Players
        </h2>
        {topPlayers.length > 0 ? (
          <ul className="space-y-2">
            {topPlayers.map((player) => (
              <li
                key={player.player_id}
                className="flex justify-between items-center bg-gray-800/50 backdrop-blur-sm p-3 rounded-md hover:bg-gray-800/70 transition-colors"
              >
                <Link
                  href={`/player/${encodeURIComponent(player.username)}`}
                  className="text-white font-medium hover:text-red-400 transition-colors"
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
