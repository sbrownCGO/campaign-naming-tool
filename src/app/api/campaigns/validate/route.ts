import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { extractInitialsFromName, generateCampaignName, validateCampaignName } from "@/lib/utils/nameGenerator"

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

    // Parse request body
    const body = await req.json()
    const {
      listAcronym,
      scope,
      topic,
      petitionId,
      campaignTitle,
      globalCampaign
    } = body

    // Check if we have minimum required fields
    if (!listAcronym || !scope || !topic || !campaignTitle) {
      return NextResponse.json({
        isValid: false,
        generatedName: "",
        errors: ["Missing required fields"]
      })
    }

    // Generate campaign name
    const campaignerInitials = extractInitialsFromName(session.user.name || "")
    const generatedName = generateCampaignName({
      listAcronym,
      scope,
      topic,
      campaignerInitials,
      petitionId,
      campaignTitle,
      globalCampaign,
    })

    // Validate the generated name
    const validation = validateCampaignName(generatedName)
    if (!validation.isValid) {
      return NextResponse.json({
        isValid: false,
        generatedName,
        errors: validation.errors
      })
    }

    // Check if campaign name already exists
    const existingCampaign = await prisma.campaign.findUnique({
      where: { marketoName: generatedName }
    })

    if (existingCampaign) {
      return NextResponse.json({
        isValid: false,
        generatedName,
        errors: ["A campaign with this name already exists"]
      })
    }

    // Name is valid and available
    return NextResponse.json({
      isValid: true,
      generatedName,
      errors: []
    })

  } catch (error) {
    console.error("Campaign validation error:", error)
    return NextResponse.json({
      isValid: false,
      generatedName: "",
      errors: ["Error validating campaign name"]
    })
  }
} 