import {
    AgentAvatar,
    chatBubbleVariants,
    EvidenceChips,
    FileChip,
    ThinkingLog,
} from "@/components/chat/messages/parts";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/ui/copy-button";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";
import { TypingIndicator } from "@/components/ui/typing-indicator";
import {
    AGENTS,
    type AgentMessage as AgentMessageData,
} from "@/lib/conversation";
import { cn } from "@/lib/utils";

export function AgentMessage({ message }: { message: AgentMessageData }) {
    const agent = AGENTS[message.agentId];
    return (
        <div className="flex gap-3">
            <AgentAvatar agentId={message.agentId} />
            <div className="flex min-w-0 flex-col items-start gap-1.5">
                <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{agent.name}</span>
                    <Badge variant="ghost" className="text-muted-foreground">
                        {agent.role}
                    </Badge>
                    <span className="text-muted-foreground text-xs">
                        {message.time}
                    </span>
                </div>
                {message.thinking ? (
                    <ThinkingLog thinking={message.thinking} />
                ) : null}
                {message.streaming && !message.body ? (
                    <TypingIndicator />
                ) : (
                    <div className={cn(chatBubbleVariants({ isUser: false }))}>
                        <MarkdownRenderer>{message.body}</MarkdownRenderer>
                        {!message.streaming && message.body ? (
                            <div className="absolute right-2 -bottom-4 flex space-x-1 rounded-lg border bg-background p-1 text-foreground opacity-0 transition-opacity group-hover/message:opacity-100">
                                <CopyButton content={message.body} />
                            </div>
                        ) : null}
                    </div>
                )}
                {message.evidence ? (
                    <EvidenceChips evidence={message.evidence} />
                ) : null}
                {message.attachments?.map((file) => (
                    <FileChip key={file.id} file={file} />
                ))}
            </div>
        </div>
    );
}
