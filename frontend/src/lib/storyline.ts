import type {
    InsightMessage,
    MemoryMessage,
    Momentum,
    SituationMessage,
    StorylineMessage,
} from "@/lib/conversation";

export type StorylineStatus = "active" | "blocked" | "resolved" | "dormant";

// Past pipeline artifacts that make up a Storyline's history. A Situation only
// belongs here once resolved — an *active* Situation is "now", not history, and
// lives in `attention` instead.
export type StorylineHistoryEvent =
    | InsightMessage
    | MemoryMessage
    | StorylineMessage
    | SituationMessage;

export interface StorylineDossier {
    id: string;
    title: string;
    momentum: Momentum;
    status: StorylineStatus;
    narrative: string;
    entities: string[];
    // What needs you right now — a present-tense Situation with a clear
    // resolution. Surfaced above the history, never inside it.
    attention?: SituationMessage;
    // The narrative record: oldest → newest.
    history: StorylineHistoryEvent[];
}

interface StorylineMeta {
    title: string;
    momentum: Momentum;
    status: StorylineStatus;
    narrative: string;
    entities: string[];
}

const STORYLINES: Record<string, StorylineMeta> = {
    "story-framework": {
        title: "Framework UI direction",
        momentum: "looping",
        status: "blocked",
        narrative:
            "Converging on the component model; the routing decision is still unresolved after four revisits and no RFC.",
        entities: ["framework", "Talia Brandt"],
    },
    "story-billing": {
        title: "Q2 billing migration",
        momentum: "advancing",
        status: "active",
        narrative:
            "Two of five milestones shipped. The Stripe automation step is the current bottleneck.",
        entities: ["Stripe", "Devin"],
    },
    "story-belov": {
        title: "Belov consensus research",
        momentum: "steady",
        status: "active",
        narrative:
            "Three sources gathered on the consensus question; two corroborate, one dissents. Synthesis in progress.",
        entities: ["Dr. Belov"],
    },
};

export function seedStoryline(id: string): StorylineDossier {
    const meta = STORYLINES[id] ?? STORYLINES["story-framework"];

    const history: StorylineHistoryEvent[] = [
        {
            id: `${id}-h1`,
            time: "May 24",
            kind: "storyline",
            title: meta.title,
            momentum: "advancing",
            detail: "Thread opened; first Evidence attached from the kickoff.",
        },
        {
            id: `${id}-h2`,
            time: "May 27",
            kind: "memory",
            content: `Remembered: ${meta.entities[0]} is the primary subject of this storyline.`,
        },
        {
            id: `${id}-h3`,
            time: "May 28",
            kind: "insight",
            category: "synthesis",
            body: "Three open threads could be closed by a single decision.",
        },
        {
            id: `${id}-h4`,
            time: "May 30",
            kind: "situation",
            title: "Source access expired",
            detail: "A connector login lapsed mid-run.",
            attention: 40,
            storyline: meta.title,
            actions: [],
            resolved: "Re-authenticated",
        },
        {
            id: `${id}-h5`,
            time: "Jun 1",
            kind: "storyline",
            title: meta.title,
            momentum: meta.momentum,
            detail: "Momentum shifted as the thread reopened without a decision.",
        },
        {
            id: `${id}-h6`,
            time: "Jun 2",
            kind: "insight",
            category: "repetition",
            body: "You've revisited this decision 4× without an RFC.",
        },
    ];

    const attention: SituationMessage | undefined =
        meta.status === "blocked"
            ? {
                  id: `${id}-now`,
                  time: "Jun 3",
                  kind: "situation",
                  title: "Decision blocked — no RFC",
                  detail: "The routing decision can't progress until an RFC is opened.",
                  attention: 78,
                  storyline: meta.title,
                  actions: ["Open RFC", "Snooze 1d", "Dismiss"],
              }
            : undefined;

    return {
        id,
        title: meta.title,
        momentum: meta.momentum,
        status: meta.status,
        narrative: meta.narrative,
        entities: meta.entities,
        attention,
        history,
    };
}
