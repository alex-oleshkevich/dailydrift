import { TriangleAlert } from "lucide-react";

import { SystemEvent } from "@/components/chat/messages/parts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { SituationMessage } from "@/lib/conversation";

export function SituationCard({
    message,
    onResolve,
}: {
    message: SituationMessage;
    onResolve: (id: string, action: string) => void;
}) {
    return (
        <SystemEvent
            accent="warning"
            emphasis
            icon={TriangleAlert}
            label={`Situation · ${message.title}`}
            time={message.time}
            badge={
                <Badge className="bg-warning text-warning-foreground">
                    {message.attention}
                </Badge>
            }
            footer={
                message.resolved ? (
                    <span className="text-muted-foreground text-sm">
                        Resolved · {message.resolved}
                    </span>
                ) : (
                    <div className="flex flex-wrap gap-1.5">
                        {message.actions.map((action) => (
                            <Button
                                key={action}
                                size="sm"
                                variant="outline"
                                onClick={() => onResolve(message.id, action)}
                            >
                                {action}
                            </Button>
                        ))}
                    </div>
                )
            }
        >
            <p className="text-pretty leading-relaxed">{message.detail}</p>
            {message.storyline ? (
                <span className="text-muted-foreground text-xs">
                    Tied to “{message.storyline}”
                </span>
            ) : null}
        </SystemEvent>
    );
}
