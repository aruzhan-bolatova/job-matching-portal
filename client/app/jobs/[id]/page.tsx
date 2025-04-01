"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Building, Calendar, MapPin, DollarSign, ArrowLeft, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getJobById, type Job, submitApplication } from "@/app/api-service"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/hooks/use-auth"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"

export default function JobDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [coverLetter, setCoverLetter] = useState("")
  const [resume, setResume] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [applied, setApplied] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchJob(params.id as string)
    }
  }, [params.id])

  const fetchJob = async (id: string) => {
    try {
      setLoading(true)
      const data = await getJobById(id)
      setJob(data)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load job details. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleApply = async () => {
    if (!user) {
      router.push("/auth/login")
      return
    }

    if (!job) return

    setIsSubmitting(true)
    

    try {
      const applicationData =
      {
        jobId: job._id || (job.id as string),
        coverLetter: coverLetter,
        resume:resume
      }

      console.log(applicationData)
      await submitApplication(applicationData)

      setDialogOpen(false)
      setApplied(true)

      toast({
        title: "Application submitted",
        description: "Your application has been submitted successfully.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit application. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
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
      <div className="px-10 py-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className=" px-10 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Job not found</h2>
        <Button variant="outline" onClick={() => router.push("/jobs")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Jobs
        </Button>
      </div>
    )
  }

  return (
    <div className="px-10 py-8">
      <Button variant="outline" className="mb-6" onClick={() => router.push("/jobs")}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Jobs
      </Button>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{job.title}</CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <Building className="h-4 w-4" />
                    {job.company}
                  </CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-700 hover:bg-blue-50 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/10"
                  >
                    {job.type}
                  </Badge>
                  {job.category && (
                    <Badge
                      variant="outline"
                      className="bg-purple-50 text-purple-700 hover:bg-purple-50 dark:bg-purple-500/10 dark:text-purple-400 dark:hover:bg-purple-500/10"
                    >
                      {job.category}
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-3 md:grid-cols-3">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Posted {new Date(job.createdAt as string).toLocaleDateString()}</span>
                </div>
                {formatSalary(job.salary) && (
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span>{formatSalary(job.salary)}</span>
                  </div>
                )}
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold text-lg mb-2">About the role</h3>
                <div className="text-muted-foreground whitespace-pre-line">{job.description}</div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Requirements</h3>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  {job.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Application</CardTitle>
            </CardHeader>
            <CardContent>
              {applied ? (
                <div className="flex flex-col items-center justify-center text-center py-4">
                  <CheckCircle className="h-12 w-12 text-green-500 mb-2" />
                  <h3 className="font-medium text-lg">Application Submitted</h3>
                  <p className="text-muted-foreground">Your application has been successfully submitted</p>
                </div>
              ) : (
                <p className="text-muted-foreground mb-4">Interested in this position? Submit your application now.</p>
              )}
            </CardContent>
            <CardFooter>
              {!applied && (
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      className="w-full"
                      disabled={!user || applied || user?.role === "employer" || job.status === "closed"}
                    >
                      {job.status === "closed"
                        ? "This position is closed"
                        : user?.role === "employer"
                          ? "Employers cannot apply"
                          : !user
                            ? "Login to apply"
                            : "Apply for this job"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Apply for {job.title}</DialogTitle>
                      <DialogDescription>
                        Share why you're interested and qualified for this position.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Resume</label>
                        <Textarea
                          placeholder="Insert resume link"
                          value={resume}
                          onChange={(e) => setResume(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Cover Letter (Optional)</label>
                        <Textarea
                          placeholder="Tell us why you're a great fit for this role..."
                          value={coverLetter}
                          onChange={(e) => setCoverLetter(e.target.value)}
                          className="min-h-[150px]"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleApply} disabled={isSubmitting}>
                        {isSubmitting ? "Submitting..." : "Submit Application"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">{job.company}</h3>
                  {job.postedBy && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Posted by {typeof job.postedBy === "string" ? job.postedBy : "Employer"}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

