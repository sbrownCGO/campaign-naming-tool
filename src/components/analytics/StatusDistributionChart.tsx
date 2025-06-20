"use client"

import { Pie, PieChart, Sector } from "recharts"
import { PieSectorDataItem } from "recharts/types/polar/Pie"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"

interface StatusData {
  name: string
  count: number
  fill: string
}

interface StatusDistributionChartProps {
  data: StatusData[]
  totalCampaigns: number
}

const chartConfig = {
  count: {
    label: "Campaigns",
  },
  completed: {
    label: "Completed",
    color: "#10b981", // emerald-500 - success green
  },
  failed: {
    label: "Failed", 
    color: "#dc2626", // red-600 - matches destructive
  },
  pending: {
    label: "Pending",
    color: "#f59e0b", // amber-500 - warning
  },
  created: {
    label: "Created",
    color: "#4585f4", // CitizenGO primary blue
  },
} satisfies ChartConfig

export function StatusDistributionChart({ data, totalCampaigns }: StatusDistributionChartProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Status Distribution</CardTitle>
        <CardDescription>Campaign status breakdown</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              dataKey="count"
              nameKey="name"
              innerRadius={50}
              strokeWidth={5}
              activeIndex={0}
              activeShape={({
                outerRadius = 0,
                ...props
              }: PieSectorDataItem) => (
                <Sector {...props} outerRadius={outerRadius + 10} />
              )}
            />
            <ChartLegend
              content={<ChartLegendContent nameKey="name" />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
} 