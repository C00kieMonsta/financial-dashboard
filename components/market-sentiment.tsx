import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function MarketSentiment() {
  // Placeholder data - would be fetched from an API in a real application
  const sentimentData = {
    fearGreedIndex: 65,
    putCallRatio: 0.85,
    bullishPercent: 62,
    bearishPercent: 38,
  }

  // Helper function to determine sentiment label
  const getFearGreedLabel = (value: number) => {
    if (value <= 25) return "Extreme Fear"
    if (value <= 45) return "Fear"
    if (value <= 55) return "Neutral"
    if (value <= 75) return "Greed"
    return "Extreme Greed"
  }

  // Helper function to determine sentiment color
  const getFearGreedColor = (value: number) => {
    if (value <= 25) return "text-red-600"
    if (value <= 45) return "text-orange-500"
    if (value <= 55) return "text-yellow-500"
    if (value <= 75) return "text-green-500"
    return "text-emerald-600"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Sentiment</CardTitle>
        <CardDescription>Investor sentiment indicators</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Fear & Greed Index</span>
            <span className={`text-sm font-bold ${getFearGreedColor(sentimentData.fearGreedIndex)}`}>
              {sentimentData.fearGreedIndex} - {getFearGreedLabel(sentimentData.fearGreedIndex)}
            </span>
          </div>
          <Progress value={sentimentData.fearGreedIndex} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Extreme Fear</span>
            <span>Extreme Greed</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Put/Call Ratio</span>
            <span className="text-sm font-bold">{sentimentData.putCallRatio}</span>
          </div>
          <Progress value={sentimentData.putCallRatio * 100} max={200} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Bullish</span>
            <span>Bearish</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Analyst Sentiment</span>
            <span className="text-sm font-bold">{sentimentData.bullishPercent}% Bullish</span>
          </div>
          <div className="flex h-2 overflow-hidden rounded-full bg-muted">
            <div className="bg-green-500" style={{ width: `${sentimentData.bullishPercent}%` }} />
            <div className="bg-red-500" style={{ width: `${sentimentData.bearishPercent}%` }} />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Bullish {sentimentData.bullishPercent}%</span>
            <span>Bearish {sentimentData.bearishPercent}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
