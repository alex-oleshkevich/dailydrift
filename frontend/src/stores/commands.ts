import {
    Calendar,
    Home,
    type LucideIcon,
    PanelLeft,
    Plus,
    Settings,
} from "lucide-react";
import { create } from "zustand";

export interface PaletteCommand {
    id: string;
    title: string;
    icon: LucideIcon;
    shortcut?: string;
}

export interface ContentResult {
    id: string;
    title: string;
    kind: string;
}

interface CommandPaletteState {
    open: boolean;
    setOpen: (open: boolean) => void;
    toggle: () => void;
    commands: PaletteCommand[];
    content: ContentResult[];
}

// Stub data. `content` becomes a real API-backed search later; `commands` stay local.
export const useCommandPaletteStore = create<CommandPaletteState>()((set) => ({
    open: false,
    setOpen: (open) => set({ open }),
    toggle: () => set((state) => ({ open: !state.open })),
    commands: [
        { id: "go-home", title: "Go to Home", icon: Home },
        { id: "go-calendar", title: "Go to Calendar", icon: Calendar },
        { id: "open-settings", title: "Open Settings", icon: Settings },
        { id: "new-chat", title: "New Chat", icon: Plus },
        {
            id: "toggle-sidebar",
            title: "Toggle Sidebar",
            icon: PanelLeft,
            shortcut: "⌘B",
        },
    ],
    content: [
        {
            id: "story-framework-ui",
            title: "Framework UI direction",
            kind: "Storyline",
        },
        {
            id: "sit-talia-overdue",
            title: "Investor reply to Talia overdue",
            kind: "Situation",
        },
        {
            id: "story-brightmoor",
            title: "Brightmoor portal delivery",
            kind: "Storyline",
        },
        {
            id: "conv-belov",
            title: "Consensus research with Dr. Belov",
            kind: "Conversation",
        },
    ],
}));
