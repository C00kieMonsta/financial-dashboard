"use client";

import { StockQuoteCard } from "@/components/stock-quote-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WarrenBuffettIndicator } from "@/components/warren-buffett-indicator";
import { calculateBuffettIndicator, fetchStockQuote, type MarketStatus, type StockQuote } from "@/lib/api-service";
import { useAuth } from "@/lib/auth-context";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { apiKey } = useAuth();
  const [buffettIndicator, setBuffettIndicator] = useState<MarketStatus | null>(null);
  const [stockQuote, setStockQuote] = useState<StockQuote | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Only tracking AAPL stock
  const stockSymbol = "AAPL";

  useEffect(() => {
    if (!apiKey) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch Warren Buffett Indicator
        const buffettData = await calculateBuffettIndicator(apiKey);
        setBuffettIndicator(buffettData);

        // Fetch stock quote for AAPL
        const quote = await fetchStockQuote(stockSymbol, apiKey);
        setStockQuote(quote);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to fetch financial data. Please check your API key or try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [apiKey, stockSymbol]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="grid gap-6">
          <div className="flex items-center justify-center py-12">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive" className="max-w-md mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-3xl font-bold text-center">Financial Dashboard</h1>

      <div className="grid gap-6">
        {/* Warren Buffett Indicator */}
        {buffettIndicator && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Warren Buffett Indicator</CardTitle>
              <CardDescription>Market Cap to GDP Ratio - A measure of stock market valuation</CardDescription>
            </CardHeader>
            <CardContent>
              <WarrenBuffettIndicator data={buffettIndicator} />
            </CardContent>
          </Card>
        )}

        {/* Single Stock Quote - AAPL */}
        {stockQuote && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Stock Quote</CardTitle>
              <CardDescription>Latest stock price data from Polygon.io</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-w-sm mx-auto">
                <StockQuoteCard quote={stockQuote} />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}