import { cva } from "class-variance-authority";
import {
    ChevronRight,
    Download,
    File,
    FileText,
    Globe,
    type LucideIcon,
    Mail,
    Minus,
    RotateCw,
    TrendingDown,
    TrendingUp,
} from "lucide-react";
import type { ReactNode } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
    AGENTS,
    type AgentId,
    type Evidence,
    type FileRef,
    type Momentum,
    type SourceType,
} from "@/lib/conversation";
import { cn } from "@/lib/utils";

// Ported from shadcn-chatbot-kit's ChatMessage: user = primary bubble (right),
// agent = muted bubble (left). Animation omitted — it re-fires per row while
// virtualizing, so we keep entrances clean.
export const chatBubbleVariants = cva(
    "group/message relative w-fit max-w-[80%] break-words rounded-lg p-3 text-sm",
    {
        variants: {
            isUser: {
                true: "bg-primary text-primary-foreground",
                false: "bg-muted text-foreground",
            },
        },
        defaultVariants: { isUser: false },
    },
);

const SOURCE_ICON = {
    mail: Mail,
    doc: FileText,
    web: Globe,
    file: File,
} as const;

const MOMENTUM_ICON = {
    advancing: TrendingUp,
    steady: Minus,
    stalled: TrendingDown,
    looping: RotateCw,
} as const;

export function AgentAvatar({
    agentId,
    size = "sm",
}: {
    agentId: AgentId;
    size?: "default" | "sm";
}) {
    const agent = AGENTS[agentId];
    return (
        <Avatar size={size}>
            <AvatarFallback className={agent.tint}>
                {agent.initials}
            </AvatarFallback>
        </Avatar>
    );
}

export function FileChip({
    file,
    onDownload,
}: {
    file: FileRef;
    onDownload?: (file: FileRef) => void;
}) {
    return (
        <div className="flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-sm">
            <FileText className="size-4 text-muted-foreground" />
            <span className="font-medium">{file.name}</span>
            <span className="text-muted-foreground text-xs">{file.size}</span>
            <Button
                variant="ghost"
                size="icon-xs"
                className="ml-auto"
                aria-label={`Download ${file.name}`}
                onClick={() => onDownload?.(file)}
            >
                <Download />
            </Button>
        </div>
    );
}

export function EvidenceChips({ evidence }: { evidence: Evidence[] }) {
    return (
        <div className="flex flex-wrap items-center gap-1">
            <span className="text-muted-foreground text-xs">Evidence</span>
            {evidence.map((source, index) => {
                const Icon = SOURCE_ICON[source.type as SourceType];
                return (
                    <HoverCard key={source.id}>
                        <HoverCardTrigger
                            render={
                                <Badge
                                    variant="outline"
                                    className="cursor-default"
                                />
                            }
                        >
                            {index + 1}
                        </HoverCardTrigger>
                        <HoverCardContent className="flex w-auto items-center gap-2">
                            <Icon className="size-4 text-muted-foreground" />
                            <span>{source.label}</span>
                        </HoverCardContent>
                    </HoverCard>
                );
            })}
        </div>
    );
}

export function ThinkingLog({ thinking }: { thinking: string[] }) {
    return (
        <Collapsible>
            <CollapsibleTrigger className="group/think flex items-center gap-1 text-muted-foreground text-xs">
                <ChevronRight className="size-3 transition-transform group-data-[panel-open]/think:rotate-90" />
                Thought through {thinking.length} steps
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-1 border-muted border-l-2 pl-3 text-muted-foreground text-xs">
                <ul className="flex flex-col gap-0.5">
                    {thinking.map((step) => (
                        <li key={step}>{step}</li>
                    ))}
                </ul>
            </CollapsibleContent>
        </Collapsible>
    );
}

export function MomentumBadge({
    momentum,
    label,
}: {
    momentum: Momentum;
    label?: string;
}) {
    const Icon = MOMENTUM_ICON[momentum];
    return (
        <Badge variant="outline">
            <Icon data-icon="inline-start" />
            {label ?? momentum}
        </Badge>
    );
}

export type SystemAccent = "primary" | "warning" | "destructive" | "muted";

const SYSTEM_ACCENT: Record<
    SystemAccent,
    { rail: string; icon: string; bg: string; border: string }
> = {
    primary: {
        rail: "border-l-primary/50",
        icon: "text-primary",
        bg: "bg-primary/5",
        border: "border-primary/30",
    },
    warning: {
        rail: "border-l-warning/60",
        icon: "text-warning",
        bg: "bg-warning/5",
        border: "border-warning/30",
    },
    destructive: {
        rail: "border-l-destructive/60",
        icon: "text-destructive",
        bg: "bg-destructive/5",
        border: "border-destructive/30",
    },
    muted: {
        rail: "border-l-border",
        icon: "text-muted-foreground",
        bg: "bg-muted/40",
        border: "border-border",
    },
};

// Shared "system register" for non-dialogue messages: a semantic accent
// (left rail, or a tinted surface when emphasis is set), an icon, a header
// row (label · badge · timestamp), and hanging-indented content/footer.
export function SystemEvent({
    accent = "muted",
    icon: Icon,
    label,
    badge,
    time,
    emphasis = false,
    children,
    footer,
}: {
    accent?: SystemAccent;
    icon: LucideIcon;
    label: ReactNode;
    badge?: ReactNode;
    time?: string;
    emphasis?: boolean;
    children?: ReactNode;
    footer?: ReactNode;
}) {
    const tone = SYSTEM_ACCENT[accent];
    return (
        <div
            className={cn(
                "flex max-w-xl flex-col gap-2 text-sm",
                emphasis
                    ? cn("rounded-lg border p-3", tone.bg, tone.border)
                    : cn("border-l-2 py-0.5 pl-3", tone.rail),
            )}
        >
            <div className="flex items-center gap-2">
                <Icon className={cn("size-4 shrink-0", tone.icon)} />
                <span className="min-w-0 truncate font-medium">{label}</span>
                {badge}
                {time ? (
                    <span className="ml-auto shrink-0 text-muted-foreground text-xs">
                        {time}
                    </span>
                ) : null}
            </div>
            {children ? (
                <div className="flex flex-col gap-2 pl-6">{children}</div>
            ) : null}
            {footer ? <div className="pl-6">{footer}</div> : null}
        </div>
    );
}
