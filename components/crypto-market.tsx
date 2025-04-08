import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function CryptoMarket() {
  // Placeholder data - would be fetched from CoinMarketCap API in a real application
  const cryptos = [
    {
      name: "Bitcoin",
      symbol: "BTC",
      price: "$66,432.18",
      change: 2.34,
      positive: true,
    },
    {
      name: "Ethereum",
      symbol: "ETH",
      price: "$3,475.62",
      change: 1.87,
      positive: true,
    },
    {
      name: "Solana",
      symbol: "SOL",
      price: "$142.45",
      change: -3.21,
      positive: false,
    },
    {
      name: "XRP",
      symbol: "XRP",
      price: "$0.5216",
      change: -0.78,
      positive: false,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crypto Market</CardTitle>
        <CardDescription>Top cryptocurrencies by market cap</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {cryptos.map((crypto) => (
            <div key={crypto.symbol} className="flex items-center justify-between">
              <div>
                <div className="font-medium">{crypto.name}</div>
                <div className="text-sm text-muted-foreground">{crypto.symbol}</div>
              </div>
              <div className="text-right">
                <div className="font-medium">{crypto.price}</div>
                <div
                  className={`flex items-center justify-end text-sm ${
                    crypto.positive ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {crypto.positive ? (
                    <ArrowUpIcon className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDownIcon className="h-4 w-4 mr-1" />
                  )}
                  {crypto.change}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
