// A Narrative (nar_) is the System's continuously-maintained, evidence-backed
// synthesis of a Space or Storyline (narrative.md). It carries the same fixed
// sections (REQ-NAR-03), each answering one question — it explains, never tallies.

export interface NarrativeSections {
    state: string; // Where do things stand?
    direction: string; // Where is it moving?
    momentum: string; // What is accelerating / stuck?
    friction: string; // What is slowing progress?
    openQuestions: string; // What is undecided?
    nextStep: string; // What happens next?
}

export const NARRATIVE_FIELDS: {
    key: keyof NarrativeSections;
    label: string;
}[] = [
    { key: "state", label: "Current state" },
    { key: "direction", label: "Direction" },
    { key: "momentum", label: "Momentum" },
    { key: "friction", label: "Friction" },
    { key: "openQuestions", label: "Open questions" },
    { key: "nextStep", label: "Next step" },
];
