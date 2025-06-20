# Asana Integration Setup Guide

This guide will help you configure the Asana integration for the Campaign Naming Tool.

## Prerequisites

1. **Asana Account**: You need access to the Asana workspace where campaigns will be tracked
2. **Asana Personal Access Token**: Generate one from your Asana account settings
3. **Asana Project**: The project where campaign tasks will be created

## Step 1: Generate Asana Personal Access Token

1. Go to [Asana Account Settings](https://app.asana.com/0/my-apps)
2. Click on "Apps" tab
3. Scroll down to "Personal access tokens"
4. Click "Create new token"
5. Give it a name like "Campaign Naming Tool"
6. Copy the token (you won't see it again!)

## Step 2: Get Project GID

1. Go to your Asana project
2. Look at the URL: `https://app.asana.com/0/PROJECT_GID/...`
3. Copy the PROJECT_GID number

## Step 3: Get Custom Field GIDs (Auto-Detection Method)

The easiest way is to use the built-in auto-detection:

1. **Set basic config** in your `.env` file:
   ```env
   ASANA_ACCESS_TOKEN="your-token-here"
   ASANA_PROJECT_ID="your-project-gid-here"
   ```

2. **Visit** `/settings/asana` in your app
3. **Click** "Fetch Asana Fields" button
4. **Copy** the generated configuration

## Step 4: Manual Field GID Detection (Alternative)

If auto-detection doesn't work, you can find field GIDs manually:

```bash
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  "https://app.asana.com/api/1.0/projects/YOUR_PROJECT_GID/custom_field_settings"
```

Look for fields with these names and copy their GIDs:
- **CitizenGO List** (or similar)
- **Scope**
- **Campaign Name** (or similar)
- **Topic**
- **Global Campaign** (or similar)
- **Petition ID number** (or similar)
- **Campaign Type** (or similar)

## Step 5: Environment Variables

Add these to your `.env` file:

```env
# Asana Integration
ASANA_ACCESS_TOKEN="0/1234567890abcdef..."
ASANA_PROJECT_ID="1234567890123456"

# Asana Custom Field GIDs (use /settings/asana to auto-detect)
ASANA_FIELD_CITIZENGO_LIST="1234567890123456"
ASANA_FIELD_SCOPE="1234567890123456"
ASANA_FIELD_CAMPAIGN_NAME="1234567890123456"
ASANA_FIELD_TOPIC="1234567890123456"
ASANA_FIELD_GLOBAL_CAMPAIGN="1234567890123456"
ASANA_FIELD_PETITION_ID="1234567890123456"
ASANA_FIELD_CAMPAIGN_TYPE="1234567890123456"

# Google Chat (optional)
GOOGLE_CHAT_WEBHOOK_URL="https://chat.google.com/spaces/AAAAi0_dDQo"
```

## Step 6: Test the Integration

1. Restart your development server
2. Create a new campaign
3. Check your Asana project for the new task
4. Verify the custom fields are populated correctly

## Expected Task Format

When a campaign is created, the integration will:

1. **Create a task** with name: "Iterable Naming Tool Project [AUTOMATION] submission"
2. **Set custom fields**:
   - **CitizenGO List**: e.g., "DE_AT"
   - **Scope**: e.g., "Global"
   - **Campaign Name**: e.g., "March for Life in Split"
   - **Topic**: e.g., "Life"
   - **Global Campaign**: e.g., "Local or International"
   - **Petition ID number**: e.g., "123456" or campaign title
   - **Campaign Type**: e.g., "Other"
3. **Add description**:
   ```
   This is your Iterable Program Name: DE_AT-2025-06-20-Global-Life-SB-234242342-Stop_Abortion-Reject_EVC
   
   Google Chat Link: https://chat.google.com/spaces/AAAAi0_dDQo
   ```

## Troubleshooting

### "Missing Asana configuration" Error
- Make sure all required environment variables are set
- Restart your development server after adding variables

### "Asana API error: 401"
- Check your Personal Access Token
- Make sure it hasn't expired
- Verify the token has access to the project

### "Asana API error: 404" 
- Check your Project GID
- Make sure you have access to the project

### Custom Fields Not Set
- Check your custom field GIDs using `/settings/asana`
- Make sure the fields exist in your project
- Verify field types (text fields work best)
- Check that field names match expected patterns

### Fields Show as Empty
- The integration now sets fields during task creation (not after)
- Make sure you have the correct field GIDs
- Check that your Asana project has the expected custom fields

## Field Type Compatibility

The integration currently works best with **text fields**. If your Asana project uses:
- **Enum fields** (dropdowns): May need additional configuration
- **Number fields**: Should work for Petition ID
- **Date fields**: Not currently supported

## API Reference

The integration uses these Asana API endpoints:
- `POST /tasks` - Create the task with custom fields
- `GET /projects/{project_gid}/custom_field_settings` - Get field GIDs

## Security Notes

- Store your access token securely in environment variables
- Only CitizenGO email addresses can access the integration settings
- The integration gracefully fails if not configured (doesn't break campaign creation) 