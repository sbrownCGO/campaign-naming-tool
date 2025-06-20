import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const userId = session.user.id

    // Get all campaigns for the user
    const campaigns = await prisma.campaign.findMany({
      where: {
        createdBy: userId
      },
      select: {
        status: true,
        listAcronym: true,
        scope: true,
        topic: true,
        campaignType: true,
        createdAt: true,
      }
    })

    // Status distribution
    const statusCounts = campaigns.reduce((acc: Record<string, number>, campaign) => {
      acc[campaign.status] = (acc[campaign.status] || 0) + 1
      return acc
    }, {})

    // List distribution
    const listCounts = campaigns.reduce((acc: Record<string, number>, campaign) => {
      acc[campaign.listAcronym] = (acc[campaign.listAcronym] || 0) + 1
      return acc
    }, {})

    // Scope distribution
    const scopeCounts = campaigns.reduce((acc: Record<string, number>, campaign) => {
      acc[campaign.scope] = (acc[campaign.scope] || 0) + 1
      return acc
    }, {})

    // Topic distribution
    const topicCounts = campaigns.reduce((acc: Record<string, number>, campaign) => {
      const topic = campaign.topic.replace(/_/g, ' ')
      acc[topic] = (acc[topic] || 0) + 1
      return acc
    }, {})

    // Campaign type distribution
    const typeCounts = campaigns.reduce((acc: Record<string, number>, campaign) => {
      acc[campaign.campaignType] = (acc[campaign.campaignType] || 0) + 1
      return acc
    }, {})

    // Campaigns over time (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const campaignsOverTime = campaigns
      .filter(campaign => campaign.createdAt >= thirtyDaysAgo)
      .reduce((acc: Record<string, number>, campaign) => {
        const date = campaign.createdAt.toISOString().split('T')[0]
        acc[date] = (acc[date] || 0) + 1
        return acc
      }, {})

    // Fill in missing dates with 0
    const timeSeriesData = []
    for (let i = 29; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      timeSeriesData.push({
        date: dateStr,
        count: campaignsOverTime[dateStr] || 0
      })
    }

    return NextResponse.json({
      statusDistribution: Object.entries(statusCounts).map(([status, count]) => ({
        name: status,
        count,
        fill: getStatusColor(status)
      })),
      listDistribution: Object.entries(listCounts).map(([list, count]) => ({
        name: list,
        count,
        fill: `var(--chart-${(Object.keys(listCounts).indexOf(list) % 5) + 1})`
      })),
      scopeDistribution: Object.entries(scopeCounts).map(([scope, count]) => ({
        name: scope,
        count,
        fill: `var(--chart-${(Object.keys(scopeCounts).indexOf(scope) % 5) + 1})`
      })),
      topicDistribution: Object.entries(topicCounts).map(([topic, count]) => ({
        name: topic,
        count,
        fill: `var(--chart-${(Object.keys(topicCounts).indexOf(topic) % 5) + 1})`
      })),
      typeDistribution: Object.entries(typeCounts).map(([type, count]) => ({
        name: type,
        count,
        fill: `var(--chart-${(Object.keys(typeCounts).indexOf(type) % 5) + 1})`
      })),
      campaignsOverTime: timeSeriesData,
      totalCampaigns: campaigns.length
    })

  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

function getStatusColor(status: string): string {
  switch (status) {
    case "completed":
      return "#10b981" // emerald-500 - success green
    case "failed":
      return "#dc2626" // red-600 - matches destructive
    case "pending":
      return "#f59e0b" // amber-500 - warning
    case "created":
      return "#4585f4" // CitizenGO primary blue
    default:
      return "#64748b" // slate-500 - neutral gray
  }
} 