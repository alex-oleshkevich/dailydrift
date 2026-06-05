import { File, FileText, Globe, Mail } from "lucide-react";
import { useState } from "react";

import {
    type MessageActions,
    MessageItem,
} from "@/components/chat/message-item";
import { MomentumBadge } from "@/components/chat/messages/parts";
import { SituationCard } from "@/components/chat/messages/situation-card";
import { NarrativeCard } from "@/components/narrative/narrative-card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { SourceType } from "@/lib/conversation";
import { type StorylineStatus, seedStoryline } from "@/lib/storyline";

const EVIDENCE_ICON: Record<SourceType, typeof Mail> = {
    mail: Mail,
    doc: FileText,
    web: Globe,
    file: File,
};

const READONLY_ACTIONS: MessageActions = {
    onResolvePermission: () => {},
    onResolveSituation: () => {},
    onAnswerQuestionnaire: () => {},
    onRetry: () => {},
};

function SectionLabel({ children }: { children: React.ReactNode }) {
    return <h2 className="font-semibold text-sm tracking-tight">{children}</h2>;
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

    const resolveSituation = (id: string, action: string) =>
        setData((prev) => ({
            ...prev,
            situations: prev.situations.map((s) =>
                s.id === id ? { ...s, resolved: action } : s,
            ),
        }));

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
                    <NarrativeCard
                        narrative={data.narrative}
                        evidenceCount={data.evidence.length}
                    />
                </header>

                {data.situations.length > 0 ? (
                    <section className="flex flex-col gap-2">
                        <SectionLabel>Needs attention now</SectionLabel>
                        {data.situations.map((situation) => (
                            <SituationCard
                                key={situation.id}
                                message={situation}
                                onResolve={resolveSituation}
                            />
                        ))}
                    </section>
                ) : null}

                <div className="grid gap-6 sm:grid-cols-2">
                    <section className="flex flex-col gap-2">
                        <SectionLabel>Evidence</SectionLabel>
                        <div className="flex flex-col gap-1.5">
                            {data.evidence.map((ev) => {
                                const Icon = EVIDENCE_ICON[ev.type];
                                return (
                                    <div
                                        key={ev.id}
                                        className="flex items-center gap-2 text-sm"
                                    >
                                        <Icon className="size-3.5 shrink-0 text-muted-foreground" />
                                        <span className="min-w-0 truncate">
                                            {ev.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                    <section className="flex flex-col gap-2">
                        <SectionLabel>Entities</SectionLabel>
                        <div className="flex flex-wrap items-start gap-1.5">
                            {data.entities.map((entity) => (
                                <Badge key={entity} variant="secondary">
                                    {entity}
                                </Badge>
                            ))}
                        </div>
                    </section>
                </div>

                {data.insights.length > 0 ? (
                    <section className="flex flex-col gap-3">
                        <SectionLabel>Insights</SectionLabel>
                        <div className="flex flex-col gap-4">
                            {data.insights.map((insight) => (
                                <MessageItem
                                    key={insight.id}
                                    message={insight}
                                    {...READONLY_ACTIONS}
                                />
                            ))}
                        </div>
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
