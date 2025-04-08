import { type NextRequest, NextResponse } from "next/server"
import { calculateBuffettIndicator, fetchStockQuote, fetchEconomicIndicator } from "@/lib/api-service"

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
        if (!params?.symbol) {
          return NextResponse.json({ error: "Symbol is required" }, { status: 400 })
        }
        data = await fetchStockQuote(params.symbol, apiKey)
        break
      case "economic-indicator":
        if (!params?.indicator) {
          return NextResponse.json({ error: "Indicator is required" }, { status: 400 })
        }
        data = await fetchEconomicIndicator(params.indicator, apiKey)
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
