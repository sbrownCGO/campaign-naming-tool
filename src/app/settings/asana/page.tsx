"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Copy, CheckCircle, XCircle, ExternalLink } from "lucide-react"
import { toast } from "sonner"

interface AsanaField {
  gid: string
  name: string
  type: string
  description: string
}

interface AsanaConfig {
  projectGid: string
  fields: AsanaField[]
  suggestedMappings: Record<string, string | null>
  envConfig: string
}

export default function AsanaSettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [config, setConfig] = useState<AsanaConfig | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Redirect if not authenticated or not CitizenGO email
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    } else if (session && !session.user?.email?.endsWith("@citizengo.net")) {
      router.push("/dashboard")
    }
  }, [status, session, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session?.user?.email?.endsWith("@citizengo.net")) {
    return null
  }

  const fetchAsanaConfig = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/asana/fields")
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch Asana configuration")
      }

      const data = await response.json()
      setConfig(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success("Configuration copied to clipboard!")
    } catch (err) {
      toast.error("Failed to copy to clipboard")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push("/dashboard")}
                className="text-blue-600 hover:text-blue-800 flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to Dashboard</span>
              </button>
            </div>
            
            <div className="flex items-center space-x-3">
              <img
                src={session.user.image || "/default-avatar.png"}
                alt={session.user.name || "User"}
                className="w-8 h-8 rounded-full"
              />
              <div className="text-sm">
                <p className="font-medium text-gray-900">{session.user.name}</p>
                <p className="text-gray-500">{session.user.email}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-3">Asana Integration Setup</h1>
          <p className="text-gray-600">
            Configure Asana integration to automatically create tasks when campaigns are created.
          </p>
        </div>

        {/* Setup Instructions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Setup Instructions</h2>
          <div className="space-y-4 text-sm text-gray-600">
            <div className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">1</span>
              <div>
                <p className="font-medium text-gray-900">Generate Asana Personal Access Token</p>
                <p>Go to <a href="https://app.asana.com/0/my-apps" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Asana Account Settings</a> → Apps → Personal access tokens</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">2</span>
              <div>
                <p className="font-medium text-gray-900">Get Project GID</p>
                <p>From your Asana project URL: https://app.asana.com/0/<strong>PROJECT_GID</strong>/...</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">3</span>
              <div>
                <p className="font-medium text-gray-900">Add Environment Variables</p>
                <p>Add the generated configuration to your .env file</p>
              </div>
            </div>
          </div>
        </div>

        {/* Fetch Configuration Button */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Auto-detect Configuration</h2>
            <button
              onClick={fetchAsanaConfig}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
            >
              {loading ? "Fetching..." : "Fetch Asana Fields"}
            </button>
          </div>
          
          <p className="text-sm text-gray-600 mb-4">
            If you already have ASANA_ACCESS_TOKEN and ASANA_PROJECT_GID configured, click the button above to auto-detect your custom field GIDs.
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-center">
                <XCircle className="w-5 h-5 text-red-600 mr-2" />
                <span className="text-sm font-medium text-red-800">Error</span>
              </div>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          )}

          {config && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-sm font-medium text-green-800">Configuration Generated</span>
                </div>
                <p className="text-sm text-green-700">Found {config.fields.length} custom fields in your Asana project.</p>
              </div>

              {/* Detected Fields */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Detected Custom Fields</h3>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    {config.fields.map((field) => (
                      <div key={field.gid} className="flex justify-between">
                        <span className="text-gray-900">{field.name}</span>
                        <span className="text-gray-500 font-mono">{field.type}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Environment Configuration */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-900">Environment Configuration</h3>
                  <button
                    onClick={() => copyToClipboard(config.envConfig)}
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </button>
                </div>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-xs overflow-x-auto">
                  {config.envConfig}
                </pre>
              </div>

              {/* Field Mappings */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Suggested Field Mappings</h3>
                <div className="space-y-2">
                  {Object.entries(config.suggestedMappings).map(([envVar, fieldGid]) => (
                    <div key={envVar} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm font-mono text-gray-900">{envVar}</span>
                      <span className="text-xs text-gray-500">
                        {fieldGid ? (
                          <span className="text-green-600">✓ Detected</span>
                        ) : (
                          <span className="text-red-600">✗ Not found</span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Documentation Link */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-blue-900 mb-1">Need Help?</h3>
              <p className="text-sm text-blue-700 mb-3">
                Check the detailed setup guide for step-by-step instructions and troubleshooting tips.
              </p>
              <a
                href="https://github.com/your-repo/blob/main/ASANA_SETUP.md"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 underline"
              >
                View Setup Documentation
                <ExternalLink className="w-4 h-4 ml-1" />
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 