import { type NextRequest, NextResponse } from "next/server"
import { STOCK_SYMBOLS } from "@/lib/api-types"
import { calculateBuffettIndicator, fetchStockQuote, fetchStockTimeSeries } from "@/lib/server-api-service"

// Simple server-side cache - Keep outside the route handler
const CACHE = new Map<string, { data: unknown; timestamp: number }>()
const CACHE_TTL = 60 * 1000 // 1 minute cache

export async function POST(request: NextRequest) {
  try {
    const { apiKey, dataType, params } = await request.json()

    if (!apiKey) {
      return NextResponse.json({ error: "API key is required" }, { status: 400 })
    }

    // Create a cache key based on request parameters
    const cacheKey = `${dataType}:${JSON.stringify(params)}:${apiKey}`
    
    // Check if we have cached data
    const cachedItem = CACHE.get(cacheKey)
    if (cachedItem && Date.now() - cachedItem.timestamp < CACHE_TTL) {
      return NextResponse.json({ data: cachedItem.data, cached: true })
    }

    let data

    try {
      switch (dataType) {
        case "buffett-indicator":
          data = await calculateBuffettIndicator(apiKey)
          break
        case "stock-quote":
          // Default to AAPL if no symbol provided
          const symbol = params?.symbol || "AAPL"
          data = await fetchStockQuote(symbol, apiKey)
          break
        case "multiple-stock-quotes":
          // Fetch quotes for multiple symbols
          const symbols = params?.symbols || STOCK_SYMBOLS
          const quotes = await Promise.all(
            symbols.map(async (symbol: string) => {
              try {
                return await fetchStockQuote(symbol, apiKey)
              } catch (error) {
                console.error(`Error fetching quote for ${symbol}:`, error)
                return null
              }
            })
          )
          data = quotes.filter(Boolean) // Remove any failed requests
          break
        case "stock-time-series":
          const timeSeriesSymbol = params?.symbol || "AAPL"
          const timespan = params?.timespan || "day"
          const from = params?.from
          const to = params?.to
          data = await fetchStockTimeSeries(timeSeriesSymbol, apiKey, timespan, from, to)
          break
        default:
          return NextResponse.json({ error: "Invalid data type" }, { status: 400 })
      }

      // Store in cache
      CACHE.set(cacheKey, { data, timestamp: Date.now() })
      
      return NextResponse.json({ data })
    } catch (error) {
      // If we have previously cached data for this request, return it despite the error
      const oldCachedData = CACHE.get(cacheKey)
      if (oldCachedData) {
        console.log(`API request failed, using stale cached data for ${cacheKey}`)
        return NextResponse.json({ 
          data: oldCachedData.data, 
          cached: true,
          stale: true,
          error: "Failed to fetch fresh data, using cached data" 
        })
      }
      
      throw error
    }
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Failed to fetch financial data" }, { status: 500 })
  }
}