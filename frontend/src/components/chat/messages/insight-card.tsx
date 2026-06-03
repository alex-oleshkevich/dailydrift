import { Sparkles } from "lucide-react";

import { EvidenceChips, SystemEvent } from "@/components/chat/messages/parts";
import { Badge } from "@/components/ui/badge";
import type { InsightMessage } from "@/lib/conversation";

export function InsightCard({ message }: { message: InsightMessage }) {
    return (
        <SystemEvent
            accent="primary"
            icon={Sparkles}
            label="Insight"
            time={message.time}
            badge={
                <Badge variant="outline" className="capitalize">
                    {message.category}
                </Badge>
            }
        >
            <p className="text-pretty leading-relaxed">{message.body}</p>
            {message.evidence ? (
                <EvidenceChips evidence={message.evidence} />
            ) : null}
        </SystemEvent>
    );
}
