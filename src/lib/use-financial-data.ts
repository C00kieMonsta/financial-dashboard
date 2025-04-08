"use client"

import { useState, useEffect } from "react"
import { useAuth } from "./auth-context"

export function useFinancialData<T>(dataType: string, params?: Record<string, any>) {
  const { apiKey } = useAuth()
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!apiKey) return

    const fetchData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch("/api/financial-data", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            apiKey,
            dataType,
            params,
          }),
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`)
        }

        const result = await response.json()
        
        if (result.error) {
          throw new Error(result.error)
        }
        
        setData(result.data)
      } catch (error) {
        console.error(`Error fetching ${dataType}:`, error)
        setError("Failed to fetch data. Please check your API key or try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [apiKey, dataType, params])

  return { data, isLoading, error }
}