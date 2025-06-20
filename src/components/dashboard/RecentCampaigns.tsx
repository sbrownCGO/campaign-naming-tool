"use client"

import { useState, useEffect } from "react"
import { Clock, Copy, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { toast } from "sonner"

interface Campaign {
  id: string
  marketoName: string
  displayName: string
  listAcronym: string
  scope: string
  topic: string
  campaignType: string
  globalCampaign: string
  status: string
  asanaTaskId?: string
  errorMessage?: string
  createdAt: string
}

interface RecentCampaignsProps {
  limit?: number
}

export default function RecentCampaigns({ limit = 5 }: RecentCampaignsProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCampaigns()
  }, [limit])

  const fetchCampaigns = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/campaigns?limit=${limit}`)
      
      if (!response.ok) {
        throw new Error("Failed to fetch campaigns")
      }
      
      const data = await response.json()
      setCampaigns(data.campaigns)
      setError(null)
    } catch (err) {
      console.error("Error fetching campaigns:", err)
      setError("Failed to load campaigns")
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success("Campaign name copied to clipboard!")
    } catch (err) {
      toast.error("Failed to copy to clipboard")
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "failed":
        return <XCircle className="w-4 h-4 text-red-600" />
      case "pending":
        return <AlertCircle className="w-4 h-4 text-yellow-600" />
      case "created":
        return <CheckCircle className="w-4 h-4 text-blue-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-50 text-green-700 border-green-200"
      case "failed":
        return "bg-red-50 text-red-700 border-red-200"
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      case "created":
        return "bg-blue-50 text-blue-700 border-blue-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Recent Campaigns</h3>
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Recent Campaigns</h3>
        </div>
        <div className="text-center py-4">
          <p className="text-red-600 text-sm">{error}</p>
          <button 
            onClick={fetchCampaigns}
            className="mt-2 text-blue-600 hover:text-blue-700 text-sm underline"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Recent Campaigns</h3>
        </div>
        <div className="flex items-center space-x-3">
          {campaigns.length > 0 && (
            <>
              <a
                href="/campaigns"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View All
              </a>
              <button
                onClick={fetchCampaigns}
                className="text-gray-500 hover:text-gray-700 text-sm font-medium"
              >
                Refresh
              </button>
            </>
          )}
        </div>
      </div>

      {campaigns.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">No campaigns yet</h4>
          <p className="text-gray-500 text-sm mb-4">
            Create your first campaign to see it here
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-900 truncate">
                  {campaign.displayName}
                </h4>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(campaign.status)}`}>
                  {getStatusIcon(campaign.status)}
                  <span className="ml-1 capitalize">{campaign.status}</span>
                </span>
              </div>
              
              <div className="flex items-center space-x-2 mb-2">
                <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono text-gray-700 truncate flex-1">
                  {campaign.marketoName}
                </code>
                <button
                  onClick={() => copyToClipboard(campaign.marketoName)}
                  className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                  title="Copy campaign name"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{campaign.listAcronym}</span>
                  <span>•</span>
                  <span className="capitalize">{campaign.scope}</span>
                  <span>•</span>
                  <span>{formatDate(campaign.createdAt)}</span>
                </div>
                
                {campaign.asanaTaskId && (
                  <a
                    href={`https://app.asana.com/0/0/${campaign.asanaTaskId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                  >
                    View Asana
                  </a>
                )}
              </div>
              
              {campaign.status === "failed" && campaign.errorMessage && (
                <div className="mt-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded p-2">
                  <strong>Error:</strong> {campaign.errorMessage.substring(0, 100)}...
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 