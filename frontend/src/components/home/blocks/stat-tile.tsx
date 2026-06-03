import { Minus, TrendingDown, TrendingUp } from "lucide-react";

import type { TrendInfo } from "@/lib/home";
import { cn } from "@/lib/utils";

const TREND_ICON = {
    up: TrendingUp,
    down: TrendingDown,
    flat: Minus,
} as const;

export function StatTile({
    label,
    value,
    trend,
}: {
    label: string;
    value: string;
    trend?: TrendInfo;
}) {
    const Icon = trend ? TREND_ICON[trend.dir] : null;
    return (
        <div className="flex flex-col gap-1 rounded-lg border p-4">
            <span className="text-foreground/70 text-sm">{label}</span>
            <div className="flex items-baseline gap-2">
                <span className="font-semibold text-2xl tracking-tight">
                    {value}
                </span>
                {trend && Icon ? (
                    <span
                        className={cn(
                            "flex items-center gap-0.5 text-xs",
                            trend.dir === "up" && "text-primary",
                            trend.dir === "down" && "text-destructive",
                        )}
                    >
                        <Icon className="size-3.5" />
                        {trend.value}
                    </span>
                ) : null}
            </div>
        </div>
    );
}
