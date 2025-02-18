"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"

// Mock data for player information
const players = {
  IronFan2000: {
    level: 42,
    mainHero: "Iron Man",
    winRate: "58%",
    totalMatches: 523,
    rank: "Diamond",
  },
  ThorGodOfThunder: {
    level: 37,
    mainHero: "Thor",
    winRate: "62%",
    totalMatches: 412,
    rank: "Platinum",
  },
  BlackWidowAssassin: {
    level: 50,
    mainHero: "Black Widow",
    winRate: "71%",
    totalMatches: 789,
    rank: "Challenger",
  },
}

export default function Home() {
  const [username, setUsername] = useState("")
  const [playerInfo, setPlayerInfo] = useState(null)
  const [error, setError] = useState("")

  const handleSearch = () => {
    if (players[username]) {
      setPlayerInfo(players[username])
      setError("")
    } else {
      setPlayerInfo(null)
      setError("Player not found")
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-b from-gray-900 to-gray-800">
      <h1 className="text-4xl font-bold mb-8 text-red-500">Marvel Rivals Player Lookup</h1>
      <div className="w-full max-w-md">
        <div className="flex space-x-2 mb-4">
          <Input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="flex-grow"
          />
          <Button onClick={handleSearch}>
            <Search className="mr-2 h-4 w-4" /> Search
          </Button>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {playerInfo && (
          <Card className="bg-gray-800 text-white">
            <CardHeader>
              <CardTitle className="text-2xl">{username}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-gray-400">Level:</div>
                <div>{playerInfo.level}</div>
                <div className="text-gray-400">Main Hero:</div>
                <div>{playerInfo.mainHero}</div>
                <div className="text-gray-400">Win Rate:</div>
                <div>{playerInfo.winRate}</div>
                <div className="text-gray-400">Total Matches:</div>
                <div>{playerInfo.totalMatches}</div>
                <div className="text-gray-400">Rank:</div>
                <div>
                  <Badge variant="secondary" className="bg-yellow-600 text-white">
                    {playerInfo.rank}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}

