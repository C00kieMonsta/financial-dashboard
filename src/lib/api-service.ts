"use server";

// Types for API responses
export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

export interface EconomicIndicator {
  name: string;
  value: number;
  date: string;
}

export interface MarketStatus {
  marketCap: number;
  gdp: number;
  ratio: number;
  status: "Undervalued" | "Fair Value" | "Overvalued";
}

// Define types for API responses
interface PolygonIndexResult {
  ticker: string;
  value: string;
}

interface PolygonFinancialResult {
  metric: string;
  value: string;
  date?: string;
}

// Fetch global market cap (for Warren Buffett Indicator)
export async function fetchGlobalMarketCap(apiKey: string): Promise<number> {
  try {
    // Using Polygon.io API for market cap data
    const response = await fetch(`https://api.polygon.io/v3/reference/market-indices?apiKey=${apiKey}`, {
      cache: "no-store",
    });

    // Check if response is ok before parsing JSON
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.status === "ERROR") {
      throw new Error(data.error || "Failed to fetch market cap data");
    }

    // Extract global market cap from response
    // Note: This is an approximation as Polygon doesn't directly provide global market cap
    // Using S&P 500 market cap as a proxy and scaling
    const sp500Index = data.results?.find((idx: PolygonIndexResult) => idx.ticker === "SPX");
    return Number.parseFloat(sp500Index?.value || "0") * 1e12; // Approximate global market cap
  } catch (error) {
    console.error("Error fetching global market cap:", error);
    throw error;
  }
}

// Fetch GDP data (for Warren Buffett Indicator)
export async function fetchGDP(apiKey: string): Promise<number> {
  try {
    // Using Polygon.io API for economic data
    const response = await fetch(`https://api.polygon.io/v2/reference/financials/US?apiKey=${apiKey}`, {
      cache: "no-store",
    });

    // Check if response is ok before parsing JSON
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.status === "ERROR") {
      throw new Error(data.error || "Failed to fetch GDP data");
    }

    // Get the most recent GDP value
    const gdpData = data.results?.find((item: PolygonFinancialResult) => item.metric === "GDP");
    const latestGDP = gdpData?.value || "0";
    return Number.parseFloat(latestGDP) * 1000000000; // Convert to same scale as market cap
  } catch (error) {
    console.error("Error fetching GDP data:", error);
    throw error;
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

// Fetch stock quote data
export async function fetchStockQuote(symbol: string, apiKey: string): Promise<StockQuote> {
  try {
    const response = await fetch(`https://api.polygon.io/v2/aggs/ticker/${symbol}/prev?apiKey=${apiKey}`, {
      cache: "no-store",
    });

    // Check if response is ok before parsing JSON
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.status === "ERROR") {
      throw new Error(data.error || `Failed to fetch quote for ${symbol}`);
    }

    const quote = data.results?.[0] || {};
    const prevClose = quote.c || 0;
    const open = quote.o || 0;
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

// Fetch economic indicator
export async function fetchEconomicIndicator(indicator: string, apiKey: string): Promise<EconomicIndicator> {
  try {
    // Map indicator names to Polygon.io endpoints
    const indicatorEndpoints: Record<string, string> = {
      GDP: "reference/financials/US",
      INFLATION: "reference/financials/US",
      UNEMPLOYMENT: "reference/financials/US",
    };

    const endpoint = indicatorEndpoints[indicator] || "reference/financials/US";

    const response = await fetch(`https://api.polygon.io/v2/${endpoint}?apiKey=${apiKey}`, {
      cache: "no-store",
    });

    // Check if response is ok before parsing JSON
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.status === "ERROR") {
      throw new Error(data.error || `Failed to fetch indicator ${indicator}`);
    }

    const indicatorData = data.results?.find((item: PolygonFinancialResult) => item.metric === indicator);
    return {
      name: indicator,
      value: Number.parseFloat(indicatorData?.value || "0"),
      date: indicatorData?.date || "",
    };
  } catch (error) {
    console.error(`Error fetching economic indicator ${indicator}:`, error);
    throw error;
  }
}
