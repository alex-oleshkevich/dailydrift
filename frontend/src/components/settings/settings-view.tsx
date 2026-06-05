import { Bot, Brain, type LucideIcon, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

import { AgentsView } from "@/components/agents/agents-view";
import { MemoryView } from "@/components/memory/memory-view";
import { cn } from "@/lib/utils";

const SECTIONS: { id: string; label: string; icon: LucideIcon }[] = [
    { id: "agents", label: "Agents", icon: Bot },
    { id: "memory", label: "Memory", icon: Brain },
];

export function SettingsView() {
    const [section, setSection] = useState("agents");
    return (
        <div className="flex h-full min-h-0">
            <nav className="flex w-48 shrink-0 flex-col gap-0.5 border-r p-2">
                <span className="flex items-center gap-2 px-2 py-1.5 font-semibold text-sm">
                    <SlidersHorizontal className="size-4" />
                    Settings
                </span>
                {SECTIONS.map((item) => (
                    <button
                        key={item.id}
                        type="button"
                        onClick={() => setSection(item.id)}
                        className={cn(
                            "flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm",
                            section === item.id
                                ? "bg-muted font-medium"
                                : "text-muted-foreground hover:bg-muted/50",
                        )}
                    >
                        <item.icon className="size-4" />
                        {item.label}
                    </button>
                ))}
            </nav>
            <div className="min-h-0 flex-1">
                {section === "agents" ? <AgentsView /> : <MemoryView />}
            </div>
        </div>
    );
}
