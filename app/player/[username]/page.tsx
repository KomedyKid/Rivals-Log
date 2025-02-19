import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import CommentsDialog from "@/components/comments-dialog"
import { ReportForm } from "@/components/report-form"
import { User } from "lucide-react"

type HeroStat = {
  player_id: number
  hero_id: number
  hero_name: string
  total_reports: number
  avg_rating: number
  lord_reports: number
  lord_status: string
}

type RawComment = {
  hero_id: number
  comment: string
  reported_at: Date
  rating: number
  hero_name: string
}

type Comment = {
  hero_id: number
  comment: string
  reported_at: Date
  rating: number
  hero: {
    hero_name: string
  }
}

async function getPlayerData(username: string) {
  // Decode the URL-encoded username
  const decodedUsername = decodeURIComponent(username)

  const player = await prisma.players.findUnique({
    where: { username: decodedUsername },
  })

  if (!player) return null

  // Get hero stats with hero names using raw SQL
  const heroStats = await prisma.$queryRaw<HeroStat[]>`
    SELECT 
      phs.player_id,
      phs.hero_id,
      h.hero_name,
      phs.total_reports,
      phs.avg_rating,
      phs.lord_reports,
      phs.lord_status
    FROM player_hero_stats phs
    JOIN heroes h ON h.hero_id = phs.hero_id
    WHERE phs.player_id = ${player.player_id}
  `

  // Get comments for each hero
  const rawComments = await prisma.$queryRaw<RawComment[]>`
    SELECT 
      r.hero_id,
      r.comment,
      r.reported_at,
      r.rating,
      h.hero_name
    FROM reports r
    JOIN heroes h ON h.hero_id = r.hero_id
    WHERE r.player_id = ${player.player_id}
    AND r.comment IS NOT NULL
    ORDER BY r.reported_at DESC
  `

  // Get all heroes for the report form
  const heroes = await prisma.heroes.findMany({
    select: { hero_id: true, hero_name: true},
  })

  // Transform raw comments into the expected format
  const comments: Comment[] = rawComments.map((rawComment) => ({
    hero_id: rawComment.hero_id,
    comment: rawComment.comment,
    reported_at: rawComment.reported_at,
    rating: rawComment.rating,
    hero: {
      hero_name: rawComment.hero_name,
    },
  }))


  return { player, heroStats, comments, heroes }
}

export default async function PlayerPage({ params }: { params: { username: string } }) {
  const data = await getPlayerData(params.username)

  if (!data) {
    notFound()
  }

  const { player, heroStats, comments, heroes } = data

  const commentsByHero = comments.reduce(
    (acc, comment) => {
      const heroId = comment.hero_id
      if (!acc[heroId]) {
        acc[heroId] = []
      }
      acc[heroId].push(comment)
      return acc
    },
    {} as Record<number, Comment[]>,
  )

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gradient-to-b from-gray-900 to-gray-800">
      <h1 className="text-4xl font-bold mb-8 text-red-500">Marvel Rivals Player: {player.username}</h1>
      <Card className="bg-gray-800 text-white w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-between">
              <Avatar className="h-8 w-8 bg-gray-800">
                <AvatarFallback className="bg-gray-800 text-white">
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-2xl">{player.username}</CardTitle>
            </div>
            <ReportForm username={player.username} heroes={heroes} />
          </div>
        </CardHeader>
        <CardContent>
          <h2 className="text-xl font-semibold mb-4">Hero Statistics</h2>
          <div className="grid gap-4">
            {heroStats.map((stat) => (
              <div key={stat.hero_id} className="bg-gray-700/50 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`/heroes/${stat.hero_id}.png`} alt={stat.hero_name} />
                      <AvatarFallback>{stat.hero_name[0]}</AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-semibold text-red-400">{stat.hero_name}</h3>
                  </div>
                  <CommentsDialog heroName={stat.hero_name} comments={commentsByHero[stat.hero_id] || []} />
                </div>
                <div className="grid grid-cols-2 gap-y-2">
                  <div className="text-gray-400">Total Reports:</div>
                  <div className="font-medium">{Number(stat.total_reports) || 0}</div>
                  <div className="text-gray-400">Average Rating:</div>
                  <div className="font-medium">{Number(stat.avg_rating).toFixed(2)}</div>
                  <div className="text-gray-400">Lord Reports:</div>
                  <div className="font-medium">{Number(stat.lord_reports) || 0}</div>
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
            {heroStats.length === 0 && (
              <div className="text-center py-4 text-gray-400">No hero statistics available for this player</div>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  )
}

