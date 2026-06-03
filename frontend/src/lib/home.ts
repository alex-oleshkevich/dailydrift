import type {
    AgentId,
    InsightMessage,
    Momentum,
    SituationMessage,
} from "@/lib/conversation";

export interface ChartDatum {
    label: string;
    value: number;
}

export interface TrendInfo {
    dir: "up" | "down" | "flat";
    value: string;
}

// The curated catalog of elements Home is allowed to render. The backend emits
// a list of these per storyline; the renderer whitelists by `kind`.
export type HomeBlock =
    | { id: string; kind: "text"; body: string }
    | {
          id: string;
          kind: "stat";
          label: string;
          value: string;
          trend?: TrendInfo;
      }
    | { id: string; kind: "card"; image?: string; title: string; body: string }
    | { id: string; kind: "situation"; situation: SituationMessage }
    | { id: string; kind: "message"; agentId: AgentId; body: string }
    | { id: string; kind: "insight"; insight: InsightMessage }
    | { id: string; kind: "bar-chart"; title?: string; data: ChartDatum[] }
    | { id: string; kind: "line-chart"; title?: string; data: ChartDatum[] }
    | { id: string; kind: "pie-chart"; title?: string; data: ChartDatum[] };

export interface StorylineGroup {
    id: string;
    title: string;
    momentum: Momentum;
    blocks: HomeBlock[];
}

export interface HomeData {
    space: string;
    briefing: string;
    groups: StorylineGroup[];
}

// Most-urgent momentum first.
const MOMENTUM_ORDER: Momentum[] = [
    "looping",
    "stalled",
    "steady",
    "advancing",
];

export function seedHome(): HomeData {
    const groups: StorylineGroup[] = [
        {
            id: "group-framework",
            title: "Framework UI direction",
            momentum: "looping",
            blocks: [
                {
                    id: "b-fw-insight",
                    kind: "insight",
                    insight: {
                        id: "home-ins-routing",
                        time: "09:20",
                        kind: "insight",
                        category: "repetition",
                        body: "The routing decision has been revisited 4× without an RFC.",
                    },
                },
                {
                    id: "b-fw-text",
                    kind: "text",
                    body: "Three RFCs drafted, none merged — the decision keeps reopening.",
                },
                {
                    id: "b-fw-bar",
                    kind: "bar-chart",
                    title: "Routing revisits per week",
                    data: [
                        { label: "W1", value: 1 },
                        { label: "W2", value: 2 },
                        { label: "W3", value: 0 },
                        { label: "W4", value: 1 },
                    ],
                },
                {
                    id: "b-fw-card",
                    kind: "card",
                    title: "Latest mock — component model v3",
                    body: "Routing still unresolved; everything else is converging.",
                },
            ],
        },
        {
            id: "group-billing",
            title: "Q2 billing migration",
            momentum: "advancing",
            blocks: [
                {
                    id: "b-bill-stat",
                    kind: "stat",
                    label: "Milestones",
                    value: "2 / 5",
                    trend: { dir: "up", value: "+1 this week" },
                },
                {
                    id: "b-bill-sit",
                    kind: "situation",
                    situation: {
                        id: "home-sit-stripe",
                        time: "08:54",
                        kind: "situation",
                        title: "Stripe automation blocked",
                        detail: "Login expired 3h ago; the billing run can't proceed.",
                        attention: 82,
                        storyline: "Q2 billing migration",
                        actions: ["Re-authenticate", "Snooze 1d", "Dismiss"],
                    },
                },
                {
                    id: "b-bill-msg",
                    kind: "message",
                    agentId: "executive",
                    body: "I've parked the Stripe step for your approval.",
                },
            ],
        },
        {
            id: "group-churn",
            title: "Q2 churn analysis",
            momentum: "steady",
            blocks: [
                {
                    id: "b-churn-stat",
                    kind: "stat",
                    label: "Q2 churn",
                    value: "7.4%",
                    trend: { dir: "down", value: "+3 pts QoQ" },
                },
                {
                    id: "b-churn-pie",
                    kind: "pie-chart",
                    title: "Churn reasons",
                    data: [
                        { label: "Price", value: 42 },
                        { label: "UX", value: 30 },
                        { label: "Support", value: 18 },
                        { label: "Other", value: 10 },
                    ],
                },
                {
                    id: "b-churn-line",
                    kind: "line-chart",
                    title: "Monthly churn rate",
                    data: [
                        { label: "Jan", value: 5.0 },
                        { label: "Feb", value: 5.6 },
                        { label: "Mar", value: 6.2 },
                        { label: "Apr", value: 7.0 },
                        { label: "May", value: 7.4 },
                    ],
                },
            ],
        },
    ];

    return {
        space: "Business/Framework",
        briefing:
            "Framework UI is looping — 4 revisits, still no RFC. Q2 billing is advancing (2 of 5 milestones). One thing needs you: the Stripe login expired 3h ago.",
        groups: groups.sort(
            (a, b) =>
                MOMENTUM_ORDER.indexOf(a.momentum) -
                MOMENTUM_ORDER.indexOf(b.momentum),
        ),
    };
}
