import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

async function getPlayerData(username: string) {
  const player = await prisma.player.findUnique({
    where: { username },
    include: {
      reports: {
        include: {
          hero: true,
        },
      },
      lord_reports: {
        include: {
          hero: true,
        },
      },
    },
  })

  if (!player) return null

  const heroStats = await prisma.playerHeroStats.findMany({
    where: { player_id: player.player_id },
  })

  return { player, heroStats }
}

export default async function PlayerPage({ params }: { params: { username: string } }) {
  const data = await getPlayerData(params.username)

  if (!data) {
    notFound()
  }

  const { player, heroStats } = data

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-b from-gray-900 to-gray-800">
      <h1 className="text-4xl font-bold mb-8 text-red-500">Marvel Rivals Player: {player.username}</h1>
      <Card className="bg-gray-800 text-white w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">{player.username}</CardTitle>
        </CardHeader>
        <CardContent>
          <h2 className="text-xl font-semibold mb-4">Hero Statistics</h2>
          <div className="grid gap-4">
            {heroStats.map((stat) => (
              <div key={stat.hero_id} className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">{stat.hero_id}</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-gray-400">Total Reports:</div>
                  <div>{stat.total_reports}</div>
                  <div className="text-gray-400">Average Rating:</div>
                  <div>{stat.avg_rating.toFixed(2)}</div>
                  <div className="text-gray-400">Lord Reports:</div>
                  <div>{stat.lord_reports}</div>
                  <div className="text-gray-400">Lord Status:</div>
                  <div>
                    <Badge
                      variant="secondary"
                      className={`
                      ${
                        stat.lord_status === "Confirmed"
                          ? "bg-green-600"
                          : stat.lord_status === "Likely"
                            ? "bg-yellow-600"
                            : "bg-gray-600"
                      }
                      text-white
                    `}
                    >
                      {stat.lord_status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  )
}

