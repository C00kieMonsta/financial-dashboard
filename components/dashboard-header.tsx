import Link from "next/link"
import { LineChart, RefreshCw, Settings } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <LineChart className="h-6 w-6" />
          <h1 className="text-xl font-bold">FinDash</h1>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="#" className="font-medium transition-colors hover:text-primary">
            Dashboard
          </Link>
          <Link href="#" className="font-medium text-muted-foreground transition-colors hover:text-primary">
            Watchlist
          </Link>
          <Link href="#" className="font-medium text-muted-foreground transition-colors hover:text-primary">
            News
          </Link>
          <Link href="#" className="font-medium text-muted-foreground transition-colors hover:text-primary">
            Analysis
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
            <span className="sr-only">Refresh data</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
                <span className="sr-only">Settings</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Settings</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Data Sources</DropdownMenuItem>
              <DropdownMenuItem>Display Options</DropdownMenuItem>
              <DropdownMenuItem>Refresh Rate</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Account</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
