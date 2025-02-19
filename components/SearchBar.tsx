"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function SearchBar() {
  const [username, setUsername] = useState("")
  const router = useRouter()

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault()
    if (username.trim()) {
      router.push(`/player/${encodeURIComponent(username)}`)
    }
  }

  return (
    <form onSubmit={handleSearch} className="w-full max-w-md mb-12">
      <div className="flex space-x-2">
        <Input
          type="text"
          placeholder="Enter username"
          className="flex-grow"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <Button type="submit">Search</Button>
      </div>
    </form>
  )
}
