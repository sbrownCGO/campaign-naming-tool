interface AsanaTaskData {
  listAcronym: string
  scope: string
  topic: string
  campaignType: string
  petitionId?: string
  campaignTitle: string
  generatedName: string
  globalCampaign: string
}

interface AsanaCustomField {
  gid: string
  resource_subtype: "text" | "enum" | "number"
  enum_options?: Array<{
    gid: string
    name: string
  }>
}

class AsanaIntegration {
  private baseUrl = "https://app.asana.com/api/1.0"
  private accessToken: string
  private projectGid: string

  constructor() {
    this.accessToken = process.env.ASANA_ACCESS_TOKEN || ""
    this.projectGid = process.env.ASANA_PROJECT_ID || ""
  }

  isConfigured(): boolean {
    return !!(this.accessToken && this.projectGid)
  }

  private async makeRequest(endpoint: string, method: string = "GET", data?: any) {
    const url = `${this.baseUrl}${endpoint}`
    
    const options: RequestInit = {
      method,
      headers: {
        "Authorization": `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
      },
    }

    if (data && method !== "GET") {
      options.body = JSON.stringify({ data })
    }

    const response = await fetch(url, options)
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Asana API error: ${response.status} - ${errorText}`)
    }

    return response.json()
  }

  async createCampaignTask(taskData: AsanaTaskData): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error("Asana integration not configured. Please set ASANA_ACCESS_TOKEN and ASANA_PROJECT_ID environment variables.")
    }

    try {
      // Create the task name
      const taskName = "Iterable Naming Tool Project [AUTOMATION] submission"
      
      // Create the description
      const description = this.buildTaskDescription(taskData)
      
      // Build custom fields for task creation
      const customFields = await this.buildCustomFields(taskData)
      
      // Create the task with custom fields
      const taskData_payload = {
        name: taskName,
        notes: description,
        projects: [this.projectGid],
        completed: false,
        ...(Object.keys(customFields).length > 0 && { custom_fields: customFields })
      }

      const taskResponse = await this.makeRequest("/tasks", "POST", taskData_payload)

      return taskResponse.data.gid
      
    } catch (error) {
      console.error("Error creating Asana task:", error)
      throw new Error(`Failed to create Asana task: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  private buildTaskDescription(taskData: AsanaTaskData): string {
    const googleChatLink = process.env.GOOGLE_CHAT_WEBHOOK_URL || "https://chat.google.com/spaces/AAAAi0_dDQo"
    
    return `This is your Iterable Program Name: ${taskData.generatedName}

Google Chat Link: ${googleChatLink}`
  }

  private async buildCustomFields(taskData: AsanaTaskData): Promise<Record<string, any>> {
    const customFields: Record<string, any> = {}

    // Map of field names to their GIDs and values
    const fieldMappings = {
      citizengo_list: {
        gid: process.env.ASANA_FIELD_CITIZENGO_LIST || "",
        value: taskData.listAcronym
      },
      scope: {
        gid: process.env.ASANA_FIELD_SCOPE || "",
        value: taskData.scope
      },
      campaign_name: {
        gid: process.env.ASANA_FIELD_CAMPAIGN_NAME || "",
        value: taskData.campaignTitle
      },
      topic: {
        gid: process.env.ASANA_FIELD_TOPIC || "",
        value: taskData.topic.replace(/_/g, ' ')
      },
      global_campaign: {
        gid: process.env.ASANA_FIELD_GLOBAL_CAMPAIGN || "",
        value: taskData.globalCampaign
      },
      petition_id: {
        gid: process.env.ASANA_FIELD_PETITION_ID || "",
        value: taskData.petitionId || ""
      },
      campaign_type: {
        gid: process.env.ASANA_FIELD_CAMPAIGN_TYPE || "",
        value: taskData.campaignType.replace(/_/g, ' ')
      }
    }

    try {
      // Get field information to determine types
      const projectFields = await this.getProjectCustomFields()
      
      // Build custom fields object for each configured field
      Object.entries(fieldMappings).forEach(([fieldName, config]) => {
        if (config.gid && config.value) {
          const fieldInfo = projectFields.find(f => f.gid === config.gid)
          
          if (fieldInfo) {
            if (fieldInfo.resource_subtype === "enum") {
              // For enum fields, try to find matching option
              const matchingOption = fieldInfo.enum_options?.find(option => 
                option.name.toLowerCase().replace(/[^a-z0-9]/g, '') === 
                config.value.toLowerCase().replace(/[^a-z0-9]/g, '')
              )
              
              if (matchingOption) {
                customFields[config.gid] = matchingOption.gid
              } else {
                // If no exact match, try first option or use text fallback
                console.warn(`No matching enum option found for field ${fieldName} with value "${config.value}". Available options:`, fieldInfo.enum_options?.map(o => o.name))
                if (fieldInfo.enum_options && fieldInfo.enum_options.length > 0) {
                  customFields[config.gid] = fieldInfo.enum_options[0].gid
                } else {
                  // Fallback to text if no enum options available
                  customFields[config.gid] = config.value
                }
              }
            } else if (fieldInfo.resource_subtype === "number") {
              // For number fields
              const numValue = parseInt(config.value, 10)
              if (!isNaN(numValue)) {
                customFields[config.gid] = numValue
              }
            } else {
              // For text fields and others
              customFields[config.gid] = config.value
            }
          } else {
            // Field info not found, default to text value
            customFields[config.gid] = config.value
          }
        }
      })
    } catch (error) {
      console.warn("Could not fetch field types, using text values:", error)
      // Fallback to simple text values
      Object.entries(fieldMappings).forEach(([fieldName, config]) => {
        if (config.gid && config.value) {
          customFields[config.gid] = config.value
        }
      })
    }

    return customFields
  }

  async getProjectCustomFields(): Promise<AsanaCustomField[]> {
    try {
      const response = await this.makeRequest(`/projects/${this.projectGid}/custom_field_settings`)
      return response.data.map((field: any) => ({
        gid: field.custom_field.gid,
        name: field.custom_field.name,
        resource_subtype: field.custom_field.resource_subtype,
        enum_options: field.custom_field.enum_options || [],
      }))
    } catch (error) {
      console.error("Error fetching custom fields:", error)
      return []
    }
  }
}

export const asanaIntegration = new AsanaIntegration()
export type { AsanaTaskData } 