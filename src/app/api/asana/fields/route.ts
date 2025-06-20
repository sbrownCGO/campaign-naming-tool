import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.email?.endsWith("@citizengo.net")) {
      return NextResponse.json(
        { error: "Unauthorized - CitizenGO email required" },
        { status: 401 }
      )
    }

    const accessToken = process.env.ASANA_ACCESS_TOKEN
    const projectGid = process.env.ASANA_PROJECT_ID

    if (!accessToken || !projectGid) {
      return NextResponse.json(
        { error: "Asana configuration missing" },
        { status: 500 }
      )
    }

    // Fetch custom field settings from Asana
    const response = await fetch(
      `https://app.asana.com/api/1.0/projects/${projectGid}/custom_field_settings`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Asana API error: ${response.status}`)
    }

    const data = await response.json()
    
    // Format the response for easier consumption
    const fields = data.data.map((fieldSetting: any) => ({
      gid: fieldSetting.custom_field.gid,
      name: fieldSetting.custom_field.name,
      type: fieldSetting.custom_field.resource_subtype,
      description: fieldSetting.custom_field.description,
      enum_options: fieldSetting.custom_field.enum_options || [],
    }))

    // Suggest mappings based on field names
    const suggestedMappings = {
      ASANA_FIELD_CITIZENGO_LIST: fields.find((f: any) => 
        f.name.toLowerCase().includes('citizengo') || 
        f.name.toLowerCase().includes('list')
      )?.gid || null,
      
      ASANA_FIELD_SCOPE: fields.find((f: any) => 
        f.name.toLowerCase().includes('scope')
      )?.gid || null,
      
      ASANA_FIELD_CAMPAIGN_NAME: fields.find((f: any) => 
        f.name.toLowerCase().includes('campaign') && 
        f.name.toLowerCase().includes('name')
      )?.gid || null,
      
      ASANA_FIELD_TOPIC: fields.find((f: any) => 
        f.name.toLowerCase().includes('topic')
      )?.gid || null,
      
      ASANA_FIELD_GLOBAL_CAMPAIGN: fields.find((f: any) => 
        f.name.toLowerCase().includes('global') && 
        f.name.toLowerCase().includes('campaign')
      )?.gid || null,
      
      ASANA_FIELD_PETITION_ID: fields.find((f: any) => 
        f.name.toLowerCase().includes('petition') || 
        (f.name.toLowerCase().includes('id') && f.name.toLowerCase().includes('number'))
      )?.gid || null,
      
      ASANA_FIELD_CAMPAIGN_TYPE: fields.find((f: any) => 
        f.name.toLowerCase().includes('campaign') && 
        f.name.toLowerCase().includes('type')
      )?.gid || null,
    }

    return NextResponse.json({
      projectGid,
      fields,
      suggestedMappings,
      envConfig: generateEnvConfig(suggestedMappings),
    })

  } catch (error) {
    console.error("Error fetching Asana fields:", error)
    return NextResponse.json(
      { error: "Failed to fetch Asana fields" },
      { status: 500 }
    )
  }
}

function generateEnvConfig(mappings: Record<string, string | null>): string {
  return `# Add these to your .env file:
ASANA_ACCESS_TOKEN="${process.env.ASANA_ACCESS_TOKEN || 'your-access-token'}"
ASANA_PROJECT_GID="${process.env.ASANA_PROJECT_GID || 'your-project-gid'}"

# Custom Field GIDs (auto-detected):
${Object.entries(mappings)
  .map(([key, value]) => `${key}="${value || 'field-not-found'}"`)
  .join('\n')}

# Google Chat (optional):
GOOGLE_CHAT_WEBHOOK_URL="https://chat.google.com/spaces/AAAAi0_dDQo"`
} 