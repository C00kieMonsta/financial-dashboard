import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingDown, TrendingUp } from "lucide-react"
import type { StockQuote } from "@/lib/api-service"

export function StockQuoteCard({ quote }: { quote: StockQuote }) {
  const isPositive = quote.change >= 0

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{quote.symbol}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline justify-between">
          <p className="text-2xl font-bold">${quote.price.toFixed(2)}</p>
          <div className={`flex items-center ${isPositive ? "text-green-600" : "text-red-600"}`}>
            {isPositive ? <TrendingUp className="mr-1 h-4 w-4" /> : <TrendingDown className="mr-1 h-4 w-4" />}
            <span className="font-medium">
              {isPositive ? "+" : ""}
              {quote.change.toFixed(2)} ({isPositive ? "+" : ""}
              {quote.changePercent.toFixed(2)}%)
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
