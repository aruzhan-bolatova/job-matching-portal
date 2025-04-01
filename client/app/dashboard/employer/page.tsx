"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Eye, Pencil, Plus, Trash2, Users } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { getJobs, getJobApplications, deleteJob, type Job, type JobApplication } from "@/app/api-service"

export default function EmployerDashboardPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [jobs, setJobs] = useState<Job[]>([])
  const [applications, setApplications] = useState<Record<string, JobApplication[]>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
      return
    }

    if (user.role !== "employer") {
      router.push("/jobs")
      return
    }

    fetchJobs()
  }, [user, router])

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const data = await getJobs();

      // Filter jobs to only show those posted by the current employer
      const employerJobs = data.filter((job: Job) => job.postedBy === user?.id);

      setJobs(employerJobs)

      // Fetch applications for each job
      const applicationsData: Record<string, JobApplication[]> = {}
      for (const job of employerJobs) {
        try {
          const jobId = job._id || (job.id as string)
          const jobApplications = await getJobApplications(jobId)
          applicationsData[jobId] = jobApplications
        } catch (error) {
          console.error(`Failed to fetch applications for job ${job._id || job.id}:`, error)
        }
      }

      setApplications(applicationsData)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load your jobs. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm("Are you sure you want to delete this job?")) return

    try {
      await deleteJob(jobId)

      // Update state to remove deleted job
      setJobs((prevJobs) => prevJobs.filter((job) => (job._id || job.id) !== jobId))

      toast({
        title: "Success",
        description: "Job deleted successfully",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete job. Please try again.",
      })
    }
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

  if (loading) {
    return (
      <div className="container py-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="px-10 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Employer Dashboard</h1>
        <Link href="/dashboard/employer/jobs/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Post New Job
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="jobs">
        <TabsList className="mb-6">
          <TabsTrigger value="jobs">
            <Briefcase className="mr-2 h-4 w-4" />
            My Job Listings
          </TabsTrigger>
          <TabsTrigger value="applications">
            <Users className="mr-2 h-4 w-4" />
            Applications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="jobs">
          {jobs.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">No job listings yet</h3>
                <p className="mb-6 text-muted-foreground">Start attracting candidates by posting your first job.</p>
                <Link href="/dashboard/employer/jobs/new">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Post a Job
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {jobs.map((job) => (
                <Card key={job._id || job.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{job.title}</CardTitle>
                        <CardDescription>{job.company}</CardDescription>
                      </div>
                      <div className="flex flex-col gap-1 items-end">
                        <Badge>{job.type}</Badge>
                        {job.status === "closed" && <Badge variant="destructive">Closed</Badge>}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-1">
                        <span className="font-medium">Location:</span>
                        <span className="text-muted-foreground">{job.location}</span>
                      </div>
                      {job.salary && (job.salary.min > 0 || job.salary.max > 0) && (
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Salary:</span>
                          <span className="text-muted-foreground">{formatSalary(job.salary)}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <span className="font-medium">Posted:</span>
                        <span className="text-muted-foreground">
                          {new Date(job.createdAt as string).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">Applications:</span>
                        <span className="text-muted-foreground">
                          {applications[job._id || (job.id as string)]?.length || 0}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="flex gap-2">
                      <Link href={`/jobs/${job._id || job.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Button>
                      </Link>
                      <Link href={`/dashboard/employer/jobs/${job._id || job.id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                      </Link>
                    </div>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteJob((job._id || job.id) ?? "")}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="applications">
          {Object.values(applications).flat().length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">No applications yet</h3>
                <p className="text-muted-foreground">Applications for your job listings will appear here.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              {jobs.map((job) => {
                const jobId = job._id || (job.id as string)
                const jobApplications = applications[jobId] || []
                if (jobApplications.length === 0) return null

                return (
                  <Card key={jobId}>
                    <CardHeader>
                      <CardTitle>{job.title}</CardTitle>
                      <CardDescription>
                        {jobApplications.length} application{jobApplications.length !== 1 ? "s" : ""}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {jobApplications.map((application) => (
                          <div
                            key={application._id || application.id}
                            className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                          >
                            <div>
                              <div className="font-medium">{application.applicant?.name || "Unnamed Applicant"}</div>
                              <div className="text-sm text-muted-foreground">
                                Applied {new Date(application.createdAt as string).toLocaleDateString()}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={
                                  application.status === "pending"
                                    ? "outline"
                                    : application.status === "reviewed"
                                      ? "secondary"
                                      : application.status === "accepted"
                                        ? "success"
                                        : "destructive"
                                }
                              >
                                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                              </Badge>
                              <Link href={`/dashboard/employer/applications/${application._id || application.id}`}>
                                <Button size="sm" variant="outline">
                                  View Details
                                </Button>
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

