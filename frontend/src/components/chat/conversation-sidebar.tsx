import {
    Check,
    ChevronRight,
    Circle,
    CircleDot,
    Download,
    FileText,
    X,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
    AGENTS,
    type Agent,
    type AgentId,
    type FileRef,
    type PlanNode,
    type StepStatus,
    type Task,
    type TaskStatus,
} from "@/lib/conversation";
import { cn } from "@/lib/utils";

const STEP_ICON = {
    done: Check,
    current: CircleDot,
    pending: Circle,
} as const;

const TASK_STATUS_META: Record<
    TaskStatus,
    { label: string; className: string }
> = {
    pending: { label: "Pending", className: "text-muted-foreground" },
    planning: { label: "Planning", className: "" },
    running: { label: "Running", className: "" },
    awaiting_approval: {
        label: "Awaiting approval",
        className: "border-warning/50 text-warning",
    },
    reviewing: { label: "Reviewing", className: "" },
    done: { label: "Done", className: "border-primary/40 text-primary" },
    failed: {
        label: "Failed",
        className: "border-destructive/40 text-destructive",
    },
    cancelled: { label: "Cancelled", className: "text-muted-foreground" },
};

const PLAN_DOT: Record<TaskStatus, string> = {
    pending: "bg-border",
    planning: "bg-muted-foreground",
    running: "bg-warning animate-pulse",
    awaiting_approval: "bg-warning",
    reviewing: "bg-chart-1",
    done: "bg-primary",
    failed: "bg-destructive",
    cancelled: "bg-muted-foreground",
};

function PlanRow({ node }: { node: PlanNode }) {
    const role = AGENTS[node.role];
    return (
        <div className="flex items-start gap-2 text-xs">
            <span
                className={cn(
                    "mt-1 size-1.5 shrink-0 rounded-full",
                    PLAN_DOT[node.status],
                )}
            />
            <span className="min-w-0 flex-1">
                <span className="text-foreground">{node.goal}</span>
                {node.dependsOn?.length ? (
                    <span className="text-muted-foreground">
                        {" "}
                        · after {node.dependsOn.join(", ")}
                    </span>
                ) : null}
            </span>
            <Badge
                variant="outline"
                className={cn("shrink-0 px-1.5 py-0", role.tint)}
            >
                {role.name}
            </Badge>
        </div>
    );
}

export interface ConversationSidebarProps {
    agents: Agent[];
    tasks: Task[];
    attachments: FileRef[];
    onRemoveAgent: (agentId: AgentId) => void;
    onDownload: (file: FileRef) => void;
}

function AgentRow({
    agent,
    onRemove,
}: {
    agent: Agent;
    onRemove: (agentId: AgentId) => void;
}) {
    return (
        <div className="group/agent flex items-center gap-2">
            <Avatar size="sm">
                <AvatarFallback className={agent.tint}>
                    {agent.initials}
                </AvatarFallback>
            </Avatar>
            <span className="font-medium text-sm">{agent.name}</span>
            <span
                className={cn(
                    "ml-auto size-2 rounded-full",
                    agent.status === "working" ? "bg-warning" : "bg-border",
                )}
            />
            <Button
                variant="ghost"
                size="icon-xs"
                aria-label={`Remove ${agent.name}`}
                className="opacity-0 group-hover/agent:opacity-100"
                onClick={() => onRemove(agent.id)}
            >
                <X />
            </Button>
        </div>
    );
}

function StepRow({ label, status }: { label: string; status: StepStatus }) {
    const Icon = STEP_ICON[status];
    return (
        <div
            className={cn(
                "flex items-center gap-2 text-sm",
                status === "pending" && "text-muted-foreground",
            )}
        >
            <Icon
                className={cn(
                    "size-3.5",
                    status === "done" && "text-primary",
                    status === "current" && "text-warning",
                )}
            />
            {label}
        </div>
    );
}

function TaskItem({ task }: { task: Task }) {
    const done = task.steps.filter((step) => step.status === "done").length;
    const total = task.steps.length;
    return (
        <Collapsible defaultOpen={done < total && done > 0}>
            <CollapsibleTrigger className="group/task flex w-full flex-col gap-1.5 text-left">
                <div className="flex items-center gap-1.5 text-sm">
                    <ChevronRight className="size-3.5 transition-transform group-data-[panel-open]/task:rotate-90" />
                    <span className="min-w-0 flex-1 truncate font-semibold text-foreground">
                        {task.title}
                    </span>
                    <span className="text-sm tabular-nums">
                        {done}/{total}
                    </span>
                </div>
                {task.status ? (
                    <div className="flex items-center gap-1.5 pl-5">
                        <Badge
                            variant="outline"
                            className={cn(
                                "px-1.5 py-0 text-xs",
                                TASK_STATUS_META[task.status].className,
                            )}
                        >
                            {TASK_STATUS_META[task.status].label}
                        </Badge>
                        {task.assignedRole ? (
                            <span className="text-muted-foreground text-xs">
                                → {AGENTS[task.assignedRole].name}
                            </span>
                        ) : null}
                    </div>
                ) : null}
                <Progress value={(done / total) * 100} className="pl-5" />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-1.5 flex flex-col gap-1 pl-5">
                {task.steps.map((step) => (
                    <StepRow
                        key={step.label}
                        label={step.label}
                        status={step.status}
                    />
                ))}
                {task.plan?.length ? (
                    <div className="mt-1.5 flex flex-col gap-1 border-l pl-2.5">
                        <span className="text-muted-foreground text-xs uppercase tracking-wide">
                            Plan
                        </span>
                        {task.plan.map((node) => (
                            <PlanRow key={node.id} node={node} />
                        ))}
                    </div>
                ) : null}
            </CollapsibleContent>
        </Collapsible>
    );
}

function CollapsibleSection({
    label,
    count,
    defaultOpen = false,
    children,
}: {
    label: string;
    count: number;
    defaultOpen?: boolean;
    children: React.ReactNode;
}) {
    return (
        <Collapsible defaultOpen={defaultOpen}>
            <CollapsibleTrigger className="group/sec flex w-full items-center gap-1.5 font-semibold text-foreground text-sm">
                <ChevronRight className="size-3.5 transition-transform group-data-[panel-open]/sec:rotate-90" />
                {label}
                <Badge variant="secondary" className="ml-auto">
                    {count}
                </Badge>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 flex flex-col gap-2">
                {children}
            </CollapsibleContent>
        </Collapsible>
    );
}

export function ConversationSidebar({
    agents,
    tasks,
    attachments,
    onRemoveAgent,
    onDownload,
}: ConversationSidebarProps) {
    return (
        <aside className="hidden w-80 shrink-0 border-l bg-sidebar text-sidebar-foreground md:block">
            <ScrollArea className="h-full">
                <div className="flex flex-col gap-5 p-5">
                    {tasks.map((task) => (
                        <TaskItem key={task.id} task={task} />
                    ))}

                    <Separator />

                    <CollapsibleSection
                        label="Shared files"
                        count={attachments.length}
                        defaultOpen
                    >
                        {attachments.map((file) => (
                            <div
                                key={file.id}
                                className="flex items-center gap-2 text-sm"
                            >
                                <FileText className="size-4 shrink-0 text-primary" />
                                <span className="min-w-0 flex-1 truncate font-medium">
                                    {file.name}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="icon-xs"
                                    aria-label={`Download ${file.name}`}
                                    onClick={() => onDownload(file)}
                                >
                                    <Download />
                                </Button>
                            </div>
                        ))}
                    </CollapsibleSection>

                    <Separator />

                    <CollapsibleSection label="Agents" count={agents.length}>
                        {agents.map((agent) => (
                            <AgentRow
                                key={agent.id}
                                agent={agent}
                                onRemove={onRemoveAgent}
                            />
                        ))}
                    </CollapsibleSection>
                </div>
            </ScrollArea>
        </aside>
    );
}
