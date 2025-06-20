// Campaign form dropdown options
export const LIST_OPTIONS = [
  { code: "DE_AT", displayName: "DE AT", countryCode: "AT" },
  { code: "DE_CH", displayName: "DE CH", countryCode: "CH" },
  { code: "DE", displayName: "DE", countryCode: "DE" },
  { code: "EN_ROW", displayName: "EN ROW", countryCode: null },
  { code: "EN_AU", displayName: "EN AU", countryCode: "AU" },
  { code: "EN_AF", displayName: "EN AF", countryCode: "AF" },
  { code: "EN_CA", displayName: "EN CA", countryCode: "CA" },
  { code: "EN_GB", displayName: "EN GB", countryCode: "GB" },
  { code: "EN_IE", displayName: "EN IE", countryCode: "IE" },
  { code: "EN_US", displayName: "EN US", countryCode: "US" },
  { code: "ES_ROW", displayName: "ES ROW", countryCode: null },
  { code: "ES_AR", displayName: "ES AR", countryCode: "AR" },
  { code: "ES_MX", displayName: "ES MX", countryCode: "MX" },
  { code: "ES_US", displayName: "ES US", countryCode: "US" },
  { code: "FR_FR", displayName: "FR FR", countryCode: "FR" },
  { code: "FR_CA", displayName: "FR CA", countryCode: "CA" },
  { code: "HO", displayName: "HO (Spanish-Spain)", countryCode: "ES" },
  { code: "HR", displayName: "HR", countryCode: "HR" },
  { code: "HU", displayName: "HU", countryCode: "HU" },
  { code: "IT", displayName: "IT", countryCode: "IT" },
  { code: "NL", displayName: "NL", countryCode: "NL" },
  { code: "PL", displayName: "PL", countryCode: "PL" },
  { code: "PT", displayName: "PT", countryCode: "PT" },
  { code: "PT_BR", displayName: "PT BR", countryCode: "BR" },
  { code: "PT_PT", displayName: "PT PT", countryCode: "PT" },
  { code: "RU", displayName: "RU", countryCode: "RU" },
  { code: "SK", displayName: "SK", countryCode: "SK" },
  { code: "TL", displayName: "TL", countryCode: null },
  { code: "VLS", displayName: "VLS", countryCode: null },
] as const

export const SCOPE_OPTIONS = [
  { value: "Global", label: "Global" },
  { value: "Local", label: "Local" },
  { value: "International", label: "International" },
] as const

export const TOPIC_OPTIONS = [
  { value: "Life", label: "Life" },
  { value: "Family_Education", label: "Family & Education" },
  { value: "Freedom", label: "Freedom" },
  { value: "Patriotism", label: "Patriotism" },
  { value: "Election_Season", label: "Election Season" },
  { value: "Others", label: "Others" },
] as const

export const GLOBAL_CAMPAIGN_OPTIONS = [
  { value: "Local_or_International", label: "Local or International" },
  { value: "Reject_EVC", label: "Reject EVC" },
  { value: "Abolish_DSA_Bill", label: "Abolish DSA Bill" },
  { value: "Pandemic_Treaty13th", label: "Pandemic Treaty13th" },
  { value: "CitizenGO_vs_French_State", label: "CitizenGO vs French State" },
  { value: "Expand_MD", label: "Expand MD" },
  { value: "No_Digital_Euro_2", label: "No Digital Euro 2" },
  { value: "Work_with_us", label: "Work with us" },
  { value: "Olympics_Christian_Lawsuit", label: "Olympics Christian Lawsuit" },
  { value: "Pandemic_Treaty_Final_Stretch_2025", label: "Pandemic Treaty Final Stretch 2025" },
  { value: "Eduard_acquittal", label: "Eduard acquittal" },
  { value: "OAS_2025", label: "OAS 2025" },
  { value: "Survey_Pandemic_Treaty_Donors", label: "Survey Pandemic Treaty Donors" },
  { value: "Survey_Pandemic_Treaty_non_donors", label: "Survey Pandemic Treaty non donors" },
  { value: "Apple_TV_Eucharistic_desecration", label: "Apple TV Eucharistic desecration" },
  { value: "Second_Half", label: "Second Half" },
  { value: "Court_DSA", label: "Court DSA" },
  { value: "Defund_UN", label: "Defund UN" },
  { value: "Financial_Statements", label: "Financial Statements" },
] as const

export const CAMPAIGN_TYPE_OPTIONS = [
  { value: "MD_Fundraiser", label: "MD Fundraiser" },
  { value: "OTD_Fundraiser", label: "OTD Fundraiser" },
  { value: "Other", label: "Other" },
] as const

// Topic mapping for name generation (remove spaces and special chars)
export const TOPIC_CODE_MAP = {
  "Life": "Life",
  "Family_Education": "FM",
  "Freedom": "Freedom", 
  "Patriotism": "Patriotism",
  "Election_Season": "Election",
  "Others": "OT",
} as const 