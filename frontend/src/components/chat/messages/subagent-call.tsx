import { ArrowRight, Check, CircleX, Loader2, Workflow } from "lucide-react";

import {
    AgentAvatar,
    type SystemAccent,
    SystemEvent,
    ThinkingLog,
} from "@/components/chat/messages/parts";
import { Badge } from "@/components/ui/badge";
import {
    AGENTS,
    type SubagentCallMessage,
    type SubagentStatus,
} from "@/lib/conversation";
import { cn } from "@/lib/utils";

const STATUS_META: Record<
    SubagentStatus,
    {
        label: string;
        icon: typeof Check;
        accent: SystemAccent;
        variant: "secondary" | "destructive";
    }
> = {
    running: {
        label: "Running",
        icon: Loader2,
        accent: "muted",
        variant: "secondary",
    },
    done: {
        label: "Done",
        icon: Check,
        accent: "primary",
        variant: "secondary",
    },
    failed: {
        label: "Failed",
        icon: CircleX,
        accent: "destructive",
        variant: "destructive",
    },
};

export function SubagentCall({ message }: { message: SubagentCallMessage }) {
    const caller = AGENTS[message.agentId];
    const subagent = AGENTS[message.subagentId];
    const status = STATUS_META[message.status];
    const StatusIcon = status.icon;

    return (
        <SystemEvent
            accent={status.accent}
            icon={Workflow}
            label="Subagent"
            time={message.time}
            badge={
                <Badge variant={status.variant}>
                    <StatusIcon
                        data-icon="inline-start"
                        className={cn(
                            message.status === "running" && "animate-spin",
                        )}
                    />
                    {status.label}
                </Badge>
            }
        >
            <div className="flex items-center gap-2">
                <AgentAvatar agentId={message.agentId} />
                <span className="font-medium">{caller.name}</span>
                <ArrowRight className="size-3.5 text-muted-foreground" />
                <AgentAvatar agentId={message.subagentId} />
                <span className="font-medium">{subagent.name}</span>
            </div>
            <p className="text-pretty text-muted-foreground leading-relaxed">
                {message.task}
            </p>
            {message.steps ? <ThinkingLog thinking={message.steps} /> : null}
            {message.result ? (
                <div className="border-border border-l-2 pl-3 text-foreground">
                    {message.result}
                </div>
            ) : null}
        </SystemEvent>
    );
}
