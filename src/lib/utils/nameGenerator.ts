import { CampaignNameParams } from "../validations/campaign"
import { TOPIC_CODE_MAP } from "../constants"

/**
 * Extract initials from user's full name
 * e.g., "John Doe Smith" -> "JDS"
 */
export function extractInitialsFromName(fullName: string): string {
  if (!fullName) return "NA"
  
  return fullName
    .split(' ')
    .filter(name => name.length > 0)
    .map(name => name.charAt(0).toUpperCase())
    .join('')
}

/**
 * Format campaign title to URL-friendly format
 * - Truncate to 30 characters
 * - Replace spaces with underscores
 * - Remove special characters except underscores and hyphens
 * - Handle edge case where 30th character is a space (becomes underscore)
 */
export function formatCampaignTitle(title: string): string {
  if (!title) return ""
  
  // Truncate to 30 characters first
  let formatted = title.substring(0, 30)
  
  // If the 30th character was a space, it will be converted to underscore later
  // This preserves the documented behavior
  
  // Replace spaces with underscores
  formatted = formatted.replace(/\s+/g, '_')
  
  // Remove special characters except underscores, hyphens, and alphanumeric
  formatted = formatted.replace(/[^a-zA-Z0-9_-]/g, '')
  
  // Remove trailing underscores that might have been created from trailing spaces
  formatted = formatted.replace(/_+$/, '')
  
  return formatted
}

/**
 * Get topic code for name generation
 */
function getTopicCode(topic: string): string {
  return TOPIC_CODE_MAP[topic as keyof typeof TOPIC_CODE_MAP] || topic
}

/**
 * Generate campaign name following CitizenGO naming convention
 * Format: [List]_[Country]-[YYYY]-[MM]-[DD]-[Scope]-[Topic]-[Initials]-[PetitionID]-[Title]-[Global]
 */
export function generateCampaignName(params: CampaignNameParams): string {
  const {
    listAcronym,
    scope,
    topic,
    campaignerInitials,
    petitionId,
    campaignTitle,
    globalCampaign,
    campaignType
  } = params

  // Generate current date
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const dateString = `${year}-${month}-${day}`

  // Format list acronym (replace underscores in display with actual underscores for name)
  const formattedList = listAcronym.replace(/_/g, '_')

  // Get topic code
  const topicCode = getTopicCode(topic)

  // Format campaign title
  const formattedTitle = formatCampaignTitle(campaignTitle)

  // Handle petition ID
  const petitionIdPart = petitionId || "NA"

  // Handle global campaign logic
  // If scope is "Local" or "International", use the scope value
  // Otherwise, use the selected global campaign or the scope value
  let globalCampaignPart: string
  if (scope === "Local" || scope === "International") {
    globalCampaignPart = scope
  } else if (globalCampaign && globalCampaign !== "Local_or_International") {
    globalCampaignPart = globalCampaign.replace(/_/g, '_') // Keep underscores
  } else {
    globalCampaignPart = scope
  }

  // Build the campaign name parts
  const parts = [
    formattedList,
    dateString,
    scope,
    topicCode,
    campaignerInitials,
    petitionIdPart,
    formattedTitle,
    globalCampaignPart
  ]

  // Join with hyphens
  let campaignName = parts.join('-')
  
  // Add MD suffix if it's an MD Fundraiser
  if (campaignType === "MD_Fundraiser") {
    campaignName += "_MD"
  }
  
  return campaignName
}

/**
 * Validate generated campaign name
 */
export function validateCampaignName(name: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!name) {
    errors.push("Campaign name cannot be empty")
    return { isValid: false, errors }
  }

  // Check for invalid characters (should only contain alphanumeric, hyphens, and underscores)
  if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
    errors.push("Campaign name contains invalid characters")
  }

  // Check length (reasonable upper limit)
  if (name.length > 200) {
    errors.push("Campaign name is too long")
  }

  // Check for consecutive separators
  if (/--+|__+/.test(name)) {
    errors.push("Campaign name contains consecutive separators")
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Preview campaign name generation with validation - shows progressive build-up
 */
export function previewCampaignName(
  formData: Partial<CampaignNameParams>
): { generatedName: string; isValid: boolean; errors: string[] } {
  
  try {
    // Generate current date for preview
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const dateString = `${year}-${month}-${day}`

    // Build parts progressively
    const parts: string[] = []
    
    // 1. List Acronym
    if (formData.listAcronym) {
      parts.push(formData.listAcronym.replace(/_/g, '_'))
    } else {
      parts.push('[List]')
    }
    
    // 2. Date (always present)
    parts.push(dateString)
    
    // 3. Scope
    if (formData.scope) {
      parts.push(formData.scope)
    } else {
      parts.push('[Scope]')
    }
    
    // 4. Topic
    if (formData.topic) {
      const topicCode = getTopicCode(formData.topic)
      parts.push(topicCode)
    } else {
      parts.push('[Topic]')
    }
    
    // 5. Campaigner Initials
    if (formData.campaignerInitials) {
      parts.push(formData.campaignerInitials)
    } else {
      parts.push('[Initials]')
    }
    
    // 6. Petition ID
    if (formData.petitionId) {
      parts.push(formData.petitionId)
    } else {
      parts.push('[PetitionID]')
    }
    
    // 7. Campaign Title
    if (formData.campaignTitle) {
      const formattedTitle = formatCampaignTitle(formData.campaignTitle)
      parts.push(formattedTitle || '[Title]')
    } else {
      parts.push('[Title]')
    }
    
    // 8. Global Campaign
    if (formData.globalCampaign) {
      let globalCampaignPart: string
      if (formData.scope === "Local" || formData.scope === "International") {
        globalCampaignPart = formData.scope
      } else if (formData.globalCampaign !== "Local_or_International") {
        globalCampaignPart = formData.globalCampaign.replace(/_/g, '_')
      } else {
        globalCampaignPart = formData.scope || '[Global]'
      }
      parts.push(globalCampaignPart)
    } else {
      parts.push('[Global]')
    }

    let generatedName = parts.join('-')
    
    // Add MD suffix if it's an MD Fundraiser
    if (formData.campaignType === "MD_Fundraiser") {
      generatedName += "_MD"
    }
    
    // Check if all required fields are filled for validation
    const hasAllRequired = formData.listAcronym && 
                          formData.scope && 
                          formData.topic && 
                          formData.campaignerInitials && 
                          formData.campaignTitle && 
                          formData.globalCampaign
    
    if (hasAllRequired) {
      const validation = validateCampaignName(generatedName)
      return {
        generatedName,
        isValid: validation.isValid,
        errors: validation.errors
      }
    } else {
      return {
        generatedName,
        isValid: false,
        errors: []
      }
    }
    
  } catch (error) {
    return {
      generatedName: "",
      isValid: false,
      errors: [`Error generating name: ${error instanceof Error ? error.message : 'Unknown error'}`]
    }
  }
} 