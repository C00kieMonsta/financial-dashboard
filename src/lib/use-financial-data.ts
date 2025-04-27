"use client"

import { useState, useEffect } from "react"
import { useAuth } from "./auth-context"
import { cacheService } from "./cache-service"

interface UseFinancialDataResult<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  isCached: boolean;
  isStale: boolean;
  refetch: () => Promise<void>;
}

export function useFinancialData<T>(dataType: string, params?: Record<string, unknown>): UseFinancialDataResult<T> {
  const { apiKey } = useAuth()
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCached, setIsCached] = useState(false)
  const [isStale, setIsStale] = useState(false)

  // Generate a cache key based on the dataType and params
  const cacheKey = `client:${dataType}:${JSON.stringify(params)}`;

  const fetchData = async (force = false) => {
    if (!apiKey) return;

    setIsLoading(true);
    setError(null);

    try {
      // Check client-side cache first if not forcing a refresh
      if (!force) {
        const cachedData = cacheService.get<T>(cacheKey);
        if (cachedData) {
          setData(cachedData);
          setIsCached(true);
          setIsLoading(false);
          return;
        }
      }

      const response = await fetch("/api/financial-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          apiKey,
          dataType,
          params,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.error && !result.data) {
        throw new Error(result.error);
      }
      
      setData(result.data);
      setIsCached(!!result.cached);
      setIsStale(!!result.stale);
      
      // Store in client-side cache
      cacheService.set(cacheKey, result.data);
    } catch (error) {
      console.error(`Error fetching ${dataType}:`, error);
      
      // Try to get data from client cache as fallback
      const cachedData = cacheService.get<T>(cacheKey);
      if (cachedData) {
        setData(cachedData);
        setIsCached(true);
        setIsStale(true);
        setError("Using cached data due to fetch error");
      } else {
        setError("Failed to fetch data. Please check your API key or try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (apiKey) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey, dataType, JSON.stringify(params)]);

  // Public refetch method
  const refetch = async () => {
    await fetchData(true);
  };

  return { data, isLoading, error, isCached, isStale, refetch };
}