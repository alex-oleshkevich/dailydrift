// Built-in roster, split on mode (primary vs subagent) and read-only-vs-acting.
// A `Browser` agent is a user-defined Ops specialization, not a built-in (agents.md REQ-AGENT-09).
export type AgentId = "executive" | "research" | "ops" | "reviewer";

export interface Agent {
    id: AgentId;
    name: string;
    role: string;
    initials: string;
    tint: string;
    status: "working" | "idle";
}

export const AGENTS: Record<AgentId, Agent> = {
    executive: {
        id: "executive",
        name: "Executive",
        role: "coordinating",
        initials: "Ex",
        tint: "bg-chart-4/20 text-chart-4",
        status: "idle",
    },
    research: {
        id: "research",
        name: "Research",
        role: "investigating (read-only)",
        initials: "Re",
        tint: "bg-chart-2/20 text-chart-2",
        status: "working",
    },
    ops: {
        id: "ops",
        name: "Ops",
        role: "acting (exec, files, outbound)",
        initials: "Op",
        tint: "bg-chart-5/20 text-chart-5",
        status: "idle",
    },
    reviewer: {
        id: "reviewer",
        name: "Reviewer",
        role: "checking (fresh eyes)",
        initials: "Rv",
        tint: "bg-chart-1/20 text-chart-1",
        status: "idle",
    },
};

export const AGENT_LIST = Object.values(AGENTS);

// The Curator is a background state-maintenance ENGINE, not an agent (curator.md).
// Memory consolidation, Storyline/Situation upkeep, and recall-injection run here.
export const CURATOR = {
    id: "curator",
    name: "Curator",
    role: "background maintenance engine",
    initials: "Cu",
    tint: "bg-chart-3/20 text-chart-3",
} as const;

export type Decision = "allow-once" | "allow-run" | "allow-always" | "deny";

export type SourceType = "mail" | "doc" | "web" | "file";

export interface Evidence {
    id: string;
    type: SourceType;
    label: string;
}

export interface FileRef {
    id: string;
    name: string;
    size: string;
}

export interface FileNode {
    name: string;
    children?: FileNode[];
}

export interface FileTreeRoot {
    id: string;
    label: string;
    nodes: FileNode[];
}

export type InsightCategory =
    | "contradiction"
    | "opportunity"
    | "risk"
    | "stale"
    | "dependency"
    | "anomaly"
    | "repetition"
    | "synthesis";

export type Momentum = "advancing" | "steady" | "stalled" | "looping";

export interface Storyline {
    id: string;
    title: string;
    momentum: Momentum;
    detail: string;
}

export type StepStatus = "done" | "current" | "pending";

export interface TaskStep {
    label: string;
    status: StepStatus;
}

// tasks.md lifecycle (REQ-TASK): a Task is a goal, planned → routed → executed →
// reviewed, with a dedicated `awaiting_approval` pause for mid-task user permission.
export type TaskStatus =
    | "pending"
    | "planning"
    | "running"
    | "awaiting_approval"
    | "reviewing"
    | "done"
    | "failed"
    | "cancelled";

// A leaf of the orchestrator's plan tree (agent-orchestration.md): a subtask routed
// to one agent role, with its own status and sibling dependencies.
export interface PlanNode {
    id: string;
    goal: string;
    role: AgentId;
    status: TaskStatus;
    dependsOn?: string[];
}

export interface Task {
    id: string;
    title: string;
    agentId: AgentId;
    status?: TaskStatus;
    assignedRole?: AgentId;
    steps: TaskStep[];
    plan?: PlanNode[];
}

interface BaseMessage {
    id: string;
    time: string;
}

export interface UserMessage extends BaseMessage {
    kind: "user";
    body: string;
    attachments?: FileRef[];
}

export interface AgentMessage extends BaseMessage {
    kind: "agent";
    agentId: AgentId;
    body: string;
    streaming?: boolean;
    thinking?: string[];
    evidence?: Evidence[];
    attachments?: FileRef[];
}

export interface PermissionMessage extends BaseMessage {
    kind: "permission";
    agentId: AgentId;
    action: string;
    detail: string;
    decision?: Decision;
}

export interface InsightMessage extends BaseMessage {
    kind: "insight";
    category: InsightCategory;
    body: string;
    evidence?: Evidence[];
}

// situations.md category catalog (REQ-SIT-02), plus `security` for detected
// prompt-injection attempts (prompt-injection.md REQ-PINJ-14, OQ-PINJ-3).
export type SituationCategory =
    | "blocker"
    | "decision"
    | "deadline"
    | "approval"
    | "contradiction"
    | "security";

export interface SituationMessage extends BaseMessage {
    kind: "situation";
    title: string;
    detail: string;
    attention: number;
    category?: SituationCategory;
    storyline?: string;
    actions: string[];
    resolved?: string;
}

export interface StorylineMessage extends BaseMessage {
    kind: "storyline";
    title: string;
    momentum: Momentum;
    detail: string;
}

export interface StorylineStartedMessage extends BaseMessage {
    kind: "storyline-started";
    agentId: AgentId;
    title: string;
    detail: string;
}

export interface TaskCreatedMessage extends BaseMessage {
    kind: "task-created";
    agentId: AgentId;
    taskId: string;
    title: string;
}

export interface MemoryMessage extends BaseMessage {
    kind: "memory";
    content: string;
}

export interface QuestionnaireMessage extends BaseMessage {
    kind: "questionnaire";
    agentId: AgentId;
    question: string;
    options: string[];
    answer?: string;
}

export interface EventMessage extends BaseMessage {
    kind: "event";
    label: string;
}

export interface ErrorMessage extends BaseMessage {
    kind: "error";
    body: string;
}

export type SubagentStatus = "running" | "done" | "failed";

export interface SubagentCallMessage extends BaseMessage {
    kind: "subagent-call";
    agentId: AgentId;
    subagentId: AgentId;
    task: string;
    status: SubagentStatus;
    steps?: string[];
    result?: string;
}

export type Message =
    | UserMessage
    | AgentMessage
    | PermissionMessage
    | InsightMessage
    | SituationMessage
    | StorylineMessage
    | StorylineStartedMessage
    | TaskCreatedMessage
    | MemoryMessage
    | QuestionnaireMessage
    | EventMessage
    | ErrorMessage
    | SubagentCallMessage;

export interface ConversationData {
    messages: Message[];
    agents: Agent[];
    storylines: Storyline[];
    tasks: Task[];
    trees: FileTreeRoot[];
}

// Mounted folders (workspace-level), surfaced in the conversation sidebar.
export const MOUNTED_TREES: FileTreeRoot[] = [
    {
        id: "tree-framework",
        label: "~/work/framework",
        nodes: [
            {
                name: "src",
                children: [{ name: "app.go" }, { name: "main.go" }],
            },
            {
                name: "frontend",
                children: [
                    { name: "package.json" },
                    {
                        name: "src",
                        children: [{ name: "App.tsx" }, { name: "main.tsx" }],
                    },
                ],
            },
            { name: "README.md" },
        ],
    },
    {
        id: "tree-research",
        label: "~/research/belov",
        nodes: [
            { name: "notes.md" },
            {
                name: "sources",
                children: [{ name: "paper-1.pdf" }, { name: "paper-2.pdf" }],
            },
        ],
    },
];

const USER_LINES = [
    "Can you draft the summary?",
    "What's the latest on the billing migration?",
    "Pull the Q2 churn numbers for me.",
    "Schedule a sync with Dr. Belov this week.",
    "Summarize the Framework UI direction thread.",
];

const AGENT_LINES = [
    "Found 3 sources on the Belov consensus question and folded them in.",
    "Here's where the billing migration stands as of this morning.",
    "Q2 churn rose 3 points quarter over quarter — details below.",
    "I've drafted the summary; review it and I'll refine.",
    "Cross-referenced the calendar — two conflicts next Tuesday.",
];

const THINKING = [
    "Checked the calendar for the week",
    "Cross-referenced the Belov thread",
    "Pulled 3 candidate sources",
    "Compared against last quarter's figures",
];

const SUBAGENT_STATUSES: SubagentStatus[] = ["done", "running", "failed"];

const SUBAGENT_TASKS = [
    "Fetch and summarize the competitor's release notes",
    "Distill the new sources into Evidence",
    "Reconcile the calendar conflicts for next week",
    "Draft the RFC skeleton from the storyline",
    "Normalize the inbound Slack thread into a Signal",
];

const EVIDENCE: Evidence[] = [
    { id: "ev-mail", type: "mail", label: 'gmail: "Churn review"' },
    { id: "ev-doc", type: "doc", label: "drive: Q2-metrics.xlsx" },
    { id: "ev-web", type: "web", label: "web: competitor pricing" },
    { id: "ev-file", type: "file", label: "report-draft.pdf" },
];

const FILES: FileRef[] = [
    { id: "f-metrics", name: "Q2-metrics.xlsx", size: "42 KB" },
    { id: "f-notes", name: "belov-notes.md", size: "8 KB" },
    { id: "f-report", name: "summary-draft.pdf", size: "120 KB" },
];

const INSIGHTS: { category: InsightCategory; body: string }[] = [
    {
        category: "repetition",
        body: "You've revisited the Framework routing decision 4× without an RFC.",
    },
    {
        category: "risk",
        body: "The billing migration depends on a credential that expires in 3 days.",
    },
    {
        category: "opportunity",
        body: "Three open threads could be closed by a single decision on hosting.",
    },
    {
        category: "stale",
        body: "The hiring storyline hasn't moved in 6 days — waiting on Dr. Belov.",
    },
];

const STORYLINE_UPDATES: {
    title: string;
    momentum: Momentum;
    detail: string;
}[] = [
    {
        title: "Q2 billing migration",
        momentum: "advancing",
        detail: "2 of 5 milestones done.",
    },
    {
        title: "Framework UI direction",
        momentum: "looping",
        detail: "Revisited 4× this month, still no RFC.",
    },
    {
        title: "Hiring: senior infra",
        momentum: "stalled",
        detail: "Stalled 6 days, waiting on Dr. Belov.",
    },
];

const MEMORIES = [
    "You prefer summaries under 5 bullet points.",
    "Dr. Belov's consensus question is this week's priority.",
    "Framework Space: routing decision is still unresolved.",
    "Talia prefers updates by email, not Slack.",
];

const QUESTIONS: { question: string; options: string[] }[] = [
    {
        question: "How should I prioritise the Belov sources?",
        options: ["By recency", "By relevance", "By author authority"],
    },
    {
        question: "Which channel should I use to reach Talia?",
        options: ["Email", "Slack", "Schedule a call"],
    },
];

const PERMISSIONS: { action: string; detail: string }[] = [
    { action: "Submit a form", detail: "on stripe.com/login" },
    { action: "Send an email", detail: "to dr.belov@institute.org" },
    { action: "Write a file", detail: "to ~/reports/q2-summary.pdf" },
];

function timeAt(index: number): string {
    const minutes = 8 * 60 + index;
    const hh = Math.floor(minutes / 60) % 24;
    const mm = minutes % 60;
    return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

const STORYLINES: Storyline[] = [
    {
        id: "story-framework",
        title: "Framework UI direction",
        momentum: "looping",
        detail: "Revisited 4× this month without an RFC.",
    },
    {
        id: "story-billing",
        title: "Q2 billing migration",
        momentum: "advancing",
        detail: "2 of 5 milestones complete.",
    },
];

export function seedTasks(): Task[] {
    return [
        {
            id: "task-sources",
            title: "Compile Belov sources",
            agentId: "executive",
            status: "running",
            assignedRole: "research",
            steps: [
                { label: "Plan", status: "done" },
                { label: "Dispatch research leaves", status: "current" },
                { label: "Synthesize", status: "pending" },
                { label: "Review (fresh eyes)", status: "pending" },
            ],
            plan: [
                {
                    id: "t1",
                    goal: "Search archives for Belov papers",
                    role: "research",
                    status: "done",
                },
                {
                    id: "t2",
                    goal: "Read the three candidate papers",
                    role: "research",
                    status: "running",
                    dependsOn: ["t1"],
                },
                {
                    id: "t3",
                    goal: "Draft a consensus summary",
                    role: "research",
                    status: "pending",
                    dependsOn: ["t2"],
                },
                {
                    id: "t4",
                    goal: "Review the summary",
                    role: "reviewer",
                    status: "pending",
                    dependsOn: ["t3"],
                },
            ],
        },
        {
            id: "task-billing",
            title: "Run the Q2 billing migration",
            agentId: "executive",
            status: "awaiting_approval",
            assignedRole: "ops",
            steps: [
                { label: "Plan", status: "done" },
                { label: "Re-authenticate Stripe", status: "current" },
                { label: "Execute billing run", status: "pending" },
            ],
            plan: [
                {
                    id: "b1",
                    goal: "Re-authenticate the Stripe session",
                    role: "ops",
                    status: "awaiting_approval",
                },
                {
                    id: "b2",
                    goal: "Run the billing migration",
                    role: "ops",
                    status: "pending",
                    dependsOn: ["b1"],
                },
            ],
        },
        {
            id: "task-email",
            title: "Draft Belov email",
            agentId: "executive",
            status: "planning",
            steps: [
                { label: "Gather context", status: "pending" },
                { label: "Write draft", status: "pending" },
            ],
        },
    ];
}

// Deterministic mock thread (no Math.random / Date.now).
function bulkConversation(count: number): ConversationData {
    const messages: Message[] = [];

    for (let i = 0; i < count; i++) {
        const time = timeAt(i);
        const id = `seed-${i}`;

        if (i > 0 && i % 53 === 0) {
            const agent = AGENT_LIST[i % AGENT_LIST.length];
            messages.push({
                id,
                time,
                kind: "event",
                label: `${agent.name} joined`,
            });
            continue;
        }
        if (i % 13 === 5) {
            const insight = INSIGHTS[i % INSIGHTS.length];
            messages.push({
                id,
                time,
                kind: "insight",
                category: insight.category,
                body: insight.body,
                evidence: EVIDENCE.slice(0, (i % 3) + 1),
            });
            continue;
        }
        if (i % 17 === 9) {
            const update = STORYLINE_UPDATES[i % STORYLINE_UPDATES.length];
            messages.push({ id, time, kind: "storyline", ...update });
            continue;
        }
        if (i % 23 === 7) {
            const perm = PERMISSIONS[i % PERMISSIONS.length];
            messages.push({
                id,
                time,
                kind: "permission",
                agentId: "ops",
                action: perm.action,
                detail: perm.detail,
                decision: i % 2 === 0 ? "allow-once" : "deny",
            });
            continue;
        }
        if (i % 37 === 11) {
            messages.push({
                id,
                time,
                kind: "task-created",
                agentId: "research",
                taskId: "task-sources",
                title: "Compile Belov sources",
            });
            continue;
        }
        if (i % 41 === 19) {
            messages.push({
                id,
                time,
                kind: "error",
                body: "Couldn't reach the Ops Agent — request timed out.",
            });
            continue;
        }
        if (i % 19 === 4) {
            messages.push({
                id,
                time,
                kind: "memory",
                content: MEMORIES[i % MEMORIES.length],
            });
            continue;
        }
        if (i % 47 === 5) {
            const question = QUESTIONS[i % QUESTIONS.length];
            messages.push({
                id,
                time,
                kind: "questionnaire",
                agentId: "research",
                question: question.question,
                options: question.options,
                answer: question.options[0],
            });
            continue;
        }
        if (i % 59 === 12) {
            messages.push({
                id,
                time,
                kind: "storyline-started",
                agentId: "executive",
                title: "Onboarding revamp",
                detail: "Detected a recurring thread across recent messages; now tracking it.",
            });
            continue;
        }
        if (i % 43 === 13) {
            const caller = AGENT_LIST[i % AGENT_LIST.length];
            const callee = AGENT_LIST[(i + 2) % AGENT_LIST.length];
            const status = SUBAGENT_STATUSES[i % SUBAGENT_STATUSES.length];
            messages.push({
                id,
                time,
                kind: "subagent-call",
                agentId: caller.id,
                subagentId: callee.id,
                task: SUBAGENT_TASKS[i % SUBAGENT_TASKS.length],
                status,
                steps:
                    status === "done"
                        ? THINKING.slice(0, (i % 3) + 1)
                        : undefined,
                result:
                    status === "done"
                        ? "Completed and folded the result back into the thread."
                        : undefined,
            });
            continue;
        }
        if (i % 2 === 0) {
            messages.push({
                id,
                time,
                kind: "user",
                body: USER_LINES[i % USER_LINES.length],
                attachments:
                    i % 19 === 0 ? [FILES[i % FILES.length]] : undefined,
            });
            continue;
        }
        const agent = AGENT_LIST[i % AGENT_LIST.length];
        messages.push({
            id,
            time,
            kind: "agent",
            agentId: agent.id,
            body: AGENT_LINES[i % AGENT_LINES.length],
            thinking: i % 7 === 1 ? THINKING.slice(0, (i % 3) + 1) : undefined,
            evidence: i % 5 === 3 ? EVIDENCE.slice(0, (i % 3) + 1) : undefined,
            attachments: i % 31 === 3 ? [FILES[i % FILES.length]] : undefined,
        });
    }

    // Recent, still-actionable tail so the "Needs you" sidebar populates.
    const base = count;
    messages.push(
        {
            id: "seed-situation",
            time: timeAt(base),
            kind: "situation",
            title: "Stripe automation blocked",
            detail: "Login expired 3h ago; the billing run can't proceed.",
            attention: 82,
            storyline: "Q2 billing migration",
            actions: ["Re-authenticate", "Snooze 1d", "Dismiss"],
        },
        {
            id: "seed-permission",
            time: timeAt(base + 1),
            kind: "permission",
            agentId: "ops",
            action: "Submit the login form",
            detail: "on stripe.com/login",
        },
        {
            id: "seed-final",
            time: timeAt(base + 2),
            kind: "agent",
            agentId: "executive",
            body: "I've parked the Stripe step for your approval. What would you like to do?",
        },
    );

    return {
        messages,
        agents: AGENT_LIST,
        storylines: STORYLINES,
        tasks: seedTasks(),
        trees: MOUNTED_TREES,
    };
}

// Chat 2 is a showcase: exactly one message of every type, no duplicates.
function showcaseConversation(): ConversationData {
    const messages: Message[] = [
        {
            id: "sc-event",
            time: timeAt(0),
            kind: "event",
            label: "Conversation started",
        },
        {
            id: "sc-user",
            time: timeAt(1),
            kind: "user",
            body: "Can you pull together the Belov consensus sources?",
            attachments: [FILES[1]],
        },
        {
            id: "sc-agent",
            time: timeAt(2),
            kind: "agent",
            agentId: "research",
            body: "On it — here's a first pass with the strongest sources cited.",
            thinking: THINKING.slice(0, 3),
            evidence: EVIDENCE.slice(0, 3),
            attachments: [FILES[2]],
        },
        {
            id: "sc-questionnaire",
            time: timeAt(3),
            kind: "questionnaire",
            agentId: "research",
            question: QUESTIONS[0].question,
            options: QUESTIONS[0].options,
        },
        {
            id: "sc-insight",
            time: timeAt(4),
            kind: "insight",
            category: "repetition",
            body: INSIGHTS[0].body,
            evidence: EVIDENCE.slice(0, 2),
        },
        {
            id: "sc-storyline-started",
            time: timeAt(5),
            kind: "storyline-started",
            agentId: "executive",
            title: "Belov consensus research",
            detail: "Detected a new recurring thread; now tracking it.",
        },
        {
            id: "sc-storyline",
            time: timeAt(6),
            kind: "storyline",
            title: STORYLINE_UPDATES[0].title,
            momentum: STORYLINE_UPDATES[0].momentum,
            detail: STORYLINE_UPDATES[0].detail,
        },
        {
            id: "sc-task-created",
            time: timeAt(7),
            kind: "task-created",
            agentId: "research",
            taskId: "task-sources",
            title: "Compile Belov sources",
        },
        {
            id: "sc-memory",
            time: timeAt(8),
            kind: "memory",
            content: MEMORIES[1],
        },
        {
            id: "sc-error",
            time: timeAt(9),
            kind: "error",
            body: "Couldn't reach the Ops Agent — request timed out.",
        },
        {
            id: "sc-situation",
            time: timeAt(10),
            kind: "situation",
            title: "Stripe automation blocked",
            detail: "Login expired 3h ago; the billing run can't proceed.",
            attention: 82,
            storyline: "Q2 billing migration",
            actions: ["Re-authenticate", "Snooze 1d", "Dismiss"],
        },
        {
            id: "sc-permission",
            time: timeAt(11),
            kind: "permission",
            agentId: "ops",
            action: "Submit the login form",
            detail: "on stripe.com/login",
        },
        {
            id: "sc-subagent-done",
            time: timeAt(12),
            kind: "subagent-call",
            agentId: "research",
            subagentId: "ops",
            task: "Fetch and summarize the three candidate Belov papers",
            status: "done",
            steps: THINKING.slice(0, 3),
            result: "Pulled all three sources; two corroborate the consensus claim, one dissents.",
        },
        {
            id: "sc-subagent-running",
            time: timeAt(13),
            kind: "subagent-call",
            agentId: "executive",
            subagentId: "research",
            task: "Distill the new sources into Evidence and attach to the storyline",
            status: "running",
        },
    ];

    return {
        messages,
        agents: AGENT_LIST,
        storylines: STORYLINES,
        tasks: seedTasks(),
        trees: MOUNTED_TREES,
    };
}

export function seedConversation(conversationId?: string): ConversationData {
    if (conversationId === "chat-2") {
        return showcaseConversation();
    }
    return bulkConversation(2000);
}

const REPLY_CHUNKS = [
    "Looking into that now. ",
    "I checked the relevant threads ",
    "and cross-referenced the latest evidence. ",
    "Here's a first pass — ",
    "let me know if you'd like me to dig deeper.",
];

export function replyChunks(): string[] {
    return REPLY_CHUNKS;
}
