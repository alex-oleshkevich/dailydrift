import { Brain, Cog, Pin } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CURATOR } from "@/lib/conversation";
import {
    type CuratorJob,
    type CuratorJobStatus,
    type MemoryItem,
    type MemoryKind,
    seedCuratorJobs,
    seedMemory,
} from "@/lib/memory";
import { cn } from "@/lib/utils";

const KIND_TINT: Record<MemoryKind, string> = {
    fact: "bg-chart-2/20 text-chart-2",
    preference: "bg-chart-4/20 text-chart-4",
    profile: "bg-chart-1/20 text-chart-1",
    summary: "bg-chart-3/20 text-chart-3",
};

const JOB_DOT: Record<CuratorJobStatus, string> = {
    running: "bg-warning animate-pulse",
    done: "bg-primary",
    idle: "bg-muted-foreground",
};

function MemoryRow({ item }: { item: MemoryItem }) {
    return (
        <div
            className={cn(
                "flex items-start gap-3 px-2 py-3",
                item.superseded && "opacity-50",
            )}
        >
            <div className="flex min-w-0 flex-1 flex-col gap-1">
                <span
                    className={cn("text-sm", item.superseded && "line-through")}
                >
                    {item.content}
                </span>
                <div className="flex flex-wrap items-center gap-2 text-muted-foreground text-xs">
                    <Badge variant="outline" className={KIND_TINT[item.kind]}>
                        {item.kind}
                    </Badge>
                    <Badge variant="secondary">{item.space}</Badge>
                    {item.pinned ? (
                        <span className="flex items-center gap-1">
                            <Pin className="size-3" /> pinned
                        </span>
                    ) : null}
                    {item.superseded ? <span>superseded</span> : null}
                    <span>used {item.lastUsed}</span>
                </div>
            </div>
            <div className="flex w-16 shrink-0 flex-col items-end gap-1">
                <span className="text-muted-foreground text-xs tabular-nums">
                    {Math.round(item.salience * 100)}%
                </span>
                <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
                    <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${item.salience * 100}%` }}
                    />
                </div>
            </div>
        </div>
    );
}

function JobRow({ job }: { job: CuratorJob }) {
    return (
        <div className="flex items-start gap-3 px-2 py-2.5">
            <span
                className={cn(
                    "mt-1.5 size-1.5 shrink-0 rounded-full",
                    JOB_DOT[job.status],
                )}
            />
            <div className="flex min-w-0 flex-1 flex-col">
                <code className="text-foreground text-xs">{job.kind}</code>
                <span className="text-muted-foreground text-sm">
                    {job.detail}
                </span>
            </div>
            <span className="shrink-0 text-muted-foreground text-xs">
                {job.time}
            </span>
        </div>
    );
}

export function MemoryView() {
    const [items] = useState(seedMemory);
    const [jobs] = useState(seedCuratorJobs);
    return (
        <ScrollArea className="h-full">
            <div className="mx-auto flex max-w-2xl flex-col gap-6 px-8 py-10">
                <header className="flex flex-col gap-1">
                    <h1 className="flex items-center gap-2 font-semibold text-xl tracking-tight">
                        <Brain className="size-5 text-muted-foreground" />
                        Memory
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        Durable distilled knowledge + the shared semantic index.
                        Recall is orchestrator-injected — agents never query it
                        themselves. Salience decays with disuse.
                    </p>
                </header>
                <div className="flex flex-col divide-y">
                    {items.map((item) => (
                        <MemoryRow key={item.id} item={item} />
                    ))}
                </div>

                <section className="flex flex-col gap-2">
                    <h2 className="flex items-center gap-2 font-semibold text-sm">
                        <Cog className="size-4 text-muted-foreground" />
                        {CURATOR.name} — {CURATOR.role}
                    </h2>
                    <div className="flex flex-col divide-y rounded-md border">
                        {jobs.map((job) => (
                            <JobRow key={job.id} job={job} />
                        ))}
                    </div>
                </section>
            </div>
        </ScrollArea>
    );
}
