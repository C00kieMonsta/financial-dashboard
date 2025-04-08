"use client"

import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { BarChart3, LogOut } from "lucide-react"

export function DashboardHeader() {
  const { logout } = useAuth()

  return (
    <header className="sticky top-0 z-10 border-b bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-6 w-6" />
          <Link href="/dashboard" className="text-xl font-bold">
            Financial Dashboard
          </Link>
        </div>
        <Button variant="ghost" size="icon" onClick={logout}>
          <LogOut className="h-5 w-5" />
          <span className="sr-only">Logout</span>
        </Button>
      </div>
    </header>
  )
}
