import { useState } from "react";

import { PeriodicTasksView } from "@/components/periodic-tasks/periodic-tasks-view";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    AGENTS,
    type PlanNode,
    seedTasks,
    type Task,
    type TaskStatus,
} from "@/lib/conversation";
import { cn } from "@/lib/utils";

const STATUS_META: Record<TaskStatus, { label: string; className: string }> = {
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
    return (
        <div className="flex items-start gap-2 text-xs">
            <span
                className={cn(
                    "mt-1 size-1.5 shrink-0 rounded-full",
                    PLAN_DOT[node.status],
                )}
            />
            <span className="min-w-0 flex-1">{node.goal}</span>
            <Badge
                variant="outline"
                className={cn("shrink-0 px-1.5 py-0", AGENTS[node.role].tint)}
            >
                {AGENTS[node.role].name}
            </Badge>
        </div>
    );
}

function TaskCard({ task }: { task: Task }) {
    const done = task.steps.filter((s) => s.status === "done").length;
    const status = task.status ?? "pending";
    return (
        <div className="flex flex-col gap-2 rounded-md border p-3">
            <div className="flex items-center gap-2">
                <span className="min-w-0 flex-1 truncate font-medium text-sm">
                    {task.title}
                </span>
                <Badge
                    variant="outline"
                    className={cn(
                        "px-1.5 py-0 text-xs",
                        STATUS_META[status].className,
                    )}
                >
                    {STATUS_META[status].label}
                </Badge>
            </div>
            {task.assignedRole ? (
                <span className="text-muted-foreground text-xs">
                    Assigned → {AGENTS[task.assignedRole].name}
                </span>
            ) : null}
            <Progress value={(done / task.steps.length) * 100} />
            {task.plan?.length ? (
                <div className="mt-1 flex flex-col gap-1 border-l pl-2.5">
                    {task.plan.map((node) => (
                        <PlanRow key={node.id} node={node} />
                    ))}
                </div>
            ) : null}
        </div>
    );
}

export function TasksView() {
    const [tab, setTab] = useState("active");
    const [tasks] = useState(seedTasks);
    const active = tasks.filter(
        (t) => t.status !== "done" && t.status !== "cancelled",
    );

    return (
        <Tabs
            value={tab}
            onValueChange={(value) => setTab(value as string)}
            className="flex h-full min-h-0 flex-col gap-0"
        >
            <div className="flex h-12 shrink-0 items-center border-b px-4">
                <TabsList variant="line" className="h-12">
                    <TabsTrigger value="active">Active</TabsTrigger>
                    <TabsTrigger value="periodic">Periodic</TabsTrigger>
                </TabsList>
            </div>
            <TabsContent value="active" className="min-h-0 flex-1 p-0">
                <ScrollArea className="h-full">
                    <div className="mx-auto flex max-w-2xl flex-col gap-3 px-8 py-8">
                        <p className="text-muted-foreground text-sm">
                            {active.length} active tasks across the System.
                        </p>
                        {active.map((task) => (
                            <TaskCard key={task.id} task={task} />
                        ))}
                    </div>
                </ScrollArea>
            </TabsContent>
            <TabsContent value="periodic" className="min-h-0 flex-1 p-0">
                <PeriodicTasksView />
            </TabsContent>
        </Tabs>
    );
}
