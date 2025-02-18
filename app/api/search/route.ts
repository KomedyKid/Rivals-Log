import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const formData = await request.formData()
  const username = formData.get("username")

  if (typeof username !== "string" || username.length === 0) {
    return NextResponse.json({ error: "Invalid username" }, { status: 400 })
  }

  return NextResponse.redirect(new URL(`/player/${username}`, request.url))
}

