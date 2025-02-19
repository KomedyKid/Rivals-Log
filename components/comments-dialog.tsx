"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { MessageCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Comment {
  comment: string
  reported_at: Date
  rating: number
  hero: {
    hero_name: string
  }
}

interface CommentsDialogProps {
  heroName: string
  comments: Comment[]
}

export default function CommentsDialog({ heroName, comments }: CommentsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
          <MessageCircle className="h-5 w-5" />
          <span className="ml-2">{comments.length}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-gray-800 text-white">
        <DialogHeader>
          <DialogTitle>Comments for {heroName}</DialogTitle>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto">
          {comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((comment, index) => (
                <div key={index} className="bg-gray-700/50 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-sm text-gray-400">
                      {formatDistanceToNow(new Date(comment.reported_at), { addSuffix: true })}
                    </div>
                    <Badge variant="secondary" className="bg-blue-600">
                      Rating: {comment.rating}/10
                    </Badge>
                  </div>
                  <p className="text-gray-100">{comment.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-400">No comments available for this hero</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

