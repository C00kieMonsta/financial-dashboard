import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function EconomicIndicators() {
  // Placeholder data - would be fetched from an API in a real application
  const indicators = [
    {
      name: "Inflation Rate (CPI)",
      value: "3.2%",
      previous: "3.4%",
      change: -0.2,
      positive: true,
      date: "Feb 2024",
    },
    {
      name: "Unemployment Rate",
      value: "3.9%",
      previous: "3.7%",
      change: 0.2,
      positive: false,
      date: "Mar 2024",
    },
    {
      name: "GDP Growth Rate",
      value: "2.1%",
      previous: "1.9%",
      change: 0.2,
      positive: true,
      date: "Q4 2023",
    },
    {
      name: "Federal Funds Rate",
      value: "5.25-5.50%",
      previous: "5.25-5.50%",
      change: 0,
      positive: true,
      date: "Mar 2024",
    },
    {
      name: "Consumer Sentiment",
      value: "76.5",
      previous: "79.0",
      change: -2.5,
      positive: false,
      date: "Mar 2024",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Economic Indicators</CardTitle>
        <CardDescription>Key economic data points</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Indicator</TableHead>
              <TableHead>Current</TableHead>
              <TableHead>Previous</TableHead>
              <TableHead>Change</TableHead>
              <TableHead className="text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {indicators.map((indicator) => (
              <TableRow key={indicator.name}>
                <TableCell className="font-medium">{indicator.name}</TableCell>
                <TableCell>{indicator.value}</TableCell>
                <TableCell>{indicator.previous}</TableCell>
                <TableCell>
                  <div
                    className={`flex items-center ${
                      indicator.change === 0
                        ? "text-muted-foreground"
                        : indicator.positive
                          ? "text-green-500"
                          : "text-red-500"
                    }`}
                  >
                    {indicator.change > 0 ? (
                      <ArrowUpIcon className="h-4 w-4 mr-1" />
                    ) : indicator.change < 0 ? (
                      <ArrowDownIcon className="h-4 w-4 mr-1" />
                    ) : null}
                    {Math.abs(indicator.change)}
                  </div>
                </TableCell>
                <TableCell className="text-right">{indicator.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
