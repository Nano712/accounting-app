import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
} from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartConfig = {
  revenue: {
    label: "収益",
    color: "var(--chart-1)",
  },
  expense: {
    label: "費用",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

const chartData = [
  { month: "4月", revenue: 300000, expense: 200000 },
  { month: "5月", revenue: 400000, expense: 250000 },
  { month: "6月", revenue: 350000, expense: 180000 },
];

export function RevenueExpenseChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-300px w-full">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
        <Bar dataKey="expense" fill="var(--color-expense)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}