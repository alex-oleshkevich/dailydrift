// A Periodic Task (ptask_) is a cron schedule that ENQUEUES a Task when it fires —
// no watcher primitive, no runs (periodic-tasks.md). "Watching" is just a scheduled
// Task that polls a source and emits a Signal on a meaningful change.

import type { AgentId } from "@/lib/conversation";

export type PeriodicTaskStatus = "enabled" | "paused" | "disabled";

export interface PeriodicTask {
    id: string;
    title: string;
    space: string;
    schedule: string; // cron expression, interpreted in UTC
    template: { goal: string; role?: AgentId };
    status: PeriodicTaskStatus;
    lastEnqueued?: string;
    nextRun: string;
}

export function seedPeriodicTasks(): PeriodicTask[] {
    return [
        {
            id: "ptask_distill",
            title: "Nightly Memory distillation",
            space: "Business",
            schedule: "0 3 * * *",
            template: {
                goal: "Distill today's accepted Evidence into durable Memory",
            },
            status: "enabled",
            lastEnqueued: "today 03:00",
            nextRun: "tomorrow 03:00",
        },
        {
            id: "ptask_northwind",
            title: "Watch Northwind pricing",
            space: "Framework",
            schedule: "*/30 * * * *",
            template: {
                goal: "Poll the Northwind pricing page; emit a Signal on a meaningful change",
                role: "ops",
            },
            status: "enabled",
            lastEnqueued: "12m ago",
            nextRun: "in 18m",
        },
        {
            id: "ptask_digest",
            title: "Weekly digest",
            space: "Business",
            schedule: "0 8 * * 1",
            template: {
                goal: "Compile the weekly roll-up briefing across active Storylines",
                role: "research",
            },
            status: "paused",
            nextRun: "Mon 08:00",
        },
    ];
}
