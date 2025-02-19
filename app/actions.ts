"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function submitReport(formData: FormData, user_ip: string) {
  const username = formData.get("username") as string
  const hero_id = Number.parseInt(formData.get("hero_id") as string)
  const rating = Number.parseInt(formData.get("rating") as string)
  const comment = formData.get("comment") as string
  const isLord = formData.get("isLord") === "on"

  try {
    let player = await prisma.players.findUnique({ where: { username } })

    if (!player) {
      player = await prisma.players.create({ data: { username } })
    }

    await prisma.reports.create({
      data: {
        player_id: player.player_id,
        hero_id,
        rating,
        comment,
        user_ip, // Now properly passing the user's IP address
      },
    })

    if (isLord) {
      await prisma.lord_reports.create({
        data: {
          player_id: player.player_id,
          hero_id,
          user_ip,
        },
      })
    }

    revalidatePath(`/player/${encodeURIComponent(username)}`)
    return { success: true }
  } catch (error) {
    console.error("Failed to submit report:", error)
    return { success: false, error: "Failed to submit report" }
  }
}
