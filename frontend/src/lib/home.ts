import type { Momentum, SituationMessage } from "@/lib/conversation";
import type { NarrativeSections } from "@/lib/narrative";
import type { StorylineStatus } from "@/lib/storyline";

// Home opens with the Space Narrative, then Attention-Needed (Situations ranked
// by attention), then Active Storylines (home-and-briefings.md; REQ-NAR-09,
// REQ-SIT-12, REQ-STORY-10).

export interface HomeStoryline {
    id: string;
    title: string;
    momentum: Momentum;
    status: StorylineStatus;
    line: string; // one-line current state from the Storyline's Narrative
}

export interface HomeData {
    space: string;
    narrative: NarrativeSections;
    attention: SituationMessage[];
    storylines: HomeStoryline[];
}

export function seedHome(): HomeData {
    const attention: SituationMessage[] = [
        {
            id: "home-sit-stripe",
            time: "08:54",
            kind: "situation",
            title: "Stripe automation blocked",
            detail: "Login expired 3h ago; the billing run can't proceed.",
            attention: 82,
            category: "blocker",
            storyline: "Q2 billing migration",
            actions: ["Re-authenticate", "Snooze 1d", "Dismiss"],
        },
        {
            id: "home-sit-rfc",
            time: "09:10",
            kind: "situation",
            title: "Routing decision blocked — no RFC",
            detail: "The Framework routing decision has reopened 4× with no RFC owner.",
            attention: 78,
            category: "decision",
            storyline: "Framework UI direction",
            actions: ["Open RFC", "Assign owner", "Snooze"],
        },
        {
            id: "home-sit-injection",
            time: "09:01",
            kind: "situation",
            title: "Prompt-injection attempt logged",
            detail: "An email tried to instruct the assistant to approve the Northwind contract. Treated as data (P12), recorded as a statement — no action taken.",
            attention: 34,
            category: "security",
            storyline: "Q2 billing migration",
            actions: ["Review email", "Mark reviewed", "Dismiss"],
        },
    ];

    return {
        space: "Business/Framework",
        narrative: {
            state: "Framework UI is looping while Q2 billing advances — one blocker and one flagged email need you.",
            direction:
                "Shifting from automation-first toward settling the component model and closing the billing migration.",
            momentum:
                "Billing is advancing (2 of 5 milestones); the Framework routing decision keeps looping.",
            friction:
                "An expired Stripe login blocks billing; the routing RFC has no owner.",
            openQuestions:
                "Who owns the routing RFC, and will billing close before the Q2 deadline?",
            nextStep:
                "Re-authenticate Stripe, then open the routing RFC and assign an owner.",
        },
        attention: attention.sort((a, b) => b.attention - a.attention),
        storylines: [
            {
                id: "story-framework",
                title: "Framework UI direction",
                momentum: "looping",
                status: "blocked",
                line: "Converging on the component model; routing still unresolved after 4 revisits.",
            },
            {
                id: "story-billing",
                title: "Q2 billing migration",
                momentum: "advancing",
                status: "active",
                line: "Two of five milestones shipped; Stripe automation is the bottleneck.",
            },
            {
                id: "story-belov",
                title: "Belov consensus research",
                momentum: "steady",
                status: "active",
                line: "Three sources gathered; two corroborate, one dissents. Synthesis in progress.",
            },
        ],
    };
}
