import { useState } from "react";

import {
    type MessageActions,
    MessageItem,
} from "@/components/chat/message-item";
import { MomentumBadge } from "@/components/chat/messages/parts";
import { SituationCard } from "@/components/chat/messages/situation-card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type StorylineStatus, seedStoryline } from "@/lib/storyline";

// History is read-only; situations here are already resolved, so the resolve
// handlers are never reached.
const READONLY_ACTIONS: MessageActions = {
    onResolvePermission: () => {},
    onResolveSituation: () => {},
    onAnswerQuestionnaire: () => {},
    onRetry: () => {},
};

function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
        <h2 className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
            {children}
        </h2>
    );
}

function StatusBadge({ status }: { status: StorylineStatus }) {
    if (status === "blocked") {
        return (
            <Badge className="bg-warning text-warning-foreground capitalize">
                {status}
            </Badge>
        );
    }
    return (
        <Badge
            variant={status === "active" ? "secondary" : "outline"}
            className="capitalize"
        >
            {status}
        </Badge>
    );
}

export function StorylineView({ storylineId }: { storylineId: string }) {
    const [data, setData] = useState(() => seedStoryline(storylineId));

    const resolveAttention = (_id: string, action: string) =>
        setData((prev) =>
            prev.attention
                ? {
                      ...prev,
                      attention: { ...prev.attention, resolved: action },
                  }
                : prev,
        );

    return (
        <ScrollArea className="h-full">
            <div className="mx-auto flex max-w-2xl flex-col gap-8 px-8 py-10">
                <header className="flex flex-col gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                        <h1 className="font-semibold text-xl tracking-tight">
                            {data.title}
                        </h1>
                        <MomentumBadge momentum={data.momentum} />
                        <StatusBadge status={data.status} />
                    </div>
                    <p className="text-pretty text-muted-foreground leading-relaxed">
                        {data.narrative}
                    </p>
                    {data.entities.length > 0 ? (
                        <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-muted-foreground text-xs">
                                Entities
                            </span>
                            {data.entities.map((entity) => (
                                <Badge key={entity} variant="secondary">
                                    {entity}
                                </Badge>
                            ))}
                        </div>
                    ) : null}
                </header>

                {data.attention ? (
                    <section className="flex flex-col gap-2">
                        <SectionLabel>Needs attention now</SectionLabel>
                        <SituationCard
                            message={data.attention}
                            onResolve={resolveAttention}
                        />
                    </section>
                ) : null}

                <section className="flex flex-col gap-3">
                    <SectionLabel>History</SectionLabel>
                    <div className="flex flex-col gap-4 border-border border-l pl-4">
                        {data.history.map((event) => (
                            <MessageItem
                                key={event.id}
                                message={event}
                                {...READONLY_ACTIONS}
                            />
                        ))}
                    </div>
                </section>
            </div>
        </ScrollArea>
    );
}
