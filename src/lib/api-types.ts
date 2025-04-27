// Common types for API requests and responses

export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  timestamp?: number;
}

export interface MarketStatus {
  marketCap: number;
  gdp: number;
  ratio: number;
  status: "Undervalued" | "Fair Value" | "Overvalued";
}

export interface EconomicIndicator {
  name: string;
  value: number;
  date: string;
}

export interface StockTimeSeriesData {
  timestamp: number;
  price: number;
}

export interface StockTimeSeriesResponse {
  symbol: string;
  series: StockTimeSeriesData[];
}

// Common stock symbols to track
export const STOCK_SYMBOLS = ["AAPL", "MSFT", "GOOGL", "AMZN", "SPY", "QQQ", "X:BTCUSD"];