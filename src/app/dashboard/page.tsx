"use client";

import { MultiStockQuotes } from "@/components/multi-stock-quotes";
import { StockPriceChart } from "@/components/stock-price-chart";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { WarrenBuffettIndicator } from "@/components/warren-buffett-indicator";
import { STOCK_SYMBOLS, type MarketStatus, type StockQuote, type StockTimeSeriesResponse } from "@/lib/api-types";
import { useAuth } from "@/lib/auth-context";
import { useFinancialData } from "@/lib/use-financial-data";
import { AlertCircle, Clock, RefreshCw } from "lucide-react";
import { useState } from "react";

// Cached data message component
function CachedDataMessage({ isCached, isStale, onClick }: { isCached: boolean; isStale: boolean; onClick: () => void }) {
  if (!isCached) return null;
  
  return (
    <div className={`flex items-center justify-between mt-2 p-2 rounded-md ${isStale ? "bg-amber-50 text-amber-900" : "bg-blue-50 text-blue-900"}`}>
      <span className="flex items-center text-xs">
        <Clock className="h-3 w-3 mr-1" />
        {isStale ? "Using cached data (refresh failed)" : "Using cached data"}
      </span>
      <Button variant="secondary" size="sm" className="h-6 px-2 bg-white" onClick={onClick}>
        <RefreshCw className="h-3 w-3 mr-1 text-black" />
        <span className="text-xs text-black">Refresh</span>
      </Button>
    </div>
  );
}

export default function DashboardPage() {
  const { apiKey } = useAuth();
  const [selectedStock, setSelectedStock] = useState("AAPL");
  
  // Fetch Warren Buffett Indicator
  const { 
    data: buffettIndicator, 
    isLoading: isBuffettLoading, 
    error: buffettError,
    isCached: isBuffettCached,
    isStale: isBuffettStale,
    refetch: refetchBuffett
  } = useFinancialData<MarketStatus>("buffett-indicator");
  
  // Fetch multiple stock quotes
  const { 
    data: stockQuotes, 
    isLoading: areQuotesLoading, 
    error: quotesError,
    isCached: areQuotesCached,
    isStale: areQuotesStale,
    refetch: refetchQuotes
  } = useFinancialData<StockQuote[]>("multiple-stock-quotes", { symbols: STOCK_SYMBOLS });
  
  // Fetch time series data for selected stock
  const { 
    data: timeSeries, 
    isLoading: isTimeSeriesLoading, 
    error: timeSeriesError,
    isCached: isTimeSeriesCached,
    isStale: isTimeSeriesStale,
    refetch: refetchTimeSeries
  } = useFinancialData<StockTimeSeriesResponse>("stock-time-series", { 
    symbol: selectedStock,
    timespan: "day",
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });
  
  // Check if any data is loading
  const isAnyLoading = isBuffettLoading || areQuotesLoading || isTimeSeriesLoading;
  
  // Check for errors
  const errors = [buffettError, quotesError, timeSeriesError].filter(Boolean);
  const hasError = errors.length > 0;

  // Handle stock selection change
  const handleStockChange = (value: string) => {
    setSelectedStock(value);
  };
  
  if (!apiKey) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive" className="max-w-md mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>API Key Required</AlertTitle>
          <AlertDescription>Please enter your Polygon.io API key on the home page to use the dashboard.</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (hasError && !buffettIndicator && !stockQuotes) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive" className="max-w-md mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errors[0]}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-black">Financial Dashboard</h1>
        <Button 
          onClick={() => {
            refetchBuffett();
            refetchQuotes();
            refetchTimeSeries();
          }}
          disabled={isAnyLoading}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh All
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main content area - 8 columns on large screens */}
        <div className="lg:col-span-8 space-y-6">
          {/* Stock Quotes */}
          {areQuotesLoading ? (
            <Card className="shadow-lg">
              <CardHeader>
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-72" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Skeleton key={i} className="h-36 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {stockQuotes && (
                <div>
                  <MultiStockQuotes 
                    quotes={stockQuotes} 
                    title="Market Overview" 
                    description="Latest market data from various assets" 
                  />
                  <CachedDataMessage 
                    isCached={areQuotesCached} 
                    isStale={areQuotesStale} 
                    onClick={refetchQuotes} 
                  />
                </div>
              )}
            </>
          )}

          {/* Stock Chart */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold">Price History</h2>
              <Select value={selectedStock} onValueChange={handleStockChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a stock" />
                </SelectTrigger>
                <SelectContent>
                  {STOCK_SYMBOLS.map((symbol) => (
                    <SelectItem key={symbol} value={symbol}>
                      {symbol}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {isTimeSeriesLoading ? (
              <Card className="shadow-lg">
                <CardHeader>
                  <Skeleton className="h-8 w-48" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-80 w-full" />
                </CardContent>
              </Card>
            ) : (
              <>
                {timeSeries && (
                  <div>
                    <StockPriceChart data={timeSeries} />
                    <CachedDataMessage 
                      isCached={isTimeSeriesCached} 
                      isStale={isTimeSeriesStale} 
                      onClick={refetchTimeSeries} 
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        
        {/* Sidebar - 4 columns on large screens */}
        <div className="lg:col-span-4 space-y-6">
          {/* Warren Buffett Indicator */}
          {isBuffettLoading ? (
            <Card className="shadow-lg">
              <CardHeader>
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-72" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-72 w-full" />
              </CardContent>
            </Card>
          ) : (
            <>
              {buffettIndicator && (
                <div>
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle>Warren Buffett Indicator</CardTitle>
                      <CardDescription>Market Cap to GDP Ratio - A measure of stock market valuation</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <WarrenBuffettIndicator data={buffettIndicator} />
                    </CardContent>
                  </Card>
                  <CachedDataMessage 
                    isCached={isBuffettCached} 
                    isStale={isBuffettStale} 
                    onClick={refetchBuffett} 
                  />
                </div>
              )}
            </>
          )}
          
          {/* Info Card */}
          <Card className="shadow-lg bg-blue-50 border border-blue-200">
            <CardHeader>
              <CardTitle className="text-lg text-blue-900">About This Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm text-blue-900">
                <p>
                  This financial dashboard displays market data from Polygon.io. View stock quotes, 
                  cryptocurrency prices, and market indices at a glance.
                </p>
                <Separator className="bg-blue-200" />
                <div>
                  <p className="font-medium mb-1">Data Sources:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Market data provided by Polygon.io</li>
                    <li>Updated every minute (free API tier)</li>
                    <li>Chart data is simulated due to API limits</li>
                    <li>All data is cached for performance</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}