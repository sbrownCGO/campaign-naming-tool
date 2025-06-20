"use client"

import { useState, useEffect } from "react"
import { StatusDistributionChart } from "./StatusDistributionChart"
import { CampaignsDataTable, Campaign } from "./CampaignsDataTable"
import { CampaignsOverTimeChart } from "./CampaignsOverTimeChart"
import { ScopeDistributionChart } from "./ScopeDistributionChart"
import { TopicDistributionChart } from "./TopicDistributionChart"
import { TypeDistributionChart } from "./TypeDistributionChart"

interface AnalyticsData {
  statusDistribution: Array<{ name: string; count: number; fill: string }>
  listDistribution: Array<{ name: string; count: number; fill: string }>
  scopeDistribution: Array<{ name: string; count: number; fill: string }>
  topicDistribution: Array<{ name: string; count: number; fill: string }>
  typeDistribution: Array<{ name: string; count: number; fill: string }>
  campaignsOverTime: Array<{ date: string; count: number }>
  totalCampaigns: number
}

interface CampaignsResponse {
  campaigns: Campaign[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export function CampaignAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [campaignsData, setCampaignsData] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch analytics data
      const analyticsResponse = await fetch("/api/campaigns/analytics")
      if (!analyticsResponse.ok) {
        throw new Error("Failed to fetch analytics")
      }
      const analytics = await analyticsResponse.json()
      setAnalyticsData(analytics)

      // Fetch campaigns data for the table
      const campaignsResponse = await fetch("/api/campaigns?limit=50")
      if (!campaignsResponse.ok) {
        throw new Error("Failed to fetch campaigns")
      }
      const campaignsData: CampaignsResponse = await campaignsResponse.json()
      
      // Transform the data to match the table format
      const transformedCampaigns: Campaign[] = campaignsData.campaigns.map(campaign => ({
        ...campaign,
        createdAt: campaign.createdAt
      }))
      
      setCampaignsData(transformedCampaigns)
      setError(null)
    } catch (err) {
      console.error("Error fetching data:", err)
      setError("Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-card rounded-lg border p-6 animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
            <div className="h-48 bg-muted rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <p className="text-red-600 text-sm">{error}</p>
        <button 
          onClick={fetchData}
          className="mt-2 text-red-700 hover:text-red-800 text-sm underline"
        >
          Try again
        </button>
      </div>
    )
  }

  if (!analyticsData || analyticsData.totalCampaigns === 0) {
    return (
      <div className="bg-muted border rounded-lg p-8 mb-6 text-center">
        <h3 className="text-lg font-medium text-card-foreground mb-2">No Analytics Data</h3>
        <p className="text-muted-foreground">Create some campaigns to see analytics and insights.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 mb-6">
      {/* Top Row: Status and Timeline Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatusDistributionChart 
          data={analyticsData.statusDistribution} 
          totalCampaigns={analyticsData.totalCampaigns}
        />
        <CampaignsOverTimeChart 
          data={analyticsData.campaignsOverTime}
        />
      </div>

      {/* Middle Row: Campaign Data Table */}
      <div className="grid grid-cols-1 gap-6">
        <CampaignsDataTable data={campaignsData} />
      </div>

      {/* Bottom Row: Scope, Topics, and Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ScopeDistributionChart 
          data={analyticsData.scopeDistribution}
        />
        <TopicDistributionChart 
          data={analyticsData.topicDistribution}
        />
        <TypeDistributionChart 
          data={analyticsData.typeDistribution}
        />
      </div>
    </div>
  )
} 