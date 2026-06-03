import { BookPlus } from "lucide-react";

import { SystemEvent } from "@/components/chat/messages/parts";
import { AGENTS, type StorylineStartedMessage } from "@/lib/conversation";

export function StorylineStarted({
    message,
}: {
    message: StorylineStartedMessage;
}) {
    return (
        <SystemEvent
            accent="primary"
            icon={BookPlus}
            label={`Storyline started · ${message.title}`}
            time={message.time}
        >
            <p className="text-pretty text-muted-foreground leading-relaxed">
                {AGENTS[message.agentId].name} {message.detail}
            </p>
        </SystemEvent>
    );
}
