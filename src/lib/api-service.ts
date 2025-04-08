"use server"

// Types for API responses
export interface StockQuote {
  symbol: string
  price: number
  change: number
  changePercent: number
}

export interface EconomicIndicator {
  name: string
  value: number
  date: string
}

export interface MarketStatus {
  marketCap: number
  gdp: number
  ratio: number
  status: "Undervalued" | "Fair Value" | "Overvalued"
}

// Fetch global market cap (for Warren Buffett Indicator)
export async function fetchGlobalMarketCap(apiKey: string): Promise<number> {
  try {
    const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_MARKET_CAP&apikey=${apiKey}`)
    const data = await response.json()

    if (data["Error Message"]) {
      throw new Error(data["Error Message"])
    }

    // Extract global market cap from response
    return Number.parseFloat(data.globalMarketCap || "0")
  } catch (error) {
    console.error("Error fetching global market cap:", error)
    throw error
  }
}

// Fetch GDP data (for Warren Buffett Indicator)
export async function fetchGDP(apiKey: string): Promise<number> {
  try {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=REAL_GDP&interval=quarterly&apikey=${apiKey}`,
    )
    const data = await response.json()

    if (data["Error Message"]) {
      throw new Error(data["Error Message"])
    }

    // Get the most recent GDP value
    const latestGDP = data.data?.[0]?.value || "0"
    return Number.parseFloat(latestGDP) * 1000000000 // Convert to same scale as market cap
  } catch (error) {
    console.error("Error fetching GDP data:", error)
    throw error
  }
}

// Calculate Warren Buffett Indicator
export async function calculateBuffettIndicator(apiKey: string): Promise<MarketStatus> {
  try {
    const marketCap = await fetchGlobalMarketCap(apiKey)
    const gdp = await fetchGDP(apiKey)
    const ratio = marketCap / gdp

    // Determine market status based on ratio
    let status: "Undervalued" | "Fair Value" | "Overvalued"
    if (ratio < 0.8) {
      status = "Undervalued"
    } else if (ratio < 1.2) {
      status = "Fair Value"
    } else {
      status = "Overvalued"
    }

    return {
      marketCap,
      gdp,
      ratio,
      status,
    }
  } catch (error) {
    console.error("Error calculating Buffett Indicator:", error)
    throw error
  }
}

// Fetch stock quote data
export async function fetchStockQuote(symbol: string, apiKey: string): Promise<StockQuote> {
  try {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`,
    )
    const data = await response.json()

    if (data["Error Message"]) {
      throw new Error(data["Error Message"])
    }

    const quote = data["Global Quote"]
    return {
      symbol,
      price: Number.parseFloat(quote["05. price"] || "0"),
      change: Number.parseFloat(quote["09. change"] || "0"),
      changePercent: Number.parseFloat(quote["10. change percent"]?.replace("%", "") || "0"),
    }
  } catch (error) {
    console.error(`Error fetching stock quote for ${symbol}:`, error)
    throw error
  }
}

// Fetch economic indicator
export async function fetchEconomicIndicator(indicator: string, apiKey: string): Promise<EconomicIndicator> {
  try {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=${indicator}&interval=quarterly&apikey=${apiKey}`,
    )
    const data = await response.json()

    if (data["Error Message"]) {
      throw new Error(data["Error Message"])
    }

    const latest = data.data?.[0]
    return {
      name: indicator,
      value: Number.parseFloat(latest?.value || "0"),
      date: latest?.date || "",
    }
  } catch (error) {
    console.error(`Error fetching economic indicator ${indicator}:`, error)
    throw error
  }
}
