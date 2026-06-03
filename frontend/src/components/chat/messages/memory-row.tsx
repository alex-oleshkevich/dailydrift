import { Brain } from "lucide-react";

import { SystemEvent } from "@/components/chat/messages/parts";
import type { MemoryMessage } from "@/lib/conversation";

export function MemoryRow({ message }: { message: MemoryMessage }) {
    return (
        <SystemEvent
            accent="muted"
            icon={Brain}
            label="Memory updated"
            time={message.time}
        >
            <p className="text-pretty text-muted-foreground leading-relaxed">
                {message.content}
            </p>
        </SystemEvent>
    );
}
