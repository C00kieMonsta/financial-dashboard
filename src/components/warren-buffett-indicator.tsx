import { Progress } from "@/components/ui/progress"
import type { MarketStatus } from "@/lib/api-service"

export function WarrenBuffettIndicator({ data }: { data: MarketStatus }) {
  // Format numbers to billions with 2 decimal places
  const formatBillions = (value: number) => {
    return `$${(value / 1000000000).toFixed(2)} trillion`
  }

  // Calculate progress percentage (capped at 200%)
  const progressPercentage = Math.min(data.ratio * 100, 200)

  // Determine color based on status
  const getStatusColor = () => {
    switch (data.status) {
      case "Undervalued":
        return "text-green-600"
      case "Fair Value":
        return "text-yellow-600"
      case "Overvalued":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-2 sm:grid-cols-3">
        <div>
          <p className="text-sm font-medium text-gray-500">Market Cap</p>
          <p className="text-2xl font-bold">{formatBillions(data.marketCap)}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">GDP</p>
          <p className="text-2xl font-bold">{formatBillions(data.gdp)}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Ratio</p>
          <p className={`text-2xl font-bold ${getStatusColor()}`}>{data.ratio.toFixed(2)}</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span>Undervalued</span>
          <span>Fair Value</span>
          <span>Overvalued</span>
        </div>
        <Progress value={progressPercentage} className="h-3" />
        <div className="flex justify-between text-xs text-gray-500">
          <span>0.5</span>
          <span>0.8</span>
          <span>1.0</span>
          <span>1.2</span>
          <span>1.5+</span>
        </div>
      </div>

      <div className="rounded-lg bg-gray-100 p-4">
        <p className="font-medium">
          Market Status: <span className={getStatusColor()}>{data.status}</span>
        </p>
        <p className="mt-1 text-sm text-gray-600">
          The Warren Buffett Indicator compares the total value of the stock market to the country's GDP. A ratio above
          1.2 suggests the market may be overvalued, while below 0.8 suggests undervaluation.
        </p>
      </div>
    </div>
  )
}
