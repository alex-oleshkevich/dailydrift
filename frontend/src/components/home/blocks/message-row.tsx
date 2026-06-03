import { AgentAvatar } from "@/components/chat/messages/parts";
import { AGENTS, type AgentId } from "@/lib/conversation";

export function MessageRow({
    agentId,
    body,
}: {
    agentId: AgentId;
    body: string;
}) {
    return (
        <div className="flex gap-3">
            <AgentAvatar agentId={agentId} />
            <div className="flex flex-col gap-0.5">
                <span className="font-medium text-sm">
                    {AGENTS[agentId].name}
                </span>
                <span className="text-sm">{body}</span>
            </div>
        </div>
    );
}
