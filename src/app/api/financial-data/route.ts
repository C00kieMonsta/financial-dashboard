import { type NextRequest, NextResponse } from "next/server"
import { calculateBuffettIndicator, fetchStockQuote } from "@/lib/api-service"

export async function POST(request: NextRequest) {
  try {
    const { apiKey, dataType, params } = await request.json()

    if (!apiKey) {
      return NextResponse.json({ error: "API key is required" }, { status: 400 })
    }

    let data

    switch (dataType) {
      case "buffett-indicator":
        data = await calculateBuffettIndicator(apiKey)
        break
      case "stock-quote":
        // Default to AAPL if no symbol provided
        const symbol = params?.symbol || "AAPL"
        data = await fetchStockQuote(symbol, apiKey)
        break
      default:
        return NextResponse.json({ error: "Invalid data type" }, { status: 400 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Failed to fetch financial data" }, { status: 500 })
  }
}