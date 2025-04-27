import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, TrendingDown, TrendingUp } from "lucide-react"
import type { StockQuote } from "@/lib/api-types"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"

// Helper to format symbol name for display
const formatSymbolName = (symbol: string) => {
  if (symbol.startsWith("X:")) {
    // Handle crypto symbols
    return symbol.replace("X:", "");
  }
  
  // Handle standard stock symbols
  const indexMapping: Record<string, string> = {
    "SPY": "S&P 500 ETF",
    "QQQ": "Nasdaq 100 ETF",
    "DIA": "Dow Jones ETF",
    "IWM": "Russell 2000 ETF"
  };
  
  return indexMapping[symbol] || symbol;
};

export function StockQuoteCard({ quote }: { quote: StockQuote }) {
  const isPositive = quote.change >= 0;
  const isCrypto = quote.symbol.startsWith("X:");
  
  // Format price with appropriate precision
  const formatPrice = (price: number) => {
    if (isCrypto) {
      return price > 1000 
        ? `$${price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
        : `$${price.toFixed(2)}`;
    }
    
    return `$${price.toFixed(2)}`;
  };
  
  // Get asset type badge
  const getAssetTypeBadge = () => {
    if (isCrypto) return <Badge variant="secondary" className="text-xs text-purple-800 bg-purple-100">Crypto</Badge>;
    if (['SPY', 'QQQ', 'DIA', 'IWM'].includes(quote.symbol)) return <Badge variant="secondary" className="text-xs text-blue-800 bg-blue-100">Index</Badge>;
    return <Badge variant="secondary" className="text-xs text-green-800 bg-green-100">Stock</Badge>;
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <CardTitle className="text-lg">
              {formatSymbolName(quote.symbol)}
            </CardTitle>
            <p className="text-xs text-gray-500 mt-1">{quote.symbol}</p>
          </div>
          {getAssetTypeBadge()}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-baseline justify-between">
            <p className="text-2xl font-bold">{formatPrice(quote.price)}</p>
            <div className={`flex items-center ${isPositive ? "text-green-600" : "text-red-600"}`}>
              {isPositive ? <TrendingUp className="mr-1 h-4 w-4" /> : <TrendingDown className="mr-1 h-4 w-4" />}
              <span className="font-medium">
                {isPositive ? "+" : ""}
                {quote.change.toFixed(2)} ({isPositive ? "+" : ""}
                {quote.changePercent.toFixed(2)}%)
              </span>
            </div>
          </div>
          
          {quote.timestamp && (
            <div className="flex items-center justify-end text-xs text-gray-500">
              <Clock className="h-3 w-3 mr-1" />
              <span>Updated: {format(new Date(quote.timestamp), 'MMM d, h:mm a')}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
