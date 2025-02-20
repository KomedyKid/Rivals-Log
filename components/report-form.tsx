"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Hero {
  hero_id: number
  hero_name: string
}

interface ReportFormProps {
  username: string
  heroes: Hero[]
  isNewPlayer?: boolean
}

export function ReportForm({ username, heroes, isNewPlayer = false }: ReportFormProps) {
  const [open, setOpen] = useState(false)
  const [isLord, setIsLord] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    // Disable the button right away
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)

    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        body: formData,
      })
      const data = await response.json()

      if (data.success) {
        // If the request is successful, you can close the dialog
        setOpen(false)
      } else {
        console.error("Error:", data.error)
        // Re-enable the button so user can try again
        setIsSubmitting(false)
      }
    } catch (error) {
      console.error("Something went wrong", error)
      // Re-enable the button on error
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-gray-800 text-white border-gray-600 hover:bg-gray-700"
        >
          {isNewPlayer ? "Add New Player" : "Report Player Info"}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white border border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">
            {isNewPlayer ? "Add New Player" : "Report Player Information"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isNewPlayer ? (
            // For new players, let the user *type* the username
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-300">
                New Player Username
              </Label>
              <Input
                type="text"
                id="username"
                name="username"
                required
                placeholder="Enter new player's name"
                className="bg-gray-800 text-white border-gray-700"
              />
            </div>
          ) : (
            // Otherwise, carry over existing username in a hidden input
            <input type="hidden" name="username" value={username} />
          )}

          <div className="space-y-2">
            <Label htmlFor="hero" className="text-gray-300">
              Hero
            </Label>
            <Select name="hero_id" required>
              <SelectTrigger className="bg-gray-800 text-white border-gray-700">
                <SelectValue placeholder="Select a hero" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                {heroes.map((hero) => (
                  <SelectItem
                    key={hero.hero_id}
                    value={hero.hero_id.toString()}
                    className="hover:bg-gray-700"
                  >
                    {hero.hero_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rating" className="text-gray-300">
              Rating (1-10)
            </Label>
            <Input
              type="number"
              id="rating"
              name="rating"
              min="1"
              max="10"
              required
              className="bg-gray-800 text-white border-gray-700"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment" className="text-gray-300">
              Comment
            </Label>
            <Textarea
              id="comment"
              name="comment"
              placeholder="Add your comment here..."
              className="bg-gray-800 text-white border-gray-700"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isLord"
              name="isLord"
              checked={isLord}
              onChange={(e) => setIsLord(e.target.checked)}
              className="bg-gray-800 border-gray-700 text-gray-300"
            />
            <Label htmlFor="isLord" className="text-gray-300">
              Report as Lord
            </Label>
          </div>

          {/* Disable the button while isSubmitting is true */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-gray-700 text-white hover:bg-gray-600"
          >
            {isSubmitting ? "Submitting..." : "Submit Report"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
