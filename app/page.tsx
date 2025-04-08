import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { FinancialOverview } from "@/components/financial-overview"
import { StockIndices } from "@/components/stock-indices"
import { CryptoMarket } from "@/components/crypto-market"
import { EconomicIndicators } from "@/components/economic-indicators"
import { MarketSentiment } from "@/components/market-sentiment"

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <DashboardShell className="flex-1">
        <div className="grid gap-6">
          <FinancialOverview />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <StockIndices />
            <CryptoMarket />
            <MarketSentiment />
          </div>
          <EconomicIndicators />
        </div>
      </DashboardShell>
    </div>
  )
}
