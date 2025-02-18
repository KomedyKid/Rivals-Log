import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const username = searchParams.get("username")

  if (typeof username !== "string" || username.length === 0) {
    return NextResponse.json({ error: "Invalid username" }, { status: 400 })
  }

  return NextResponse.redirect(new URL(`/player/${username}`, request.url))
}

