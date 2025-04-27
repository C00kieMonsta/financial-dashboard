import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StockQuoteCard } from "@/components/stock-quote-card";
import type { StockQuote } from "@/lib/api-types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MultiStockQuotesProps {
  quotes: StockQuote[];
  title?: string;
  description?: string;
}

// Group quotes by category
function groupQuotes(quotes: StockQuote[]) {
  const stockQuotes = quotes.filter(q => !q.symbol.includes(":") && !q.symbol.match(/^(SPY|QQQ|DIA|IWM)$/));
  const indexes = quotes.filter(q => q.symbol.match(/^(SPY|QQQ|DIA|IWM)$/));
  const crypto = quotes.filter(q => q.symbol.includes(":"));
  
  return {
    stocks: stockQuotes,
    indexes,
    crypto,
  };
}

export function MultiStockQuotes({ 
  quotes, 
  title = "Market Overview",
  description = "Latest market data from various assets"
}: MultiStockQuotesProps) {
  const { stocks, indexes, crypto } = groupQuotes(quotes);
  
  // If there are no quotes, show placeholder
  if (!quotes || quotes.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <p className="text-gray-500">No data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-gray-500">{description}</p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            {stocks.length > 0 && <TabsTrigger value="stocks">Stocks</TabsTrigger>}
            {indexes.length > 0 && <TabsTrigger value="indexes">Indexes</TabsTrigger>}
            {crypto.length > 0 && <TabsTrigger value="crypto">Crypto</TabsTrigger>}
          </TabsList>
          
          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quotes.map((quote) => (
                <StockQuoteCard key={quote.symbol} quote={quote} />
              ))}
            </div>
          </TabsContent>
          
          {stocks.length > 0 && (
            <TabsContent value="stocks">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stocks.map((quote) => (
                  <StockQuoteCard key={quote.symbol} quote={quote} />
                ))}
              </div>
            </TabsContent>
          )}
          
          {indexes.length > 0 && (
            <TabsContent value="indexes">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {indexes.map((quote) => (
                  <StockQuoteCard key={quote.symbol} quote={quote} />
                ))}
              </div>
            </TabsContent>
          )}
          
          {crypto.length > 0 && (
            <TabsContent value="crypto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {crypto.map((quote) => (
                  <StockQuoteCard key={quote.symbol} quote={quote} />
                ))}
              </div>
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
}