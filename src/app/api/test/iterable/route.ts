import { NextRequest, NextResponse } from "next/server"
import { iterableIntegration } from "@/lib/integrations/iterable"

export async function GET() {
  try {
    // Check if Iterable is configured
    if (!iterableIntegration.isConfigured()) {
      return NextResponse.json({
        success: false,
        error: "Iterable integration not configured. Please set ITERABLE_API_KEY environment variable."
      }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: "Iterable integration is properly configured",
      configured: true
    })

  } catch (error) {
    console.error("Iterable test error:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { templateId, campaignName, listIds } = body

    if (!templateId || !campaignName) {
      return NextResponse.json({
        success: false,
        error: "templateId and campaignName are required"
      }, { status: 400 })
    }

    let campaignId: number

    if (listIds && Array.isArray(listIds) && listIds.length > 0) {
      // Create blast campaign
      campaignId = await iterableIntegration.createBlastCampaign(
        campaignName,
        templateId,
        listIds
      )
    } else {
      // Create triggered campaign
      campaignId = await iterableIntegration.createTriggeredCampaign(
        campaignName,
        templateId
      )
    }

    return NextResponse.json({
      success: true,
      campaignId,
      message: `Campaign created successfully with ID: ${campaignId}`
    })

  } catch (error) {
    console.error("Iterable test campaign creation error:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to create test campaign"
    }, { status: 500 })
  }
} 