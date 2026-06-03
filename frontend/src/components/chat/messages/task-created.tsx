import { ArrowUpRight, ListTodo } from "lucide-react";

import { SystemEvent } from "@/components/chat/messages/parts";
import { Button } from "@/components/ui/button";
import { AGENTS, type TaskCreatedMessage } from "@/lib/conversation";

export function TaskCreated({
    message,
    onOpenTask,
}: {
    message: TaskCreatedMessage;
    onOpenTask?: (taskId: string) => void;
}) {
    return (
        <SystemEvent
            accent="muted"
            icon={ListTodo}
            label="Task created"
            time={message.time}
            footer={
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onOpenTask?.(message.taskId)}
                >
                    {message.title}
                    <ArrowUpRight data-icon="inline-end" />
                </Button>
            }
        >
            <p className="text-muted-foreground">
                {AGENTS[message.agentId].name} opened a task.
            </p>
        </SystemEvent>
    );
}
