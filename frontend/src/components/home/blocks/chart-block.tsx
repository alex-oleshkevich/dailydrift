import {
    Bar,
    BarChart,
    CartesianGrid,
    Line,
    LineChart,
    Pie,
    PieChart,
    XAxis,
} from "recharts";

import {
    type ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import type { ChartDatum } from "@/lib/home";

const CONFIG = {
    value: { label: "Value", color: "var(--chart-2)" },
} satisfies ChartConfig;

const PIE_COLORS = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
];

export function ChartBlock({
    variant,
    title,
    data,
}: {
    variant: "bar" | "line" | "pie";
    title?: string;
    data: ChartDatum[];
}) {
    const pieData = data.map((entry, index) => ({
        ...entry,
        fill: PIE_COLORS[index % PIE_COLORS.length],
    }));
    return (
        <div className="flex flex-col gap-2">
            {title ? (
                <span className="font-medium text-sm">{title}</span>
            ) : null}
            <ChartContainer config={CONFIG} className="h-44 w-full">
                {variant === "bar" ? (
                    <BarChart data={data}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="label"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar
                            dataKey="value"
                            fill="var(--color-value)"
                            radius={4}
                        />
                    </BarChart>
                ) : variant === "line" ? (
                    <LineChart data={data}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="label"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line
                            dataKey="value"
                            stroke="var(--color-value)"
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                ) : (
                    <PieChart>
                        <ChartTooltip
                            content={<ChartTooltipContent nameKey="label" />}
                        />
                        <Pie
                            data={pieData}
                            dataKey="value"
                            nameKey="label"
                            innerRadius={40}
                        />
                    </PieChart>
                )}
            </ChartContainer>
        </div>
    );
}
