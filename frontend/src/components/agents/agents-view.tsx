import { ArrowRight, Cog } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AGENT_LIST, CURATOR } from "@/lib/conversation";

const LOOP = ["plan", "route", "dispatch", "synthesize", "review", "replan"];

export function AgentsView() {
    return (
        <ScrollArea className="h-full">
            <div className="mx-auto flex max-w-2xl flex-col gap-6 px-8 py-10">
                <header className="flex flex-col gap-1">
                    <h1 className="font-semibold text-xl tracking-tight">
                        Agents
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        Built-in roster, split on mode (primary vs subagent) and
                        read-only-vs-acting. A Browser agent is a user-defined
                        Ops specialization, not a built-in. Agents are
                        memory-stateless and depth-1.
                    </p>
                </header>

                <div className="flex flex-col gap-3">
                    {AGENT_LIST.map((agent) => (
                        <div
                            key={agent.id}
                            className="flex items-center gap-3 rounded-md border px-3 py-2.5"
                        >
                            <Avatar size="sm">
                                <AvatarFallback className={agent.tint}>
                                    {agent.initials}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex min-w-0 flex-col">
                                <span className="font-medium text-sm">
                                    {agent.name}
                                </span>
                                <span className="text-muted-foreground text-xs">
                                    {agent.role}
                                </span>
                            </div>
                        </div>
                    ))}

                    <div className="flex items-center gap-3 rounded-md border border-dashed px-3 py-2.5">
                        <Avatar size="sm">
                            <AvatarFallback className={CURATOR.tint}>
                                {CURATOR.initials}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex min-w-0 flex-col">
                            <span className="flex items-center gap-1.5 font-medium text-sm">
                                {CURATOR.name}
                                <Badge variant="outline" className="gap-1">
                                    <Cog className="size-3" />
                                    engine, not an agent
                                </Badge>
                            </span>
                            <span className="text-muted-foreground text-xs">
                                {CURATOR.role}
                            </span>
                        </div>
                    </div>
                </div>

                <section className="flex flex-col gap-2">
                    <h2 className="font-semibold text-sm">
                        Orchestration loop
                    </h2>
                    <div className="flex flex-wrap items-center gap-1.5">
                        {LOOP.map((step, i) => (
                            <div
                                key={step}
                                className="flex items-center gap-1.5"
                            >
                                <Badge variant="secondary">{step}</Badge>
                                {i < LOOP.length - 1 ? (
                                    <ArrowRight className="size-3.5 text-muted-foreground" />
                                ) : null}
                            </div>
                        ))}
                    </div>
                    <p className="text-muted-foreground text-sm">
                        The orchestrator owns the plan tree and dispatches
                        isolated workers with self-contained prompts; recall is
                        injected, never queried. A fresh Reviewer checks
                        results; unrecoverable work escalates to a Situation.
                    </p>
                </section>
            </div>
        </ScrollArea>
    );
}
