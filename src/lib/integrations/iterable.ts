interface IterableCampaignData {
  name: string
  templateId: number
  listIds?: number[]
  dataFields?: Record<string, any>
  sendAt?: string
  sendMode?: "ProjectTimeZone" | "RecipientTimeZone"
  defaultTimeZone?: string
  startTimeZone?: string
  suppressionListIds?: number[]
}

interface IterableApiResponse {
  code: string
  msg: string
  params?: Record<string, any>
}

interface CreateCampaignResponse {
  campaignId: number
}

class IterableIntegration {
  private baseUrl = "https://api.eu.iterable.com/api"
  private apiKey: string

  constructor() {
    this.apiKey = process.env.ITERABLE_API_KEY || ""
  }

  isConfigured(): boolean {
    return !!this.apiKey
  }

  private async makeRequest(endpoint: string, method: string = "GET", data?: any) {
    const url = `${this.baseUrl}${endpoint}`
    
    const options: RequestInit = {
      method,
      headers: {
        "Api-Key": this.apiKey,
        "Content-Type": "application/json",
      },
    }

    if (data && method !== "GET") {
      options.body = JSON.stringify(data)
    }

    const response = await fetch(url, options)
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Iterable API error: ${response.status} - ${errorText}`)
    }

    return response.json()
  }

  async createCampaign(campaignData: IterableCampaignData): Promise<number> {
    if (!this.isConfigured()) {
      throw new Error("Iterable integration not configured. Please set ITERABLE_API_KEY environment variable.")
    }

    try {
      const response: CreateCampaignResponse = await this.makeRequest("/campaigns/create", "POST", campaignData)
      
      return response.campaignId
      
    } catch (error) {
      console.error("Error creating Iterable campaign:", error)
      throw new Error(`Failed to create Iterable campaign: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async createBlastCampaign(
    name: string, 
    templateId: number, 
    listIds: number[],
    options?: {
      dataFields?: Record<string, any>
      sendAt?: string
      sendMode?: "ProjectTimeZone" | "RecipientTimeZone"
      defaultTimeZone?: string
      startTimeZone?: string
      suppressionListIds?: number[]
    }
  ): Promise<number> {
    const campaignData: IterableCampaignData = {
      name,
      templateId,
      listIds,
      ...options
    }

    return this.createCampaign(campaignData)
  }

  async createTriggeredCampaign(
    name: string,
    templateId: number,
    options?: {
      dataFields?: Record<string, any>
      suppressionListIds?: number[]
    }
  ): Promise<number> {
    const campaignData: IterableCampaignData = {
      name,
      templateId,
      ...options
    }

    return this.createCampaign(campaignData)
  }

  // Helper method to format campaign name using the generated name from the naming tool
  formatCampaignName(generatedName: string, prefix?: string): string {
    const campaignPrefix = prefix || "CNT" // Campaign Naming Tool prefix
    return `${campaignPrefix}_${generatedName}`
  }
}

export const iterableIntegration = new IterableIntegration()
export type { IterableCampaignData, IterableApiResponse, CreateCampaignResponse } 