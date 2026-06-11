import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface SettingsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const SECTIONS = ["General", "Account", "Integrations", "Privacy"] as const;
type Section = (typeof SECTIONS)[number];

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
    const [section, setSection] = useState<Section>("General");

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Settings</DialogTitle>
                </DialogHeader>
                <div className="flex min-h-96 gap-6">
                    <nav className="w-44 shrink-0 space-y-0.5">
                        {SECTIONS.map((s) => (
                            <button
                                key={s}
                                type="button"
                                onClick={() => setSection(s)}
                                className={cn(
                                    "w-full rounded-md px-3 py-1.5 text-left text-sm transition-colors",
                                    s === section
                                        ? "bg-accent font-medium"
                                        : "text-muted-foreground hover:bg-accent/50",
                                )}
                            >
                                {s}
                            </button>
                        ))}
                    </nav>
                    <div className="flex-1 pt-1 text-muted-foreground text-sm">
                        {section} — coming soon
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
