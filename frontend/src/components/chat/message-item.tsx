import { memo } from "react";

import { AgentMessage } from "@/components/chat/messages/agent-message";
import { ErrorRow } from "@/components/chat/messages/error-row";
import { EventDivider } from "@/components/chat/messages/event-divider";
import { InsightCard } from "@/components/chat/messages/insight-card";
import { MemoryRow } from "@/components/chat/messages/memory-row";
import { PermissionCard } from "@/components/chat/messages/permission-card";
import { QuestionnaireCard } from "@/components/chat/messages/questionnaire-card";
import { SituationCard } from "@/components/chat/messages/situation-card";
import { StorylineStarted } from "@/components/chat/messages/storyline-started";
import { StorylineUpdate } from "@/components/chat/messages/storyline-update";
import { SubagentCall } from "@/components/chat/messages/subagent-call";
import { TaskCreated } from "@/components/chat/messages/task-created";
import { UserMessage } from "@/components/chat/messages/user-message";
import type { Decision, Message } from "@/lib/conversation";

export interface MessageActions {
    onResolvePermission: (id: string, decision: Decision) => void;
    onResolveSituation: (id: string, action: string) => void;
    onAnswerQuestionnaire: (id: string, answer: string) => void;
    onRetry: (id: string) => void;
    onOpenTask?: (taskId: string) => void;
}

function MessageItemImpl({
    message,
    onResolvePermission,
    onResolveSituation,
    onAnswerQuestionnaire,
    onRetry,
    onOpenTask,
}: { message: Message } & MessageActions) {
    switch (message.kind) {
        case "user":
            return <UserMessage message={message} />;
        case "agent":
            return <AgentMessage message={message} />;
        case "permission":
            return (
                <PermissionCard
                    message={message}
                    onResolve={onResolvePermission}
                />
            );
        case "insight":
            return <InsightCard message={message} />;
        case "situation":
            return (
                <SituationCard
                    message={message}
                    onResolve={onResolveSituation}
                />
            );
        case "storyline":
            return <StorylineUpdate message={message} />;
        case "storyline-started":
            return <StorylineStarted message={message} />;
        case "questionnaire":
            return (
                <QuestionnaireCard
                    message={message}
                    onAnswer={onAnswerQuestionnaire}
                />
            );
        case "memory":
            return <MemoryRow message={message} />;
        case "task-created":
            return <TaskCreated message={message} onOpenTask={onOpenTask} />;
        case "subagent-call":
            return <SubagentCall message={message} />;
        case "event":
            return <EventDivider message={message} />;
        case "error":
            return <ErrorRow message={message} onRetry={onRetry} />;
        default:
            return null;
    }
}

export const MessageItem = memo(MessageItemImpl);
