// Base API service for all API calls

// Set the base URL for all API requests
const API_BASE_URL = "http://localhost:5001"

// Helper function to get the auth token
function getAuthToken(): string | null {
    return localStorage.getItem("authToken")
}

// Helper function to create headers with auth token
function createHeaders(contentType = true): HeadersInit {
  const headers: HeadersInit = {}

  if (contentType) {
    headers["Content-Type"] = "application/json"
  }

  const token = getAuthToken()
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  return headers
}

export interface Job {
  _id: string
  id?: string
  title: string
  company: string
  description: string
  requirements: string[]
  location: string
  salary: {
    min: number
    max: number
    currency: string
  }
  type: "full-time" | "part-time" | "contract" | "internship"
  status?: "open" | "closed"
  postedBy?: string
  applications?: string[]
  isDeleted?: boolean
  createdAt?: string | Date
  updatedAt?: string | Date
  category?: string // We'll keep this for UI purposes
  employer?: {
    _id: string
    id?: string
    name: string
  }
}

export interface User {
  _id: string
  id?: string
  name: string
  email: string
  role: "employer" | "jobseeker"
  skills?: string[]
  createdAt?: Date
  updatedAt?: Date
}

export interface JobApplication {
  _id: string
  id?: string
  job: Job
  applicant: User
  resume: string
  coverLetter?: string
  status: "pending" | "reviewed" | "rejected" | "accepted"
  createdAt: string | Date
  updatedAt?: string | Date
  user?: User
  jobDetails?: Job
}

export interface UserProfile {
  _id: string
  id?: string
  name: string
  email: string
  role: "employer" | "jobseeker"
  company?: string
  position?: string
  bio?: string
  skills?: string[]
  experience?: {
    title: string
    company: string
    startDate: string
    endDate?: string
    description: string
  }[]
  education?: {
    institution: string
    degree: string
    field: string
    graduationDate: string
  }[]
}

// Job API
export async function getJobs(params?: Record<string, string>) {
  const queryString = params ? new URLSearchParams(params).toString() : ""
  const response = await fetch(`${API_BASE_URL}/api/jobs${queryString ? `?${queryString}` : ""}`, {
    headers: createHeaders(false),
  })

  if (!response.ok) {
    throw new Error("Failed to fetch jobs")
  }

  return response.json()
}

export async function getJobById(id: string) {
  const response = await fetch(`${API_BASE_URL}/api/jobs/${id}`, {
    headers: createHeaders(false),
  })

  if (!response.ok) {
    throw new Error("Failed to fetch job")
  }

  return response.json()
}

export async function createJob(jobData: Partial<Job>) {
  const response = await fetch(`${API_BASE_URL}/api/jobs`, {
    method: "POST",
    headers: createHeaders(),
    body: JSON.stringify(jobData),
  })

  if (!response.ok) {
    throw new Error("Failed to create job")
  }

  return response.json()
}

export async function updateJob(id: string, jobData: Partial<Job>) {
  const response = await fetch(`${API_BASE_URL}/api/jobs/${id}`, {
    method: "PUT",
    headers: createHeaders(),
    body: JSON.stringify(jobData),
  })

  if (!response.ok) {
    throw new Error("Failed to update job")
  }

  return response.json()
}

export async function deleteJob(id: string) {
  const response = await fetch(`${API_BASE_URL}/api/jobs/${id}`, {
    method: "DELETE",
    headers: createHeaders(false),
  })

  if (!response.ok) {
    throw new Error("Failed to delete job")
  }

  return response.json()
}

export async function getRecommendedJobs() {
  const response = await fetch(`${API_BASE_URL}/api/jobs/recommended`, {
    headers: createHeaders(false),
  })

  if (!response.ok) {
    throw new Error("Failed to fetch recommended jobs")
  }

  return response.json()
}

// Application API
export async function submitApplication(applicationData: Partial<JobApplication>) {
  const response = await fetch(`${API_BASE_URL}/api/applications`, {
    method: "POST",
    headers: createHeaders(),
    body: JSON.stringify(applicationData),
  })

  if (!response) {
    throw new Error("Failed to submit application")
  }

  return response.json()
}

export async function getUserApplications() {
  const response = await fetch(`${API_BASE_URL}/api/applications`, {
    headers: createHeaders(false),
  })

  if (!response.ok) {
    throw new Error("Failed to fetch applications")
  }

  return response.json()
}

export async function getApplicationById(id: string) {
  const response = await fetch(`${API_BASE_URL}/api/applications/${id}`, {
    headers: createHeaders(false),
  })

  if (!response) {
    throw new Error("Failed to fetch application")
  }

  return response.json()
}

export async function updateApplicationStatus(id: string, status: string) {
  const response = await fetch(`${API_BASE_URL}/api/applications/${id}`, {
    method: "PUT",
    headers: createHeaders(),
    body: JSON.stringify({ status }),
  })

  if (!response) {
    throw new Error("Failed to update application")
  }

  return response.json()
}

export async function getJobApplications(jobId: string) {
  const response = await fetch(`${API_BASE_URL}/api/applications/jobs/${jobId}/applications`, {
    headers: createHeaders(false),
  })

  if (!response) {
    throw new Error("Failed to fetch job applications")
  }

  return response.json()
}

// User Profile API
export async function getUserProfile(id: string) {
  const response = await fetch(`${API_BASE_URL}/api/users/${id}`, {
    headers: createHeaders(false),
  })

  if (!response.ok) {
    throw new Error("Failed to fetch user profile")
  }

  return response.json()
}

export async function updateUserProfile(id: string, profileData: Partial<UserProfile>) {
  const response = await fetch(`${API_BASE_URL}/api/users/${id}`, {
    method: "PUT",
    headers: createHeaders(),
    body: JSON.stringify(profileData),
  })

  if (!response) {
    throw new Error("Failed to update profile")
  }

  return response.json()
}

export async function getEmployers() {
  const response = await fetch(`${API_BASE_URL}/api/employers`, {
    headers: createHeaders(false),
  })

  if (!response) {
    throw new Error("Failed to fetch employers")
  }

  return response.json()
}

export async function getJobSeekers() {
  const response = await fetch(`${API_BASE_URL}/api/jobseekers`, {
    headers: createHeaders(false),
  })

  if (!response.ok) {
    throw new Error("Failed to fetch job seekers")
  }

  return response.json()
}

