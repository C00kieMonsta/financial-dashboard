import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function StockIndices() {
  // Placeholder data - would be fetched from an API in a real application
  const indices = [
    {
      name: "S&P 500",
      value: "5,234.18",
      change: 0.54,
      changeValue: "+28.35",
      positive: true,
    },
    {
      name: "Dow Jones",
      value: "39,175.62",
      change: 0.12,
      changeValue: "+48.44",
      positive: true,
    },
    {
      name: "NASDAQ",
      value: "16,384.45",
      change: -0.32,
      changeValue: "-52.56",
      positive: false,
    },
    {
      name: "Russell 2000",
      value: "2,070.16",
      change: -0.78,
      changeValue: "-16.25",
      positive: false,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stock Indices</CardTitle>
        <CardDescription>Major global market indices</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {indices.map((index) => (
            <div key={index.name} className="flex items-center justify-between">
              <div>
                <div className="font-medium">{index.name}</div>
                <div className="text-sm text-muted-foreground">US Market</div>
              </div>
              <div className="text-right">
                <div className="font-medium">{index.value}</div>
                <div
                  className={`flex items-center justify-end text-sm ${
                    index.positive ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {index.positive ? (
                    <ArrowUpIcon className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDownIcon className="h-4 w-4 mr-1" />
                  )}
                  {index.changeValue} ({index.change}%)
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
