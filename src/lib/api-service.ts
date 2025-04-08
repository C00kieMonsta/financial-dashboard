"use server";

// Types for API responses
export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

export interface MarketStatus {
  marketCap: number;
  gdp: number;
  ratio: number;
  status: "Undervalued" | "Fair Value" | "Overvalued";
}

// The correct Polygon.io API endpoints
const POLYGON_BASE_URL = "https://api.polygon.io";
const STOCK_PREVIOUS_CLOSE_ENDPOINT = "/v2/aggs/ticker";
const US_MARKET_ENDPOINT = "/v2/aggs/ticker/SPY/prev"; // Using SPY as proxy for market
const US_GDP_ENDPOINT = "/v3/reference/tickers/I:GDP"; // US GDP indicator ticker

// Fetch stock quote data for a single stock (AAPL)
export async function fetchStockQuote(symbol: string = "AAPL", apiKey: string): Promise<StockQuote> {
  try {
    // Get previous day's data for the stock
    const response = await fetch(`${POLYGON_BASE_URL}${STOCK_PREVIOUS_CLOSE_ENDPOINT}/${symbol}/prev?apiKey=${apiKey}`, { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      throw new Error(`Failed to fetch quote for ${symbol}`);
    }

    const result = data.results[0];
    const prevClose = result.c || 0;
    const open = result.o || 0;
    const change = prevClose - open;
    const changePercent = open > 0 ? (change / open) * 100 : 0;

    return {
      symbol,
      price: prevClose,
      change,
      changePercent,
    };
  } catch (error) {
    console.error(`Error fetching stock quote for ${symbol}:`, error);
    throw error;
  }
}

// Fetch approximate market cap using SPY data (for Warren Buffett Indicator)
export async function fetchGlobalMarketCap(apiKey: string): Promise<number> {
  try {
    // Using SPY (S&P 500 ETF) as proxy for market capitalization
    const response = await fetch(`${POLYGON_BASE_URL}${US_MARKET_ENDPOINT}?apiKey=${apiKey}`, { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      throw new Error("Failed to fetch market data");
    }

    // SPY represents roughly 1/10th of the S&P 500 index value
    // S&P 500 total market cap is approximately $40 trillion in 2023
    // Using the SPY value to approximate the total market cap
    const spyValue = data.results[0].c || 0; // Using closing price instead of 'value'

    // Approximating US market cap
    // SPY × 23 trillion / 450 (SPY's approximate value) gives us a rough market cap estimate
    return spyValue * (23000000000000 / 450);
  } catch (error) {
    console.error("Error fetching market cap data:", error);
    // Return a fallback value if we can't fetch the data
    return 40000000000000; // $40 trillion as fallback
  }
}

// Fetch GDP data for Warren Buffett Indicator
export async function fetchGDP(apiKey: string): Promise<number> {
  try {
    // Fetch US GDP ticker details
    const response = await fetch(`${POLYGON_BASE_URL}${US_GDP_ENDPOINT}?apiKey=${apiKey}`, { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.results) {
      throw new Error("Failed to fetch GDP data");
    }

    // Extract the latest GDP value
    // Since Polygon doesn't directly expose GDP as a simple value,
    // we'll take the last price as an approximation of the GDP in trillions
    const gdpInTrillions = data.results.last_price || 25; // Fallback to ~25 trillion if data not available

    // Convert to full number
    return gdpInTrillions * 1000000000000;
  } catch (error) {
    console.error("Error fetching GDP data:", error);

    // Return approximate US GDP (about $25 trillion) if we can't fetch it
    return 25000000000000;
  }
}

// Calculate Warren Buffett Indicator
export async function calculateBuffettIndicator(apiKey: string): Promise<MarketStatus> {
  try {
    const marketCap = await fetchGlobalMarketCap(apiKey);
    const gdp = await fetchGDP(apiKey);
    const ratio = marketCap / gdp;

    // Determine market status based on ratio
    let status: "Undervalued" | "Fair Value" | "Overvalued";
    if (ratio < 0.8) {
      status = "Undervalued";
    } else if (ratio < 1.2) {
      status = "Fair Value";
    } else {
      status = "Overvalued";
    }

    return {
      marketCap,
      gdp,
      ratio,
      status,
    };
  } catch (error) {
    console.error("Error calculating Buffett Indicator:", error);
    throw error;
  }
}
