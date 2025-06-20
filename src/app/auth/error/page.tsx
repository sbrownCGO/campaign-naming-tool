"use client"

import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"

export default function AuthError() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "AccessDenied":
        return {
          title: "Access Denied",
          message: "You must use a @citizengo.net email address to access this application.",
          details: "This tool is restricted to CitizenGO team members only. Please sign in with your official CitizenGO Google account."
        }
      case "Configuration":
        return {
          title: "Configuration Error",
          message: "There was a problem with the authentication configuration.",
          details: "Please try again later or contact the administrator if the problem persists."
        }
      case "Verification":
        return {
          title: "Verification Error",
          message: "The verification link was invalid or has expired.",
          details: "Please try signing in again to receive a new verification link."
        }
      default:
        return {
          title: "Authentication Error",
          message: "An unexpected error occurred during sign in.",
          details: "Please try again or contact support if the problem continues."
        }
    }
  }

  const errorInfo = getErrorMessage(error)

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Image
              src="/CGO-logo.png"
              alt="CitizenGO"
              width={150}
              height={60}
              className="h-16 w-auto"
              priority
            />
          </div>

          {/* Error Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>

          {/* Error Content */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {errorInfo.title}
          </h1>
          
          <p className="text-gray-700 mb-4 font-medium">
            {errorInfo.message}
          </p>
          
          <p className="text-gray-600 text-sm mb-8">
            {errorInfo.details}
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => router.push("/auth/signin")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Try Again
            </button>
            
            <button
              onClick={() => router.push("/")}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Back to Home
            </button>
          </div>

          {/* Help Text */}
          {error === "AccessDenied" && (
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Need access?</strong> Contact your IT administrator to ensure your @citizengo.net account is properly configured.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 