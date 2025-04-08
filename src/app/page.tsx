"use client";

import type React from "react";
import { useEffect } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [apiKey, setApiKey] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { setApiKey: setAuthApiKey, isAuthenticated } = useAuth();
  const router = useRouter();

  // Use useEffect for redirection instead of doing it during render
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Validate API key by making a simple request to Polygon.io
      const response = await fetch(`https://api.polygon.io/v2/aggs/ticker/AAPL/prev?apiKey=${apiKey}`);
      const data = await response.json();

      if (response.status === 403 || !data.results) {
        setError("Invalid API key. Please check your Polygon.io API key and try again.");
        setIsLoading(false);
        return;
      }

      // Set API key in auth context
      setAuthApiKey(apiKey);
      router.push("/dashboard");
    } catch (error) {
      setError("An error occurred. Please try again.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Financial Dashboard</CardTitle>
          <CardDescription>Enter your Polygon.io API key to access the dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <label htmlFor="apiKey" className="text-sm font-medium">
                  Polygon.io API Key
                </label>
                <Input id="apiKey" type="text" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="Enter your API key" required />
                <p className="text-xs text-gray-500">
                  Don&apos;t have an API key?{" "}
                  <a href="https://polygon.io/dashboard/signup" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    Get one for free
                  </a>
                </p>
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Validating..." : "Access Dashboard"}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center text-xs text-gray-500">Financial data provided by Polygon.io API</CardFooter>
      </Card>
    </div>
  );
}
