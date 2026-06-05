import type {
    Evidence,
    InsightMessage,
    MemoryMessage,
    Momentum,
    SituationMessage,
    StorylineMessage,
} from "@/lib/conversation";
import type { NarrativeSections } from "@/lib/narrative";

export type StorylineStatus = "active" | "blocked" | "resolved" | "dormant";

// Past pipeline artifacts that make up a Storyline's history. A Situation only
// belongs here once resolved — an *open* Situation is "now", not history, and
// lives in `situations` instead.
export type StorylineHistoryEvent =
    | InsightMessage
    | MemoryMessage
    | StorylineMessage
    | SituationMessage;

// A Storyline exposes its aggregated parts (storylines.md REQ-STORY-09): its
// Narrative summary, open Situations, Evidence, Insights, and Entities.
export interface StorylineDossier {
    id: string;
    title: string;
    momentum: Momentum;
    status: StorylineStatus;
    narrative: NarrativeSections;
    entities: string[];
    situations: SituationMessage[];
    evidence: Evidence[];
    insights: InsightMessage[];
    history: StorylineHistoryEvent[];
}

interface StorylineMeta {
    title: string;
    momentum: Momentum;
    status: StorylineStatus;
    narrative: NarrativeSections;
    entities: string[];
    evidence: Evidence[];
    insights: InsightMessage[];
}

const STORYLINES: Record<string, StorylineMeta> = {
    "story-framework": {
        title: "Framework UI direction",
        momentum: "looping",
        status: "blocked",
        narrative: {
            state: "Converging on the component model; the routing decision is still unresolved.",
            direction:
                "Shifting from ad-hoc mocks toward a settled component model and a routing RFC.",
            momentum:
                "Design is accelerating, but the routing decision keeps reopening — net looping.",
            friction:
                "No RFC owner; the same ordering-guarantee question is reargued each cycle.",
            openQuestions:
                "Which routing model wins, and who signs off on the RFC?",
            nextStep: "Open the routing RFC and assign a decision owner.",
        },
        entities: ["framework", "Talia Brandt"],
        evidence: [
            { id: "ev-fw-1", type: "doc", label: "RFC draft v3 (unmerged)" },
            { id: "ev-fw-2", type: "web", label: "Component model mock v3" },
        ],
        insights: [
            {
                id: "ins-fw-1",
                time: "Jun 2",
                kind: "insight",
                category: "repetition",
                body: "The routing decision has been revisited 4× without an RFC.",
            },
        ],
    },
    "story-billing": {
        title: "Q2 billing migration",
        momentum: "advancing",
        status: "active",
        narrative: {
            state: "Two of five milestones shipped; the Stripe automation step is the bottleneck.",
            direction:
                "Moving toward a fully automated Q2 billing run with human approval gates.",
            momentum:
                "Steady progress until the Stripe login expired and parked the run.",
            friction:
                "An expired Stripe session blocks the automation; awaiting re-authentication.",
            openQuestions:
                "Will the migration finish before the Q2 close deadline?",
            nextStep: "Re-authenticate Stripe and resume the billing run.",
        },
        entities: ["Stripe", "Devin"],
        evidence: [
            { id: "ev-bill-1", type: "web", label: "Stripe dashboard session" },
            {
                id: "ev-bill-2",
                type: "mail",
                label: "Q2 close deadline notice",
            },
        ],
        insights: [
            {
                id: "ins-bill-1",
                time: "Jun 3",
                kind: "insight",
                category: "risk",
                body: "The Q2 close deadline is at risk while the billing run is parked.",
            },
        ],
    },
    "story-belov": {
        title: "Belov consensus research",
        momentum: "steady",
        status: "active",
        narrative: {
            state: "Three sources gathered; two corroborate the consensus claim, one dissents.",
            direction:
                "Moving toward a defensible synthesis of the consensus question.",
            momentum:
                "Reading and corroboration are steady; synthesis is in progress.",
            friction: "The single dissenting source needs to be reconciled.",
            openQuestions:
                "Does the dissent undermine the consensus, or is it an outlier?",
            nextStep: "Draft the consensus summary and flag the dissent.",
        },
        entities: ["Dr. Belov"],
        evidence: [
            { id: "ev-belov-1", type: "doc", label: "Paper A — corroborates" },
            { id: "ev-belov-2", type: "doc", label: "Paper B — corroborates" },
            { id: "ev-belov-3", type: "doc", label: "Paper C — dissents" },
        ],
        insights: [
            {
                id: "ins-belov-1",
                time: "May 28",
                kind: "insight",
                category: "synthesis",
                body: "Two of three sources agree; the dissent is methodological.",
            },
        ],
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
            time: "May 30",
            kind: "situation",
            title: "Source access expired",
            detail: "A connector login lapsed mid-run.",
            attention: 40,
            category: "blocker",
            storyline: meta.title,
            actions: [],
            resolved: "Re-authenticated",
        },
        {
            id: `${id}-h4`,
            time: "Jun 1",
            kind: "storyline",
            title: meta.title,
            momentum: meta.momentum,
            detail: "Momentum shifted as the thread reopened without a decision.",
        },
    ];

    const situations: SituationMessage[] =
        meta.status === "blocked"
            ? [
                  {
                      id: `${id}-now`,
                      time: "Jun 3",
                      kind: "situation",
                      title: "Decision blocked — no RFC",
                      detail: "The routing decision can't progress until an RFC is opened.",
                      attention: 78,
                      category: "decision",
                      storyline: meta.title,
                      actions: ["Open RFC", "Snooze 1d", "Dismiss"],
                  },
              ]
            : [];

    return {
        id,
        title: meta.title,
        momentum: meta.momentum,
        status: meta.status,
        narrative: meta.narrative,
        entities: meta.entities,
        situations,
        evidence: meta.evidence,
        insights: meta.insights,
        history,
    };
}
