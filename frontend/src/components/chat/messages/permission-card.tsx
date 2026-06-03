import { Lock } from "lucide-react";

import { SystemEvent } from "@/components/chat/messages/parts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    AGENTS,
    type Decision,
    type PermissionMessage,
} from "@/lib/conversation";

const DECISIONS: { value: Decision; label: string }[] = [
    { value: "allow-once", label: "Allow once" },
    { value: "allow-run", label: "For this run" },
    { value: "allow-always", label: "Always" },
];

export function PermissionCard({
    message,
    onResolve,
    compact = false,
}: {
    message: PermissionMessage;
    onResolve: (id: string, decision: Decision) => void;
    compact?: boolean;
}) {
    const agent = AGENTS[message.agentId];
    return (
        <SystemEvent
            accent="warning"
            emphasis
            icon={Lock}
            label="Permission"
            time={message.time}
            badge={<Badge variant="outline">Ask-first</Badge>}
            footer={
                message.decision ? (
                    <span className="text-muted-foreground text-sm capitalize">
                        Resolved · {message.decision.replace("-", " ")}
                    </span>
                ) : (
                    <div className="flex flex-wrap gap-1.5">
                        {(compact ? DECISIONS.slice(0, 1) : DECISIONS).map(
                            (option) => (
                                <Button
                                    key={option.value}
                                    size="sm"
                                    variant="secondary"
                                    onClick={() =>
                                        onResolve(message.id, option.value)
                                    }
                                >
                                    {option.label}
                                </Button>
                            ),
                        )}
                        <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => onResolve(message.id, "deny")}
                        >
                            Deny
                        </Button>
                    </div>
                )
            }
        >
            <p className="text-pretty leading-relaxed">
                {agent.name} wants to {message.action.toLowerCase()}{" "}
                <span className="font-medium">{message.detail}</span>.
            </p>
        </SystemEvent>
    );
}
