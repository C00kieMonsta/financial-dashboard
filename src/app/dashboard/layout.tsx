"use client";

import type React from "react";

import { DashboardHeader } from "@/components/dashboard-header";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && !isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  if (typeof window !== "undefined" && !isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <DashboardHeader />
      <main className="flex-1 bg-white shadow-md rounded-lg p-4">{children}</main>
    </div>
  );
}
