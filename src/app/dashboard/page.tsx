"use client";

import { EconomicIndicatorCard } from "@/components/economic-indicator-card";
import { StockQuoteCard } from "@/components/stock-quote-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WarrenBuffettIndicator } from "@/components/warren-buffett-indicator";
import { calculateBuffettIndicator, fetchEconomicIndicator, fetchStockQuote, type EconomicIndicator, type MarketStatus, type StockQuote } from "@/lib/api-service";
import { useAuth } from "@/lib/auth-context";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { apiKey } = useAuth();
  const [buffettIndicator, setBuffettIndicator] = useState<MarketStatus | null>(null);
  const [stockQuotes, setStockQuotes] = useState<StockQuote[]>([]);
  const [economicIndicators, setEconomicIndicators] = useState<EconomicIndicator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Stock symbols to track
  const stockSymbols = ["AAPL", "MSFT", "GOOGL", "AMZN", "META"];

  // Economic indicators to track
  const indicators = ["REAL_GDP", "INFLATION", "UNEMPLOYMENT"];

  useEffect(() => {
    if (!apiKey) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch Warren Buffett Indicator
        const buffettData = await calculateBuffettIndicator(apiKey);
        setBuffettIndicator(buffettData);

        // Fetch stock quotes
        const quotes = await Promise.all(stockSymbols.map((symbol) => fetchStockQuote(symbol, apiKey)));
        setStockQuotes(quotes);

        // Fetch economic indicators
        const economicData = await Promise.all(indicators.map((indicator) => fetchEconomicIndicator(indicator, apiKey)));
        setEconomicIndicators(economicData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to fetch financial data. Please check your API key or try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [apiKey]);

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

        {/* Stock Quotes */}
        <Tabs defaultValue="stocks" className="mt-6">
          <TabsList className="flex justify-center mb-4">
            <TabsTrigger value="stocks" className="px-4 py-2">
              Stock Market
            </TabsTrigger>
            <TabsTrigger value="economy" className="px-4 py-2">
              Economic Indicators
            </TabsTrigger>
          </TabsList>
          <TabsContent value="stocks">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {stockQuotes.map((quote) => (
                <StockQuoteCard key={quote.symbol} quote={quote} className="shadow-md" />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="economy">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {economicIndicators.map((indicator) => (
                <EconomicIndicatorCard key={indicator.name} indicator={indicator} className="shadow-md" />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
