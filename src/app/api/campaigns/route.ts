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

    // Get query parameters
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") || ""
    
    // Calculate offset from page
    const offset = (page - 1) * limit

    // Build where clause
    const whereClause: any = {
      createdBy: session.user.id
    }

    // Add search filter
    if (search) {
      whereClause.OR = [
        { marketoName: { contains: search, mode: "insensitive" } },
        { displayName: { contains: search, mode: "insensitive" } },
        { listAcronym: { contains: search, mode: "insensitive" } }
      ]
    }

    // Add status filter
    if (status && status !== "all") {
      whereClause.status = status
    }

    // Fetch campaigns for the current user
    const campaigns = await prisma.campaign.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "desc"
      },
      take: limit,
      skip: offset,
      select: {
        id: true,
        marketoName: true,
        displayName: true,
        listAcronym: true,
        scope: true,
        topic: true,
        campaignType: true,
        globalCampaign: true,
        status: true,
        asanaTaskId: true,
        iterableCampaignId: true,
        errorMessage: true,
        petitionId: true,
        campaignTitle: true,
        createdAt: true,
      }
    })

    // Get total count for pagination with same filters
    const totalCount = await prisma.campaign.count({
      where: whereClause
    })

    return NextResponse.json({
      campaigns,
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit)
    })

  } catch (error) {
    console.error("Error fetching campaigns:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 