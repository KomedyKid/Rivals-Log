import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function PlayerPage({ params }: { params: { username: string } }) {
  const player = await prisma.player.findUnique({
    where: { username: params.username },
  })

  if (!player) {
    notFound()
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-b from-gray-900 to-gray-800">
      <h1 className="text-4xl font-bold mb-8 text-red-500">Marvel Rivals Player: {player.username}</h1>
      <Card className="bg-gray-800 text-white w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">{player.username}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-gray-400">Level:</div>
            <div>{player.level}</div>
            <div className="text-gray-400">Main Hero:</div>
            <div>{player.mainHero}</div>
            <div className="text-gray-400">Win Rate:</div>
            <div>{player.winRate.toFixed(2)}%</div>
            <div className="text-gray-400">Total Matches:</div>
            <div>{player.totalMatches}</div>
            <div className="text-gray-400">Rank:</div>
            <div>
              <Badge variant="secondary" className="bg-yellow-600 text-white">
                {player.rank}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}

