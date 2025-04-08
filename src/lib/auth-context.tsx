"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type AuthContextType = {
  apiKey: string | null
  setApiKey: (key: string) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [apiKey, setApiKey] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  useEffect(() => {
    // Check if API key exists in localStorage on component mount
    const storedApiKey = localStorage.getItem("alphavantage_api_key")
    if (storedApiKey) {
      setApiKey(storedApiKey)
      setIsAuthenticated(true)
    }
  }, [])

  const handleSetApiKey = (key: string) => {
    localStorage.setItem("alphavantage_api_key", key)
    setApiKey(key)
    setIsAuthenticated(true)
  }

  const logout = () => {
    localStorage.removeItem("alphavantage_api_key")
    setApiKey(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider
      value={{
        apiKey,
        setApiKey: handleSetApiKey,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
