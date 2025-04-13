"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building, MapPin, Search, DollarSign } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { getJobs, type Job } from "../api-service"
import Chatbot from "@/components/Chatbot";

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [location, setLocation] = useState("")
  const [category, setCategory] = useState("all")
  const [jobType, setJobType] = useState("all")
  const { toast } = useToast()

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async (params?: Record<string, string>) => {
    try {
      setLoading(true)
      const data = await getJobs(params)
      setJobs(data)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load jobs. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    const params: Record<string, string> = {}
    if (searchTerm) params.search = searchTerm
    if (location) params.location = location
    if (category && category !== "all") params.category = category
    if (jobType && jobType !== "all") params.type = jobType

    fetchJobs(params)
  }

  // Format salary range for display
  const formatSalary = (salary?: { min: number; max: number; currency: string }) => {
    if (!salary) return null

    const { min, max, currency } = salary

    // If both min and max are 0, don't display
    if (min === 0 && max === 0) return null

    // Format based on currency
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 0,
    })

    // If only one value is provided
    if (min === 0) return `Up to ${formatter.format(max)}`
    if (max === 0) return `From ${formatter.format(min)}`

    // Both values provided
    return `${formatter.format(min)} - ${formatter.format(max)}`
  }

  return (
    <div className="px-10 py-8">
      <h1 className="text-3xl font-bold mb-8">Browse Jobs</h1>

      {/* Search and filters */}
      <div className="bg-card rounded-lg p-6 mb-8 shadow-sm">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="space-y-2">
            <label htmlFor="search" className="text-sm font-medium">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Job title or keyword"
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="location" className="text-sm font-medium">
              Location
            </label>
            <Input
              id="location"
              placeholder="City or remote"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium">
              Category
            </label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="education">Education</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="job-type" className="text-sm font-medium">
              Job Type
            </label>
            <Select value={jobType} onValueChange={setJobType}>
              <SelectTrigger id="job-type">
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="full-time">Full-time</SelectItem>
                <SelectItem value="part-time">Part-time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button className="w-full mt-4" onClick={handleSearch}>
          Search Jobs
        </Button>
      </div>

      {/* Job listings */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
          <p className="text-muted-foreground">Try adjusting your search criteria</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <Link href={`/jobs/${job.id || job._id}`} key={job.id || job._id}>
              <Card className="h-full transition-all hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{job.title}</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <Building className="h-3.5 w-3.5" />
                        {job.company}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/10 dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-400/30">
                      {job.type}
                    </span>
                    {job.category && (
                      <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-600/10 dark:bg-purple-500/10 dark:text-purple-400 dark:ring-purple-400/30">
                        {job.category}
                      </span>
                    )}
                    {job.status === "closed" && (
                      <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-400/30">
                        Closed
                      </span>
                    )}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground gap-1 mb-2">
                    <MapPin className="h-3.5 w-3.5" />
                    {job.location}
                  </div>
                  {job.salary && formatSalary(job.salary) && (
                    <div className="flex items-center text-sm gap-1">
                      <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="font-medium">{formatSalary(job.salary)}</span>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="pt-0">
                  <div className="text-sm text-muted-foreground">
                    Posted {new Date(job.createdAt as string).toLocaleDateString()}
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
      <Chatbot />
    </div>
  )
}

