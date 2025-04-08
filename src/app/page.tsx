"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function LoginPage() {
  const [apiKey, setApiKey] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { setApiKey: setAuthApiKey, isAuthenticated } = useAuth()
  const router = useRouter()

  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    router.push("/dashboard")
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // Validate API key by making a simple request
      const response = await fetch(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=IBM&apikey=${apiKey}`,
      )
      const data = await response.json()

      if (data["Error Message"] || data["Information"]) {
        setError("Invalid API key or API limit reached. Please try again.")
        setIsLoading(false)
        return
      }

      // Set API key in auth context
      setAuthApiKey(apiKey)
      router.push("/dashboard")
    } catch (error) {
      setError("An error occurred. Please try again.")
      console.error("Login error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Financial Dashboard</CardTitle>
          <CardDescription>Enter your AlphaVantage API key to access the dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <label htmlFor="apiKey" className="text-sm font-medium">
                  AlphaVantage API Key
                </label>
                <Input
                  id="apiKey"
                  type="text"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your API key"
                  required
                />
                <p className="text-xs text-gray-500">
                  Don&apos;t have an API key?{" "}
                  <a
                    href="https://www.alphavantage.co/support/#api-key"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Get one for free
                  </a>
                </p>
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Validating..." : "Access Dashboard"}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center text-xs text-gray-500">
          Financial data provided by AlphaVantage API
        </CardFooter>
      </Card>
    </div>
  )
}
