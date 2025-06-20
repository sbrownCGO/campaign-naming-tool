"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { CampaignFormSchema, CampaignFormData } from "@/lib/validations/campaign"
import { 
  LIST_OPTIONS, 
  SCOPE_OPTIONS, 
  TOPIC_OPTIONS, 
  GLOBAL_CAMPAIGN_OPTIONS, 
  CAMPAIGN_TYPE_OPTIONS 
} from "@/lib/constants"
import { extractInitialsFromName, previewCampaignName } from "@/lib/utils/nameGenerator"
import { toast } from "sonner"
import { Copy, User, AlertTriangle, CheckCircle, Loader2 } from "lucide-react"

// shadcn/ui components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Combobox } from "@/components/ui/combobox"

interface CampaignFormProps {
  onSubmit: (data: CampaignFormData) => Promise<void>
  isSubmitting?: boolean
}

export default function CampaignForm({ onSubmit, isSubmitting = false }: CampaignFormProps) {
  const { data: session } = useSession()
  const [generatedName, setGeneratedName] = useState("")
  const [nameErrors, setNameErrors] = useState<string[]>([])

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CampaignFormData>({
    resolver: zodResolver(CampaignFormSchema),
    mode: "onChange",
  })

  // Watch specific form values
  const listAcronym = watch("listAcronym")
  const scope = watch("scope")
  const topic = watch("topic")
  const petitionId = watch("petitionId")
  const campaignTitle = watch("campaignTitle")
  const globalCampaign = watch("globalCampaign")
  const campaignType = watch("campaignType")

  // Generate name preview whenever form values change
  useEffect(() => {
    const campaignerInitials = session?.user?.name ? extractInitialsFromName(session.user.name) : ""
    
    const preview = previewCampaignName({
      listAcronym,
      scope,
      topic,
      campaignerInitials,
      petitionId,
      campaignTitle,
      globalCampaign,
      campaignType,
    })
    
    setGeneratedName(preview.generatedName)
    setNameErrors(preview.errors)
  }, [listAcronym, scope, topic, petitionId, campaignTitle, globalCampaign, campaignType, session?.user?.name])

  const handleFormSubmit = async (data: CampaignFormData) => {
    try {
      await onSubmit(data)
    } catch (error) {
      console.error("Form submission error:", error)
    }
  }

  const copyToClipboard = async () => {
    if (generatedName) {
      try {
        await navigator.clipboard.writeText(generatedName)
        toast.success("Campaign name copied to clipboard!")
      } catch (err) {
        toast.error("Failed to copy to clipboard")
      }
    }
  }

  // Transform options for combobox
  const listOptions = LIST_OPTIONS.map(option => ({
    value: option.code,
    label: option.displayName,
  }))

  const topicOptions = TOPIC_OPTIONS.map(option => ({
    value: option.value,
    label: option.label,
  }))

  const campaignTypeOptions = CAMPAIGN_TYPE_OPTIONS.map(option => ({
    value: option.value,
    label: option.label,
  }))

  const globalCampaignOptions = GLOBAL_CAMPAIGN_OPTIONS.map(option => ({
    value: option.value,
    label: option.label,
  }))

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 pt-6 pb-12">
        {/* Header */}
        <div className="text-center mb-10">
          <img 
            src="/CGO-logo.png" 
            alt="CitizenGO Logo" 
            className="mx-auto mb-6 h-16 w-auto"
          />
          <h1 className="text-3xl font-semibold text-foreground mb-3">Create New Campaign</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Generate a standardized campaign name by filling out the form below
          </p>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
          {/* Generated Campaign Name */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium">Generated Campaign Name</CardTitle>
                {generatedName && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={copyToClipboard}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {generatedName ? (
                <div className="space-y-4">
                  <div className="bg-muted border rounded-lg p-4">
                    <code className="text-sm font-mono text-foreground break-all">
                      {generatedName}
                    </code>
                  </div>
                  {nameErrors.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
                        <span className="text-sm font-medium text-red-800">Validation Issues</span>
                      </div>
                      <ul className="text-sm text-red-700 space-y-1">
                        {nameErrors.map((error, index) => (
                          <li key={index}>• {error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">Fill out the form to generate your campaign name</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Form Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Campaign Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium">Campaign Details</CardTitle>
                <CardDescription>Basic information about your campaign</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* List Selection */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">CitizenGO List *</Label>
                  <Combobox
                    options={listOptions}
                    value={listAcronym || ""}
                    onValueChange={(value) => setValue("listAcronym", value)}
                    placeholder="Select a list..."
                    searchPlaceholder="Search lists..."
                    emptyMessage="No lists found."
                  />
                  {errors.listAcronym && (
                    <p className="text-sm text-red-600">{errors.listAcronym.message}</p>
                  )}
                </div>

                {/* Campaign Title */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Campaign Title *</Label>
                  <div className="relative">
                    <Input
                      {...register("campaignTitle")}
                      placeholder="Enter campaign title..."
                      maxLength={30}
                      className="pr-12"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                      {campaignTitle?.length || 0}/30
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Will be converted to URL-friendly format
                  </p>
                  {errors.campaignTitle && (
                    <p className="text-sm text-red-600">{errors.campaignTitle.message}</p>
                  )}
                </div>

                {/* Petition ID */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Petition ID <span className="text-muted-foreground font-normal">(Optional)</span>
                  </Label>
                  <Input
                    {...register("petitionId")}
                    placeholder="e.g., 123456"
                    type="number"
                  />
                  <p className="text-xs text-muted-foreground">
                    Numeric ID from petition URL
                  </p>
                  {errors.petitionId && (
                    <p className="text-sm text-red-600">{errors.petitionId.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Campaign Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium">Campaign Settings</CardTitle>
                <CardDescription>Configure scope, topic, and campaign type</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Scope Selection */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Campaign Scope *</Label>
                  <RadioGroup
                    value={scope || ""}
                    onValueChange={(value) => setValue("scope", value as any)}
                    className="space-y-2"
                  >
                    {SCOPE_OPTIONS.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={option.value} />
                        <Label htmlFor={option.value} className="text-sm cursor-pointer">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  {errors.scope && (
                    <p className="text-sm text-red-600">{errors.scope.message}</p>
                  )}
                </div>

                {/* Topic Selection */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Campaign Topic *</Label>
                  <Combobox
                    options={topicOptions}
                    value={topic || ""}
                    onValueChange={(value) => setValue("topic", value as any)}
                    placeholder="Select a topic..."
                    searchPlaceholder="Search topics..."
                    emptyMessage="No topics found."
                  />
                  {errors.topic && (
                    <p className="text-sm text-red-600">{errors.topic.message}</p>
                  )}
                </div>

                {/* Campaign Type */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Campaign Type *</Label>
                  <Combobox
                    options={campaignTypeOptions}
                    value={campaignType || ""}
                    onValueChange={(value) => setValue("campaignType", value as any)}
                    placeholder="Select a type..."
                    searchPlaceholder="Search campaign types..."
                    emptyMessage="No types found."
                  />
                  {errors.campaignType && (
                    <p className="text-sm text-red-600">{errors.campaignType.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Global Campaign & User Info */}
            <div className="space-y-8">
              {/* Global Campaign */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium">Global Campaign *</CardTitle>
                  <CardDescription>Select the global campaign series</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Combobox
                    options={globalCampaignOptions}
                    value={globalCampaign || ""}
                    onValueChange={(value) => setValue("globalCampaign", value)}
                    placeholder="Search global campaigns..."
                    searchPlaceholder="Search campaigns..."
                    emptyMessage="No campaigns found."
                  />
                  {errors.globalCampaign && (
                    <p className="text-sm text-red-600">{errors.globalCampaign.message}</p>
                  )}
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <p className="text-xs text-amber-800">
                      <strong>Note:</strong> If scope is "Local" or "International", this field will be ignored in name generation.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Campaign Creator */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Campaign Creator
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={session?.user?.image || "/default-avatar.png"}
                      alt={session?.user?.name || "User"}
                      className="w-10 h-10 rounded-full border"
                    />
                    <div>
                      <p className="font-medium text-card-foreground">{session?.user?.name}</p>
                      <p className="text-sm text-muted-foreground">{session?.user?.email}</p>
                    </div>
                  </div>
                  
                  <div className="bg-accent border rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-accent-foreground">Campaign Initials</span>
                      <span className="text-sm font-mono font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                        {session?.user?.name ? extractInitialsFromName(session.user.name) : "N/A"}
                      </span>
                    </div>
                    <p className="text-xs text-accent-foreground/70 mt-1">
                      These initials will be included in your campaign name
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <Button
              type="submit"
              disabled={isSubmitting || nameErrors.length > 0}
              size="lg"
              className="px-8"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Creating Campaign...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Create Campaign
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
} 