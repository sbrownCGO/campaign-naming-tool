import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { CampaignFormSchema } from "@/lib/validations/campaign"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { extractInitialsFromName, generateCampaignName } from "@/lib/utils/nameGenerator"
import { asanaIntegration } from "@/lib/integrations/asana"
import { iterableIntegration } from "@/lib/integrations/iterable"

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Parse and validate request body
    const body = await req.json()
    const validationResult = CampaignFormSchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: "Validation failed", 
          details: validationResult.error.errors 
        },
        { status: 400 }
      )
    }

    const data = validationResult.data

    // Generate campaign name
    const campaignerInitials = extractInitialsFromName(session.user.name || "")
    const generatedName = generateCampaignName({
      listAcronym: data.listAcronym,
      scope: data.scope,
      topic: data.topic,
      campaignerInitials,
      petitionId: data.petitionId,
      campaignTitle: data.campaignTitle,
      globalCampaign: data.globalCampaign,
      campaignType: data.campaignType,
    })

    // Check if campaign name already exists
    const existingCampaign = await prisma.campaign.findUnique({
      where: { marketoName: generatedName }
    })

    if (existingCampaign) {
      return NextResponse.json(
        { error: "A campaign with this name already exists" },
        { status: 409 }
      )
    }

    // Create campaign in database with pending status
    const campaign = await prisma.campaign.create({
      data: {
        marketoName: generatedName,
        displayName: data.campaignTitle,
        listAcronym: data.listAcronym,
        scope: data.scope,
        topic: data.topic,
        petitionId: data.petitionId,
        campaignTitle: data.campaignTitle,
        globalCampaign: data.globalCampaign,
        campaignType: data.campaignType,
        createdBy: session.user.id,
        status: "pending",
      }
    })

    // Trigger integrations
    let asanaTaskId: string | null = null
    let iterableCampaignId: string | null = null
    let finalStatus: "completed" | "failed" = "completed"
    let errorMessage: string | null = null

    try {
      // Create Asana task
      asanaTaskId = await asanaIntegration.createCampaignTask({
        listAcronym: data.listAcronym,
        scope: data.scope,
        topic: data.topic,
        campaignType: data.campaignType,
        petitionId: data.petitionId,
        campaignTitle: data.campaignTitle,
        generatedName,
        globalCampaign: data.globalCampaign,
      })

      console.log(`Asana task created: ${asanaTaskId}`)

      // Create Iterable campaign (triggered campaign by default, no listIds)
      // Using template ID 319721
      const iterableCampaignIdNumber = await iterableIntegration.createTriggeredCampaign(
        generatedName,
        319721, // Template ID
        {
          dataFields: {
            listAcronym: data.listAcronym,
            scope: data.scope,
            topic: data.topic,
            campaignType: data.campaignType,
            petitionId: data.petitionId,
            campaignTitle: data.campaignTitle,
            globalCampaign: data.globalCampaign,
          }
        }
      )
      
      iterableCampaignId = iterableCampaignIdNumber.toString()
      console.log(`Iterable campaign created: ${iterableCampaignId}`)

      // TODO: Add other integrations here
      // - Send notification to Google Chat

    } catch (error) {
      console.error("Integration error:", error)
      finalStatus = "failed"
      errorMessage = error instanceof Error ? error.message : "Integration failed"
    }

    // Update campaign with integration results
    const updatedCampaign = await prisma.campaign.update({
      where: { id: campaign.id },
      data: {
        asanaTaskId,
        iterableCampaignId,
        status: finalStatus,
        errorMessage,
      }
    })

    return NextResponse.json({
      success: true,
      campaign: {
        id: updatedCampaign.id,
        marketoName: updatedCampaign.marketoName,
        displayName: updatedCampaign.displayName,
        status: updatedCampaign.status,
        asanaTaskId: updatedCampaign.asanaTaskId,
        iterableCampaignId: updatedCampaign.iterableCampaignId,
        createdAt: updatedCampaign.createdAt,
      }
    }, { status: 201 })

  } catch (error) {
    console.error("Campaign creation error:", error)
    
    // Handle specific database errors
    if (error instanceof Error) {
      if (error.message.includes("Unique constraint")) {
        return NextResponse.json(
          { error: "A campaign with this name already exists" },
          { status: 409 }
        )
      }
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 