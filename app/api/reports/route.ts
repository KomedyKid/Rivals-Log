import { NextResponse } from "next/server"
import { submitReport } from "@/app/actions"

export async function POST(request: Request) {
  try {
    // Parse the form data from the request
    const formData = await request.formData()

    // Extract the user's IP address from headers (depends on deployment)
    const user_ip =
      request.headers.get("x-forwarded-for") || // Most common proxy header
      request.headers.get("cf-connecting-ip") || // Cloudflare
      request.headers.get("x-real-ip") || // Some proxies
      "0.0.0.0" // Fallback if no IP is available

    // Pass both form data and the extracted IP to the `submitReport` function
    const result = await submitReport(formData, user_ip)

    if (result.success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 })
    }
  } catch (error) {
    console.error("Error processing report:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
