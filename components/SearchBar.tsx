"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, Search, X } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export default function SearchBar() {
  const [username, setUsername] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSearch = useCallback(
    async (event?: React.FormEvent) => {
      event?.preventDefault()
      if (!username.trim()) {
        toast.error("Please enter a username")
        return
      }
      setIsLoading(true)
      router.push(`/player/${encodeURIComponent(username.trim())}`)
    },
    [username, router]
  )

  const handleReset = useCallback(() => {
    setUsername("")
  }, [])

  return (
    <div className="mx-auto transition-all duration-300 ease-in-out">
      <form
        onSubmit={handleSearch}
        // Expands from narrow to wide when user types
        className={cn(
          "relative transition-all duration-300 ease-in-out mx-auto",
          username ? "w-full max-w-3xl" : "w-[280px]"
        )}
      >
        {/* 
          We remove border/background from this parent container
          so there's no "extra box" around the input.
        */}
        <div
          className={cn(
            "flex flex-col gap-3 transition-all duration-300",
            // If you want the container to grow in padding as typed, keep these:
            username ? "p-4" : "p-1"
          )}
        >
          {/* The input itself gets the box styling (border, background). */}
          <div className="relative">
            <Input
              id="search-input"
              type="text"
              placeholder={username ? "Enter player name..." : "Search players..."}
              aria-label="Search for a player"
              className={cn(
                "transition-all duration-300 ease-in-out w-full",
                // A visible box:
                "border border-gray-700 bg-gray-800 rounded-md",
                // Center the typed text:
                "text-center text-white placeholder:text-gray-400",
                // Hide the placeholder on focus:
                "focus:placeholder-transparent",
                // Expand the size when user starts typing:
                username ? "h-12 text-lg px-4" : "h-10 text-sm px-3"
              )}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            {username && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleReset}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Clear search</span>
              </Button>
            )}
          </div>

          {/* Slide-in Search Button (only visible when there's input) */}
          <div
            className={cn(
              "overflow-hidden transition-all duration-300",
              username ? "h-14 opacity-100" : "h-0 opacity-0"
            )}
          >
            <Button
              type="submit"
              disabled={isLoading}
              className="
                w-full h-12 text-base
                bg-red-500 hover:bg-red-600
                text-white
                rounded-md
                transition-colors
              "
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <Search className="w-5 h-5 mr-2" />
              )}
              Search Player
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
