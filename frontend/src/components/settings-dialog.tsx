import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

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
            <DialogContent className="sm:max-w-5xl">
                <DialogHeader>
                    <DialogTitle>Settings</DialogTitle>
                </DialogHeader>
                <div className="flex gap-6">
                    <nav className="flex flex-col gap-1">
                        {SECTIONS.map((s) => (
                            <Button
                                key={s}
                                variant={s === section ? "secondary" : "ghost"}
                                className="justify-start"
                                onClick={() => setSection(s)}
                            >
                                {s}
                            </Button>
                        ))}
                    </nav>
                    <div className="flex-1 text-muted-foreground text-sm">
                        {section} — coming soon
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
