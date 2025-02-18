import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-b from-gray-900 to-gray-800">
      <h1 className="text-4xl font-bold mb-8 text-red-500">Marvel Rivals Player Lookup</h1>
      <form action="/api/search" className="w-full max-w-md">
        <div className="flex space-x-2">
          <Input type="text" name="username" placeholder="Enter username" className="flex-grow" required />
          <Button type="submit">Search</Button>
        </div>
      </form>
    </main>
  )
}

