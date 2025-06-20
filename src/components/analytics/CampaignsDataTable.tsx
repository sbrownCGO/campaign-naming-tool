"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal, Settings2, Copy, ExternalLink, Check } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

// Campaign type based on the Prisma schema
export type Campaign = {
  id: string
  marketoName: string
  displayName: string
  listAcronym: string
  scope: "Global" | "Local" | "International"
  topic: "Life" | "Family_Education" | "Freedom" | "Patriotism" | "Election_Season" | "Others"
  campaignType: "MD_Fundraiser" | "OTD_Fundraiser" | "Other"
  status: "pending" | "created" | "failed" | "completed"
  campaignTitle: string
  petitionId: string | null
  asanaTaskId: string | null
  iterableCampaignId: string | null
  errorMessage: string | null
  createdAt: string
}

const getStatusBadge = (status: string, errorMessage?: string) => {
  const statusColors = {
    completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    failed: "bg-red-50 text-red-700 border-red-200", 
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    created: "bg-blue-50 text-blue-700 border-blue-200",
  }
  
  const statusIcons = {
    completed: "✓",
    failed: "✗",
    pending: "⏳",
    created: "✓",
  }

  // Function to truncate and clean error messages
  const getShortErrorMessage = (error: string) => {
    if (error.includes("Iterable")) {
      return "Failed to create Iterable campaign"
    }
    if (error.includes("Asana")) {
      return "Asana integration not configured"
    }
    if (error.includes("API")) {
      return "API error"
    }
    // Generic fallback - take first part before any JSON or technical details
    const cleaned = error.split(':')[0] || error.split('{')[0] || error
    return cleaned.length > 50 ? cleaned.substring(0, 50) + "..." : cleaned
  }
  
  return (
    <div className="space-y-1">
      <span
        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${
          statusColors[status as keyof typeof statusColors] || "bg-muted text-muted-foreground border-border"
        }`}
      >
        <span className="mr-1">{statusIcons[status as keyof typeof statusIcons]}</span>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
      {status === "failed" && errorMessage && (
        <div className="text-xs text-red-600 max-w-xs">
          {getShortErrorMessage(errorMessage)}
        </div>
      )}
    </div>
  )
}

const copyToClipboard = async (text: string, label: string) => {
  try {
    await navigator.clipboard.writeText(text)
    toast.success(`${label} copied to clipboard!`)
  } catch (err) {
    toast.error("Failed to copy to clipboard")
  }
}

export const columns: ColumnDef<Campaign>[] = [
  {
    accessorKey: "displayName",
    header: "CAMPAIGN",
    cell: ({ row }) => {
      const campaign = row.original
      return (
        <div className="space-y-2">
          <div className="font-medium text-sm">
            {campaign.displayName}
          </div>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground font-mono bg-muted/50 rounded px-2 py-1">
            <span className="truncate max-w-[300px]">
              {campaign.marketoName}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 hover:bg-background"
              onClick={() => copyToClipboard(campaign.marketoName, "Campaign name")}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )
    },
  },
  {
    id: "details",
    header: "DETAILS",
    cell: ({ row }) => {
      const campaign = row.original
      const formattedTopic = campaign.topic.replace(/_/g, " ")
      const formattedType = campaign.campaignType.replace(/_/g, " ")
      
      return (
        <div className="space-y-1 text-sm">
          <div className="flex items-center space-x-2">
            <span className="font-mono font-medium">{campaign.listAcronym}</span>
            <span className="text-muted-foreground">•</span>
            <span>{campaign.scope}</span>
          </div>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <span>{formattedTopic}</span>
            <span>•</span>
            <span>{formattedType}</span>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          STATUS
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const campaign = row.original
      return getStatusBadge(campaign.status, campaign.errorMessage || undefined)
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          CREATED
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"))
      return (
        <div className="text-sm text-muted-foreground whitespace-nowrap">
          <div>{date.toLocaleDateString("en-US", { 
            month: "short", 
            day: "numeric", 
            year: "numeric" 
          })},</div>
          <div>{date.toLocaleTimeString("en-US", { 
            hour: "2-digit", 
            minute: "2-digit", 
            hour12: true 
          })}</div>
        </div>
      )
    },
  },
  {
    id: "actions",
    header: "ACTIONS",
    enableHiding: false,
    cell: ({ row }) => {
      const campaign = row.original

      return (
        <div className="flex items-center space-x-2">
          {campaign.asanaTaskId && (
            <a
              href={`https://app.asana.com/0/0/${campaign.asanaTaskId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
            >
              Asana
              <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          )}
          {campaign.iterableCampaignId && (
            <div className="flex items-center text-emerald-600 text-sm font-medium">
              <Check className="h-4 w-4 mr-1" />
              Iterable
            </div>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => copyToClipboard(campaign.id, "Campaign ID")}
              >
                Copy campaign ID
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => copyToClipboard(campaign.marketoName, "Campaign name")}
              >
                Copy campaign name
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View details</DropdownMenuItem>
              <DropdownMenuItem>Edit campaign</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
]

interface CampaignsDataTableProps {
  data: Campaign[]
}

export function CampaignsDataTable({ data }: CampaignsDataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-4">
        <CardTitle>Campaign List</CardTitle>
        <CardDescription>Manage and track your campaigns</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="flex items-center justify-between space-x-4 py-4">
          <Input
            placeholder="Filter campaigns..."
            value={(table.getColumn("displayName")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("displayName")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Settings2 className="mr-2 h-4 w-4" />
                View
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="bg-muted/50">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="h-12 font-medium text-muted-foreground text-xs uppercase tracking-wider">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="h-auto py-4"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-4">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No campaigns found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 