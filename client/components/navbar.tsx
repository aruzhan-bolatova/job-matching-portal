"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Briefcase, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { useAuth } from "@/hooks/use-auth"

export function Navbar() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout } = useAuth()

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const closeMenu = () => setIsMenuOpen(false)

  // Close menu when path changes
  useEffect(() => {
    closeMenu()
  }, [pathname])

  return (
    <header className="sticky top-0 z-50 px-10 w-full border-b bg-background/95 backdrop-blur">
      <div className=" flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Briefcase className="h-5 w-5" />
            <span>GradSearch</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/jobs"
            className={`text-sm font-medium ${pathname === "/jobs" ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
          >
            Jobs
          </Link>
          {user?.role === "employer" && (
            <Link
              href="/dashboard/employer"
              className={`text-sm font-medium ${pathname.includes("/dashboard/employer") ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
            >
              Employer Dashboard
            </Link>
          )}
          {user?.role === "jobseeker" && (
            <Link
              href="/dashboard/jobseeker"
              className={`text-sm font-medium ${pathname.includes("/dashboard/jobseeker") ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
            >
              My Applications
            </Link>
          )}
          {user ? (
            <div className="flex items-center gap-4">
              <Link href="/profile">
                <Button variant="ghost" size="sm">
                  Profile
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={() => logout()}>
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>
          )}
          <ModeToggle />
        </nav>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center gap-4">
          <ModeToggle />
          <Button variant="ghost" size="icon" onClick={toggleMenu}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-50 bg-background border-t">
          <nav className="container flex flex-col py-8 gap-4">
            <Link
              href="/jobs"
              className={`px-4 py-2 text-lg ${pathname === "/jobs" ? "font-medium text-primary" : "text-muted-foreground"}`}
            >
              Jobs
            </Link>
            {user?.role === "employer" && (
              <Link
                href="/dashboard/employer"
                className={`px-4 py-2 text-lg ${pathname.includes("/dashboard/employer") ? "font-medium text-primary" : "text-muted-foreground"}`}
              >
                Employer Dashboard
              </Link>
            )}
            {user?.role === "jobseeker" && (
              <Link
                href="/dashboard/jobseeker"
                className={`px-4 py-2 text-lg ${pathname.includes("/dashboard/jobseeker") ? "font-medium text-primary" : "text-muted-foreground"}`}
              >
                My Applications
              </Link>
            )}
            {user ? (
              <>
                <Link href="/profile" className="px-4 py-2 text-lg text-muted-foreground">
                  Profile
                </Link>
                <Button
                  variant="ghost"
                  className="justify-start px-4 h-auto py-2 text-lg font-normal"
                  onClick={() => logout()}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="px-4 py-2 text-lg text-muted-foreground">
                  Login
                </Link>
                <Link href="/auth/register" className="px-4 py-2 text-lg text-muted-foreground">
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}

