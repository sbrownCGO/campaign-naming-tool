"use client"

import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"
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
} from "@/components/ui/chart"

interface TopicData {
  name: string
  count: number
  fill: string
}

interface TopicDistributionChartProps {
  data: TopicData[]
}

const chartConfig = {
  count: {
    label: "Campaigns",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function TopicDistributionChart({ data }: TopicDistributionChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Topics Distribution</CardTitle>
        <CardDescription>Campaigns by topic</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={data}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.length > 8 ? value.slice(0, 8) + "..." : value}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="count" fill="var(--color-count)" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
} 