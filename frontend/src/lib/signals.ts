// A Signal (sig_) is a meaningful change entering the System from a source —
// the raw input unit of the knowledge pipeline (Signal → Evidence → …).
// The Inbox surfaces received Signals as they move through ingestion.

export type SignalState = "pending" | "processing" | "done";

export type SignalSource =
    | "message"
    | "file"
    | "web"
    | "browser"
    | "watcher"
    | "connector"
    | "api";

export interface Signal {
    id: string;
    source: SignalSource;
    title: string;
    detail?: string;
    space: string;
    time: string;
    state: SignalState;
}

export function seedSignals(): Signal[] {
    return [
        {
            id: "sig_northwind",
            source: "watcher",
            title: "Northwind release-notes page changed overnight",
            detail: "Pro tier pricing section edited; diff queued for normalization.",
            space: "Framework",
            time: "2m",
            state: "pending",
        },
        {
            id: "sig_ci",
            source: "api",
            title: "CI build failed on main",
            detail: "Posted via the ingestion API by the build pipeline.",
            space: "Framework",
            time: "5m",
            state: "pending",
        },
        {
            id: "sig_belov",
            source: "connector",
            title: "Email from Dr. Belov arrived",
            detail: "Gmail connector — subject: “Consensus review follow-up”.",
            space: "Research",
            time: "12m",
            state: "pending",
        },
        {
            id: "sig_pricing",
            source: "web",
            title: "Pricing page diff → Evidence",
            detail: "Normalizing the competitor pricing change into attributable facts.",
            space: "Framework",
            time: "1m",
            state: "processing",
        },
        {
            id: "sig_browser",
            source: "browser",
            title: "Stripe dashboard session captured",
            detail: "Browser activity flagged a failed billing run for review.",
            space: "Business",
            time: "8m",
            state: "processing",
        },
        {
            id: "sig_slack",
            source: "message",
            title: "Slack thread normalized",
            detail: "Folded into the Q2 billing migration storyline.",
            space: "Business",
            time: "1h",
            state: "done",
        },
        {
            id: "sig_notes",
            source: "file",
            title: "notes.md change distilled",
            detail: "File watcher picked up edits under ~/research/belov.",
            space: "Research",
            time: "2h",
            state: "done",
        },
    ];
}
