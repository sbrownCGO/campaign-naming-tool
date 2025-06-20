"use client"

import { useSession, signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Image from "next/image"

export default function LandingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session) {
      router.push("/dashboard")
    }
  }, [session, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (session) {
    return null // Redirecting to dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-8">
              <Image
                src="/CGO-logo.png"
                alt="CitizenGO"
                width={200}
                height={80}
                className="h-20 w-auto"
                priority
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Campaign Naming Tool
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Streamline your campaign creation process with automated naming conventions and seamless integration with Iterable and Asana.
            </p>
          </div>

          {/* Main Content */}
          <div className="bg-card rounded-2xl shadow-xl p-8 md:p-12 border">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left side - Features */}
              <div>
                <h2 className="text-2xl font-bold text-card-foreground mb-6">
                  What you can do:
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center mt-0.5">
                      <svg className="w-3 h-3 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-card-foreground">Generate Campaign Names</h3>
                      <p className="text-muted-foreground">Automatically create standardized campaign names following CitizenGO conventions</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center mt-0.5">
                      <svg className="w-3 h-3 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-card-foreground">Create Iterable Campaigns</h3>
                      <p className="text-muted-foreground">Automatically set up campaigns in Iterable with proper audience assignment</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center mt-0.5">
                      <svg className="w-3 h-3 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-card-foreground">Asana Integration</h3>
                      <p className="text-muted-foreground">Create tracking tasks automatically in your Asana projects</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center mt-0.5">
                      <svg className="w-3 h-3 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-card-foreground">UTM Tracking</h3>
                      <p className="text-muted-foreground">Configure UTM parameters for comprehensive campaign tracking</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right side - Sign in */}
              <div className="text-center">
                <div className="bg-muted rounded-xl p-8">
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    Ready to get started?
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Sign in with your CitizenGO Google account to access the campaign naming tool.
                  </p>
                  
                  <button
                    onClick={() => signIn("google")}
                    className="w-full bg-card hover:bg-accent text-card-foreground font-medium py-3 px-6 rounded-lg border border-border shadow-sm transition-colors duration-200 flex items-center justify-center space-x-3"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span>Continue with Google</span>
                  </button>
                  
                  <p className="text-xs text-muted-foreground mt-4">
                    Access restricted to @citizengo.net accounts
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-16">
            <p className="text-muted-foreground">
              © 2024 CitizenGO. Streamlining campaign workflows with automation.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
