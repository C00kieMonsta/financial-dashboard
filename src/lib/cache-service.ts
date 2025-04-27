"use client";

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

class CacheService {
  private static instance: CacheService;
  private cache: Map<string, CacheItem<unknown>>;
  private readonly DEFAULT_TTL = 60 * 1000; // 60 seconds (1 minute)

  private constructor() {
    this.cache = new Map();
  }

  public static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  public get<T>(key: string): T | null {
    const item = this.cache.get(key);

    if (!item) {
      return null;
    }

    // Check if the item has expired
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  public set<T>(key: string, data: T, ttl = this.DEFAULT_TTL): void {
    const timestamp = Date.now();
    const expiresAt = timestamp + ttl;

    this.cache.set(key, {
      data,
      timestamp,
      expiresAt,
    });
  }

  public delete(key: string): boolean {
    return this.cache.delete(key);
  }

  public clear(): void {
    this.cache.clear();
  }
}

export const cacheService = CacheService.getInstance();