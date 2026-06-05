import { CalendarClock, Pause, Play, Radar } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AGENTS } from "@/lib/conversation";
import {
    type PeriodicTask,
    type PeriodicTaskStatus,
    seedPeriodicTasks,
} from "@/lib/periodic-tasks";
import { cn } from "@/lib/utils";

const STATUS_META: Record<PeriodicTaskStatus, { label: string; dot: string }> =
    {
        enabled: { label: "Enabled", dot: "bg-primary" },
        paused: { label: "Paused", dot: "bg-warning" },
        disabled: { label: "Disabled", dot: "bg-muted-foreground" },
    };

function PeriodicRow({ task }: { task: PeriodicTask }) {
    const meta = STATUS_META[task.status];
    const Icon = task.status === "paused" ? Pause : Play;
    return (
        <div className="flex items-start gap-3 px-2 py-3">
            <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{task.title}</span>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-muted-foreground text-xs">
                        {task.schedule}
                    </code>
                </div>
                <span className="text-muted-foreground text-sm">
                    Enqueues: “{task.template.goal}”
                    {task.template.role
                        ? ` → ${AGENTS[task.template.role].name}`
                        : ""}
                </span>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-muted-foreground text-xs">
                    <Badge variant="secondary">{task.space}</Badge>
                    <span>next: {task.nextRun}</span>
                    {task.lastEnqueued ? (
                        <span>· last: {task.lastEnqueued}</span>
                    ) : null}
                </div>
            </div>
            <Badge variant="outline" className="gap-1.5">
                <span className={cn("size-1.5 rounded-full", meta.dot)} />
                {meta.label}
            </Badge>
        </div>
    );
}

export function PeriodicTasksView() {
    const [tasks] = useState(seedPeriodicTasks);
    return (
        <ScrollArea className="h-full">
            <div className="mx-auto flex max-w-2xl flex-col gap-5 px-8 py-10">
                <header className="flex flex-col gap-1">
                    <h1 className="flex items-center gap-2 font-semibold text-xl tracking-tight">
                        <CalendarClock className="size-5 text-muted-foreground" />
                        Periodic Tasks
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        A cron schedule that enqueues a Task when it fires — no
                        watcher, no runs. “Watching” is a scheduled Task that
                        emits a{" "}
                        <Radar className="inline size-3.5 align-text-bottom" />{" "}
                        Signal.
                    </p>
                </header>
                <div className="flex flex-col divide-y">
                    {tasks.map((task) => (
                        <PeriodicRow key={task.id} task={task} />
                    ))}
                </div>
            </div>
        </ScrollArea>
    );
}
