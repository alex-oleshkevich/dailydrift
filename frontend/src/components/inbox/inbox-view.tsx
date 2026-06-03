import {
    FileText,
    Globe,
    MessageSquare,
    MousePointerClick,
    Plug,
    Radar,
    Webhook,
} from "lucide-react";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    type Signal,
    type SignalSource,
    type SignalState,
    seedSignals,
} from "@/lib/signals";
import { cn } from "@/lib/utils";

const SOURCE_ICON: Record<SignalSource, typeof MessageSquare> = {
    message: MessageSquare,
    file: FileText,
    web: Globe,
    browser: MousePointerClick,
    watcher: Radar,
    connector: Plug,
    api: Webhook,
};

const STATE_META: Record<SignalState, { label: string; dot: string }> = {
    pending: { label: "Pending", dot: "bg-muted-foreground" },
    processing: { label: "Processing", dot: "bg-warning animate-pulse" },
    done: { label: "Done", dot: "bg-primary" },
};

const FILTERS: { id: "all" | SignalState; label: string }[] = [
    { id: "all", label: "All" },
    { id: "pending", label: "Pending" },
    { id: "processing", label: "Processing" },
    { id: "done", label: "Done" },
];

function StateBadge({ state }: { state: SignalState }) {
    const meta = STATE_META[state];
    return (
        <Badge variant="outline" className="gap-1.5">
            <span className={cn("size-1.5 rounded-full", meta.dot)} />
            {meta.label}
        </Badge>
    );
}

function SignalRow({ signal }: { signal: Signal }) {
    const Icon = SOURCE_ICON[signal.source];
    return (
        <div className="flex items-start gap-3 px-2 py-3">
            <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="font-medium text-sm">{signal.title}</span>
                {signal.detail ? (
                    <span className="text-muted-foreground text-sm">
                        {signal.detail}
                    </span>
                ) : null}
                <div className="mt-1 flex items-center gap-2">
                    <Badge variant="secondary">{signal.space}</Badge>
                    <span className="text-muted-foreground text-xs">
                        {signal.time}
                    </span>
                </div>
            </div>
            <StateBadge state={signal.state} />
        </div>
    );
}

export function InboxView() {
    const [signals] = useState(seedSignals);
    const [filter, setFilter] = useState<"all" | SignalState>("all");

    const counts = useMemo(() => {
        const base = {
            all: signals.length,
            pending: 0,
            processing: 0,
            done: 0,
        };
        for (const signal of signals) {
            base[signal.state] += 1;
        }
        return base;
    }, [signals]);

    const visible =
        filter === "all"
            ? signals
            : signals.filter((signal) => signal.state === filter);

    return (
        <ScrollArea className="h-full">
            <div className="mx-auto flex max-w-2xl flex-col gap-5 px-8 py-10">
                <header className="flex flex-col gap-1">
                    <h1 className="font-semibold text-xl tracking-tight">
                        Inbox
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        {signals.length} received signals
                    </p>
                </header>

                <div className="flex flex-wrap items-center gap-2">
                    {FILTERS.map((option) => (
                        <Button
                            key={option.id}
                            variant={
                                filter === option.id ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setFilter(option.id)}
                        >
                            {option.label}
                            <span className="text-xs tabular-nums opacity-70">
                                {counts[option.id]}
                            </span>
                        </Button>
                    ))}
                </div>

                <div className="flex flex-col divide-y">
                    {visible.map((signal) => (
                        <SignalRow key={signal.id} signal={signal} />
                    ))}
                </div>
            </div>
        </ScrollArea>
    );
}
