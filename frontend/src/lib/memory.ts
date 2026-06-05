// Memory (mem_) is the System's durable distilled knowledge + the shared semantic
// index (memory.md). Recall is orchestrator-injected — agents never query it
// themselves. The Curator engine consolidates, decays, and supersedes items.

export type MemoryKind = "fact" | "preference" | "profile" | "summary";

export interface MemoryItem {
    id: string;
    kind: MemoryKind;
    content: string;
    space: string;
    salience: number; // 0..1, decays with time + disuse (Ebbinghaus)
    lastUsed: string;
    pinned?: boolean;
    superseded?: boolean;
}

// The Curator's reconciliation jobs (curator.md): small, triggered, idempotent.
export type CuratorJobKind =
    | "storyline.update"
    | "situation.update"
    | "insight.evaluate"
    | "narrative.refresh"
    | "memory.compress"
    | "cleanup";

export type CuratorJobStatus = "running" | "done" | "idle";

export interface CuratorJob {
    id: string;
    kind: CuratorJobKind;
    status: CuratorJobStatus;
    detail: string;
    time: string;
}

export function seedMemory(): MemoryItem[] {
    return [
        {
            id: "mem_terse",
            kind: "preference",
            content: "Prefers terse briefings; no preamble.",
            space: "Business",
            salience: 0.95,
            lastUsed: "today",
            pinned: true,
        },
        {
            id: "mem_routing",
            kind: "summary",
            content:
                "Framework routing decision has reopened 4× without an RFC; the team keeps revisiting ordering guarantees.",
            space: "Framework",
            salience: 0.8,
            lastUsed: "2h ago",
        },
        {
            id: "mem_belov",
            kind: "fact",
            content:
                "Dr. Belov's consensus claim is corroborated by two of three candidate papers.",
            space: "Research",
            salience: 0.62,
            lastUsed: "yesterday",
        },
        {
            id: "mem_northwind_old",
            kind: "fact",
            content: "Northwind Pro tier was $40/mo.",
            space: "Framework",
            salience: 0.18,
            lastUsed: "3w ago",
            superseded: true,
        },
    ];
}

export function seedCuratorJobs(): CuratorJob[] {
    return [
        {
            id: "job_compress",
            kind: "memory.compress",
            status: "running",
            detail: "Consolidating today's Evidence into durable Memory.",
            time: "now",
        },
        {
            id: "job_storyline",
            kind: "storyline.update",
            status: "done",
            detail: "Folded the Slack thread into Q2 billing migration.",
            time: "8m",
        },
        {
            id: "job_situation",
            kind: "situation.update",
            status: "done",
            detail: "Auto-resolved a Stripe-blocked Situation once auth succeeded.",
            time: "22m",
        },
        {
            id: "job_cleanup",
            kind: "cleanup",
            status: "idle",
            detail: "Next: decay disused Memory; supersede the old Northwind price.",
            time: "scheduled",
        },
    ];
}
