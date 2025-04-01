"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Loader2, Mail, Pencil, User, Building } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { getUserProfile, updateUserProfile, type UserProfile } from "@/app/api-service"

export default function ProfilePage() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    company: "",
    position: "",
    skills: "",
  })

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
      return
    }

    fetchProfile()
  }, [user, router])

  const fetchProfile = async () => {
    if (!user) return

    try {
      setLoading(true)
      const data = await getUserProfile(user.id)
      setProfile(data)

      // Initialize form data
      setFormData({
        name: data.name || "",
        bio: data.bio || "",
        company: data.company || "",
        position: data.position || "",
        skills: data.skills ? data.skills.join(", ") : "",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load profile. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) return

    setIsSubmitting(true)

    try {
      const updatedProfile = await updateUserProfile(user.id, {
        ...formData,
        skills: formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
      })

      setProfile(updatedProfile)
      setIsEditing(false)

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="px-10 py-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="px-10 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Profile not found</h2>
        <Button variant="outline" onClick={() => router.push("/")}>
          Go to Home
        </Button>
      </div>
    )
  }

  return (
    <div className="px-10 py-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle className="text-2xl">Profile</CardTitle>
                <CardDescription>Manage your personal information and preferences</CardDescription>
              </div>
              <Badge>{profile.role === "employer" ? "Employer" : "Job Seeker"}</Badge>
            </div>
          </CardHeader>

          {isEditing ? (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    className="min-h-[100px]"
                  />
                </div>

                {profile.role === "employer" ? (
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input id="company" name="company" value={formData.company} onChange={handleChange} />
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="position">Current Position</Label>
                      <Input id="position" name="position" value={formData.position} onChange={handleChange} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="skills">Skills (comma separated)</Label>
                      <Input
                        id="skills"
                        name="skills"
                        value={formData.skills}
                        onChange={handleChange}
                        placeholder="e.g. JavaScript, React, Node.js"
                      />
                    </div>
                  </>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" type="button" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </CardFooter>
            </form>
          ) : (
            <>
              <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row gap-4 items-start">
                  <div className="bg-primary/10 h-24 w-24 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="h-12 w-12 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-2xl font-bold">{profile.name}</h2>
                    <div className="flex items-center text-muted-foreground">
                      <Mail className="h-4 w-4 mr-1" />
                      {profile.email}
                    </div>

                    {profile.role === "employer" && profile.company && (
                      <div className="flex items-center text-muted-foreground">
                        <Building className="h-4 w-4 mr-1" />
                        {profile.company}
                      </div>
                    )}

                    {profile.role === "jobseeker" && profile.position && (
                      <div className="flex items-center text-muted-foreground">
                        <Briefcase className="h-4 w-4 mr-1" />
                        {profile.position}
                      </div>
                    )}
                  </div>
                </div>

                {profile.bio && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-medium mb-2">About</h3>
                      <p className="text-muted-foreground">{profile.bio}</p>
                    </div>
                  </>
                )}

                {profile.role === "jobseeker" && profile.skills && profile.skills.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-medium mb-2">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {profile.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {profile.role === "jobseeker" && profile.experience && profile.experience.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-medium mb-3">Experience</h3>
                      <div className="space-y-4">
                        {profile.experience.map((exp, index) => (
                          <div key={index} className="border-l-2 border-primary/20 pl-4">
                            <div className="font-medium">{exp.title}</div>
                            <div className="text-sm text-muted-foreground">{exp.company}</div>
                            <div className="text-xs text-muted-foreground">
                              {exp.startDate} - {exp.endDate || "Present"}
                            </div>
                            <p className="text-sm mt-1">{exp.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {profile.role === "jobseeker" && profile.education && profile.education.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-medium mb-3">Education</h3>
                      <div className="space-y-4">
                        {profile.education.map((edu, index) => (
                          <div key={index} className="border-l-2 border-primary/20 pl-4">
                            <div className="font-medium">
                              {edu.degree} in {edu.field}
                            </div>
                            <div className="text-sm text-muted-foreground">{edu.institution}</div>
                            <div className="text-xs text-muted-foreground">Graduated: {edu.graduationDate}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </CardFooter>
            </>
          )}
        </Card>
      </div>
    </div>
  )
}

