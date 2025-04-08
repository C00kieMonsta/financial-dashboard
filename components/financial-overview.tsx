import { ArrowDownIcon, ArrowUpIcon, InfoIcon } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function FinancialOverview() {
  // Placeholder data - would be fetched from an API in a real application
  const buffettIndicator = {
    value: 1.89,
    change: 0.03,
    status: "Significantly Overvalued",
    description: "Market Cap to GDP Ratio (Buffett Indicator)",
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Financial Market Overview</CardTitle>
          <Tabs defaultValue="daily">
            <TabsList className="grid w-[200px] grid-cols-3">
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <CardDescription>
          Last updated: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Buffett Indicator</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <InfoIcon className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      The Buffett Indicator is the ratio of total market cap to GDP, used to determine if the market is
                      overvalued or undervalued.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">{buffettIndicator.value}</span>
              <div
                className={`flex items-center text-sm ${
                  buffettIndicator.change >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {buffettIndicator.change >= 0 ? (
                  <ArrowUpIcon className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownIcon className="h-4 w-4 mr-1" />
                )}
                {Math.abs(buffettIndicator.change)}
              </div>
            </div>
            <span className="text-sm text-muted-foreground">{buffettIndicator.description}</span>
            <span
              className={`text-sm font-medium ${
                buffettIndicator.value > 1.5
                  ? "text-red-500"
                  : buffettIndicator.value > 1
                    ? "text-yellow-500"
                    : "text-green-500"
              }`}
            >
              {buffettIndicator.status}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Market Volatility (VIX)</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">18.76</span>
              <div className="flex items-center text-sm text-red-500">
                <ArrowUpIcon className="h-4 w-4 mr-1" />
                1.24
              </div>
            </div>
            <span className="text-sm text-muted-foreground">CBOE Volatility Index</span>
            <span className="text-sm font-medium text-yellow-500">Moderate Fear</span>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">10-Year Treasury Yield</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">4.32%</span>
              <div className="flex items-center text-sm text-green-500">
                <ArrowDownIcon className="h-4 w-4 mr-1" />
                0.05
              </div>
            </div>
            <span className="text-sm text-muted-foreground">US 10-Year Bond Yield</span>
            <span className="text-sm font-medium">Trending Down</span>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Crypto Market Cap</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">$2.43T</span>
              <div className="flex items-center text-sm text-green-500">
                <ArrowUpIcon className="h-4 w-4 mr-1" />
                3.2%
              </div>
            </div>
            <span className="text-sm text-muted-foreground">Total Cryptocurrency Market Cap</span>
            <span className="text-sm font-medium">24h Change</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
