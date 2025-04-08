import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { EconomicIndicator } from "@/lib/api-service"

export function EconomicIndicatorCard({ indicator }: { indicator: EconomicIndicator }) {
  // Format indicator name for display
  const formatIndicatorName = (name: string) => {
    return name
      .replace(/_/g, " ")
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  // Format indicator value based on type
  const formatValue = (indicator: EconomicIndicator) => {
    switch (indicator.name) {
      case "REAL_GDP":
        return `$${(indicator.value / 1000).toFixed(2)} trillion`
      case "INFLATION":
        return `${indicator.value.toFixed(2)}%`
      case "UNEMPLOYMENT":
        return `${indicator.value.toFixed(2)}%`
      default:
        return indicator.value.toString()
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{formatIndicatorName(indicator.name)}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-2xl font-bold">{formatValue(indicator)}</p>
          <p className="text-sm text-gray-500">Last updated: {new Date(indicator.date).toLocaleDateString()}</p>
        </div>
      </CardContent>
    </Card>
  )
}
