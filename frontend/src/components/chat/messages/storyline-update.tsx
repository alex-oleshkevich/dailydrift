import { Waypoints } from "lucide-react";

import { MomentumBadge, SystemEvent } from "@/components/chat/messages/parts";
import type { StorylineMessage } from "@/lib/conversation";

export function StorylineUpdate({ message }: { message: StorylineMessage }) {
    return (
        <SystemEvent
            accent="muted"
            icon={Waypoints}
            label={`Storyline · ${message.title}`}
            time={message.time}
            badge={<MomentumBadge momentum={message.momentum} />}
        >
            <p className="text-pretty text-muted-foreground leading-relaxed">
                {message.detail}
            </p>
        </SystemEvent>
    );
}
