"use client" // Ensures this component runs on the client side in Next.js

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

const API_BASE_URL = "http://localhost:5001"

type User = {
  id: string
  name: string
  email: string
  role: "employer" | "jobseeker"
  skills?: string[]
}

type AuthContextType = {
  user: User | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, role: "employer" | "jobseeker") => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  // Load token from localStorage on initial load
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken")
    const storedUser = localStorage.getItem("authUser") // Retrieve user data from localStorage

    if (storedToken) {
      setToken(storedToken)

      if (storedUser) {
        setUser(JSON.parse(storedUser)) // Restore user data from localStorage
      }

      checkUserWithToken(storedToken) // Verify token validity with the server
    } else {
      setLoading(false)
    }
  }, [])

  // Check user with token
  const checkUserWithToken = async (authToken: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data)
      } else {
        // If token is invalid, clear it
        localStorage.removeItem("authToken")
        setToken(null)
      }
    } catch (error) {
      console.error("Error checking auth status:", error)
      localStorage.removeItem("authToken")
      setToken(null)
    } finally {
      setLoading(false)
    }
  }

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })
  
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Login failed")
      }
  
      const data = await response.json()
  
      if (data.token) {
        // Save token and user data to localStorage
        localStorage.setItem("authToken", data.token)
        localStorage.setItem("authUser", JSON.stringify(data.user || data)) // Save user data
        setToken(data.token)
        setUser(data.user || data)
  
        toast({
          title: "Login successful",
          description: "Welcome back!",
        })
  
        // Redirect based on user role
        if (data.user?.role === "employer" || data.role === "employer") {
          router.push("/dashboard/employer")
        } else {
          router.push("/jobs")
        }
      } else {
        throw new Error("No token received from server")
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error instanceof Error ? error.message : "Please check your credentials and try again",
      })
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Register function
  const register = async (name: string, email: string, password: string, role: "employer" | "jobseeker") => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, role }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Registration failed")
      }

      const data = await response.json()

      // Save token and user data
      if (data.token) {
        localStorage.setItem("authToken", data.token)
        setToken(data.token)
        setUser(data.user || data)

        toast({
          title: "Registration successful",
          description: "Your account has been created",
        })

        // Redirect based on role
        if (data.user?.role === "employer" || data.role === "employer") {
          router.push("/dashboard/employer")
        } else {
          router.push("/jobs")
        }
      } else {
        throw new Error("No token received from server")
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Please try again with different information",
      })
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Logout function
  const logout = async () => {
    try {
      // Clear local storage and state
      localStorage.removeItem("authToken")
      setToken(null)
      setUser(null)

      router.push("/")
      toast({
        title: "Logged out successfully",
      })
    } catch (error) {
      console.error("Logout error:", error)
      // Still clear token and user even if the API call fails
      localStorage.removeItem("authToken")
      setToken(null)
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>{children}</AuthContext.Provider>
  )
}

// Custom hook to use authentication context
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}