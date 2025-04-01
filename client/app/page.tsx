import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Briefcase, Building, Search, Users } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 px-10 md:py-24 lg:py-32 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Find Your Dream Job or Perfect Candidate
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                  Connect talent with opportunity in our streamlined job marketplace. Post jobs or apply with ease.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/jobs">
                  <Button className="px-8">
                    Browse Jobs
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button variant="outline" className="px-8">
                    Create Account
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative w-full h-[350px]">
                <div className="absolute top-0 right-0 bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg dark:shadow-gray-800/50 w-64">
                  <Briefcase className="w-8 h-8 text-blue-500 mb-2" />
                  <h3 className="text-xl font-bold">For Job Seekers</h3>
                  <p className="text-gray-500 dark:text-gray-400 mt-2">
                    Discover opportunities matching your skills and experience
                  </p>
                </div>
                <div className="absolute bottom-0 left-0 bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg dark:shadow-gray-800/50 w-64">
                  <Building className="w-8 h-8 text-green-500 mb-2" />
                  <h3 className="text-xl font-bold">For Employers</h3>
                  <p className="text-gray-500 dark:text-gray-400 mt-2">
                    Post jobs and find the perfect candidates for your team
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 bg-white dark:bg-gray-950">
        <div className="px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Our platform makes connecting talent with opportunity seamless and efficient
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
            <div className="flex flex-col justify-center space-y-4 border rounded-lg p-6 shadow-sm">
              <Search className="w-10 h-10 text-blue-500" />
              <h3 className="text-xl font-bold">Find Opportunities</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Browse through curated job listings or receive personalized recommendations
              </p>
            </div>
            <div className="flex flex-col justify-center space-y-4 border rounded-lg p-6 shadow-sm">
              <Briefcase className="w-10 h-10 text-blue-500" />
              <h3 className="text-xl font-bold">Apply with Ease</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Quick application process with profile-based application submissions
              </p>
            </div>
            <div className="flex flex-col justify-center space-y-4 border rounded-lg p-6 shadow-sm">
              <Users className="w-10 h-10 text-blue-500" />
              <h3 className="text-xl font-bold">Connect & Grow</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Track application status and communicate with potential employers
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

