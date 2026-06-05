import { useState } from "react";

import { MomentumBadge } from "@/components/chat/messages/parts";
import { SituationCard } from "@/components/chat/messages/situation-card";
import { NarrativeCard } from "@/components/narrative/narrative-card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type HomeStoryline, seedHome } from "@/lib/home";

function SectionLabel({ children }: { children: React.ReactNode }) {
    return <h2 className="font-semibold text-sm tracking-tight">{children}</h2>;
}

function StorylineRow({ storyline }: { storyline: HomeStoryline }) {
    return (
        <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium text-sm">{storyline.title}</span>
                <MomentumBadge momentum={storyline.momentum} />
                <span className="text-muted-foreground text-xs capitalize">
                    {storyline.status}
                </span>
            </div>
            <span className="text-sm leading-relaxed">{storyline.line}</span>
        </div>
    );
}

export function HomeView() {
    const [data, setData] = useState(seedHome);

    const resolve = (id: string, action: string) =>
        setData((prev) => ({
            ...prev,
            attention: prev.attention.map((s) =>
                s.id === id ? { ...s, resolved: action } : s,
            ),
        }));

    return (
        <ScrollArea className="h-full">
            <div className="mx-auto flex max-w-2xl flex-col gap-8 px-8 py-10">
                <header className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                        <h1 className="font-semibold text-xl tracking-tight">
                            Home
                        </h1>
                        <Badge variant="secondary">{data.space}</Badge>
                    </div>
                    <NarrativeCard narrative={data.narrative} />
                </header>

                <section className="flex flex-col gap-2">
                    <SectionLabel>Needs attention</SectionLabel>
                    {data.attention.map((situation) => (
                        <SituationCard
                            key={situation.id}
                            message={situation}
                            onResolve={resolve}
                        />
                    ))}
                </section>

                <section className="flex flex-col gap-3">
                    <SectionLabel>Active Storylines</SectionLabel>
                    <div className="flex flex-col gap-4">
                        {data.storylines.map((storyline) => (
                            <StorylineRow
                                key={storyline.id}
                                storyline={storyline}
                            />
                        ))}
                    </div>
                </section>
            </div>
        </ScrollArea>
    );
}
