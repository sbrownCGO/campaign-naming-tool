import { z } from "zod"

export const CampaignFormSchema = z.object({
  listAcronym: z.string({
    required_error: "List selection is required",
  }).min(1, "List selection is required"),
  
  scope: z.enum(["Global", "Local", "International"], {
    required_error: "Scope selection is required",
  }),
  
  topic: z.enum(["Life", "Family_Education", "Freedom", "Patriotism", "Election_Season", "Others"], {
    required_error: "Topic selection is required",
  }),
  
  petitionId: z.string()
    .optional()
    .refine(
      (val) => !val || /^\d+$/.test(val), 
      "Petition ID must be numeric"
    ),
  
  campaignTitle: z.string({
    required_error: "Campaign title is required",
  })
    .min(1, "Campaign title is required")
    .max(30, "Campaign title must be 30 characters or less")
    .refine(
      (val) => !/\s$/.test(val), 
      "Campaign title cannot end with a space"
    )
    .refine(
      (val) => val.trim().length > 0,
      "Campaign title cannot be only spaces"
    ),
  
  globalCampaign: z.string({
    required_error: "Global Campaign selection is required",
  }).min(1, "Global Campaign selection is required"),
  
  campaignType: z.enum(["MD_Fundraiser", "OTD_Fundraiser", "Other"], {
    required_error: "Campaign type selection is required",
  }),
})

export type CampaignFormData = z.infer<typeof CampaignFormSchema>

// Additional types for the form
export interface CampaignNameParams {
  listAcronym: string
  scope: "Global" | "Local" | "International"
  topic: "Life" | "Family_Education" | "Freedom" | "Patriotism" | "Election_Season" | "Others"
  campaignerInitials: string
  petitionId?: string
  campaignTitle: string
  globalCampaign?: string
  campaignType?: "MD_Fundraiser" | "OTD_Fundraiser" | "Other"
}

export interface CampaignPreview {
  generatedName: string
  isValid: boolean
  errors: string[]
} 