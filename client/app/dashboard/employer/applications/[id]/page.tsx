/**
 * ApplicationDetailsPage component displays detailed information about a specific job application.
 * It allows the employer to view the application details, including the applicant's information,
 * the job details, and the cover letter. Additionally, it provides functionality to update the
 * status of the application.
 *
 * @component
 *
 * @returns {JSX.Element} The rendered ApplicationDetailsPage component.
 *
 * @remarks
 * - This component uses React hooks such as `useState` and `useEffect` for state management and
 *   side effects.
 * - It fetches application and job data using asynchronous functions `getApplicationById` and
 *   `getJobById`.
 * - The status of the application can be updated using the `updateApplicationStatus` function.
 * - Displays loading and error states appropriately.
 *
 * @example
 * ```tsx
 * <ApplicationDetailsPage />
 * ```
 *
 * @dependencies
 * - `useParams` and `useRouter` from `next/navigation` for routing and parameter handling.
 * - `useToast` for displaying toast notifications.
 * - UI components such as `Card`, `Button`, `Badge`, `Select`, and icons like `ArrowLeft`, `Calendar`, etc.
 *
 * @state
 * - `application` (`JobApplication | null`): Stores the fetched application data.
 * - `data_job` (`Job | null`): Stores the fetched job data associated with the application.
 * - `loading` (`boolean`): Indicates whether the application data is being loaded.
 * - `status` (`string`): Tracks the current status of the application.
 * - `isUpdating` (`boolean`): Indicates whether the application status is being updated.
 *
 * @methods
 * - `fetchApplication(id: string)`: Fetches application and job data based on the provided application ID.
 * - `handleStatusUpdate()`: Updates the status of the application and displays a toast notification.
 *
 * @loadingState
 * - Displays a spinner while the application data is being fetched.
 *
 * @errorState
 * - Displays a message if the application is not found and provides a button to navigate back to the dashboard.
 *
 * @uiStructure
 * - Main content displays application details, including the job title, application date, and cover letter.
 * - Sidebar displays applicant information and a form to update the application status.
 */

"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Briefcase, Calendar, Mail, User } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { getApplicationById, getJobById, updateApplicationStatus, type JobApplication, type Job} from "@/app/api-service"


export default function ApplicationDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [application, setApplication] = useState<JobApplication | null>(null)
  const [data_job, setDataJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchApplication(params.id as string)
    }
  }, [params.id])

  const fetchApplication = async (id: string) => {
    try {
      setLoading(true)
      const data = await getApplicationById(id)
      console.log(data)
      const data_job = await getJobById(data.job._id)
      setApplication(data)
      setStatus(data.status)
    } catch (error) {
      
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async () => {

    console.log(application?._id, status)
    if (!application) return

    setIsUpdating(true)

    try {
      await updateApplicationStatus(application._id, status)

      toast({
        title: "Status updated",
        description: `Application status changed to ${status}.`,
      })

      // Update local state
      setApplication((prev) => (prev ? { ...prev, status: status as JobApplication["status"] } : null))
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update application status. Please try again.",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="container py-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!application) {
    return (
      <div className="container py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Application not found</h2>
        <Button variant="outline" onClick={() => router.push("/dashboard/employer")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>
    )
  }

  return (
    <div className="px-10 py-8">
      <Button variant="outline" className="mb-6" onClick={() => router.push("/dashboard/employer")}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">Application Details</CardTitle>
                  <CardDescription>For {data_job?.title || "Unknown Position"}</CardDescription>
                </div>
                <Badge
                  variant={
                    application.status === "pending"
                      ? "outline"
                      : application.status === "reviewed"
                        ? "secondary"
                        : application.status === "accepted"
                          ? "secondary"
                          : "destructive"
                  }
                >
                  {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Applied {new Date(application.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <Link href={`/jobs/${application.job._id}`}>
                    <span className="hover:underline cursor-pointer">{data_job?.title || "View Job"}</span>
                  </Link>
                </div>
              </div>

              <Separator />

              {application.coverLetter && (
                <div>
                  <h3 className="font-semibold text-lg mb-2">Cover Letter</h3>
                  <div className="text-muted-foreground whitespace-pre-line p-4 border rounded-md bg-muted/50">
                    {application.coverLetter}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Applicant</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 h-12 w-12 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="font-medium">{application.applicant?.name || "Unknown"}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {application.applicant?.email || "No email provided"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Update Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="reviewed">Reviewed</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={handleStatusUpdate}
                disabled={isUpdating || status === application.status}
              >
                {isUpdating ? "Updating..." : "Update Status"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

