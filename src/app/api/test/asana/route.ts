import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { asanaIntegration } from "@/lib/integrations/asana"

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.email?.endsWith("@citizengo.net")) {
      return NextResponse.json(
        { error: "Unauthorized - CitizenGO email required" },
        { status: 401 }
      )
    }

    // Check if Asana is configured
    if (!asanaIntegration.isConfigured()) {
      return NextResponse.json({
        success: false,
        error: "Asana integration not configured",
        message: "Please set ASANA_ACCESS_TOKEN and ASANA_PROJECT_GID environment variables"
      })
    }

    // Create a test task
    const testTaskData = {
      listAcronym: "TEST",
      scope: "Global",
      topic: "Others",
      campaignType: "Other",
      petitionId: "123456",
      campaignTitle: "Test Campaign",
      generatedName: "TEST-2025-06-20-Global-OT-TEST-123456-Test_Campaign-Global",
      globalCampaign: "Local_or_International",
    }

    const taskId = await asanaIntegration.createCampaignTask(testTaskData)

    return NextResponse.json({
      success: true,
      message: "Test task created successfully",
      taskId,
      taskUrl: `https://app.asana.com/0/0/${taskId}`
    })

  } catch (error) {
    console.error("Asana test error:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
} 