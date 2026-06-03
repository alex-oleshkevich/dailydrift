import {
    LayoutDashboard,
    ListTodo,
    MessageSquarePlus,
    Plus,
    Search,
    X,
} from "lucide-react";

import type { NavLeaf } from "@/components/app-sidebar";
import { ChatView } from "@/components/chat/chat-view";
import { HomeView } from "@/components/home/home-view";
import { InboxView } from "@/components/inbox/inbox-view";
import { StorylineView } from "@/components/storyline/storyline-view";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCommandPaletteStore } from "@/stores/commands";

export type TabItem = NavLeaf;

interface TabViewProps {
    tabs: TabItem[];
    activeId?: string;
    onActiveChange: (id: string) => void;
    onClose: (id: string) => void;
    onNew: (kind: "chat" | "task") => void;
}

export function TabView({
    tabs,
    activeId,
    onActiveChange,
    onClose,
    onNew,
}: TabViewProps) {
    const openPalette = useCommandPaletteStore((state) => state.setOpen);

    return (
        <Tabs
            value={activeId ?? ""}
            onValueChange={(value) => onActiveChange(value as string)}
            className="flex h-full min-h-0 flex-1 flex-col gap-0"
        >
            <div className="flex h-12 shrink-0 items-center gap-2 border-b px-2">
                <SidebarTrigger />
                <Separator orientation="vertical" className="h-5" />
                <div className="ml-auto flex items-center gap-2">
                    <Button
                        variant="outline"
                        className="h-8 w-56 justify-start gap-2 px-2.5 font-normal text-muted-foreground"
                        onClick={() => openPalette(true)}
                    >
                        <Search />
                        <span className="flex-1 text-left">Search…</span>
                        <kbd className="rounded border bg-muted px-1.5 font-medium text-xs">
                            ⌘P
                        </kbd>
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            render={
                                <Button size="icon" aria-label="Create new">
                                    <Plus />
                                </Button>
                            }
                        />
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onNew("chat")}>
                                <MessageSquarePlus />
                                New chat
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onNew("task")}>
                                <ListTodo />
                                New task
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {tabs.length > 0 ? (
                <div className="flex h-10 shrink-0 items-center border-b px-2">
                    <div className="flex min-w-0 flex-1 overflow-x-auto overflow-y-hidden">
                        <TabsList
                            variant="line"
                            className="h-10 w-max justify-start"
                        >
                            {tabs.map((tab) => (
                                <TabsTrigger
                                    key={tab.id}
                                    value={tab.id}
                                    render={<div />}
                                    className="h-8 flex-none cursor-pointer gap-1.5 pr-1"
                                >
                                    <tab.icon />
                                    <span>{tab.title}</span>
                                    <button
                                        type="button"
                                        aria-label={`Close ${tab.title}`}
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            onClose(tab.id);
                                        }}
                                        className="ml-1 inline-flex size-5 items-center justify-center rounded-sm text-muted-foreground opacity-60 hover:bg-muted hover:opacity-100"
                                    >
                                        <X className="size-3.5" />
                                    </button>
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </div>
                </div>
            ) : null}

            {tabs.length === 0 ? (
                <Empty className="flex-1 border-none">
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <LayoutDashboard />
                        </EmptyMedia>
                        <EmptyTitle>Nothing open</EmptyTitle>
                        <EmptyDescription>
                            Select an item from the sidebar to open it as a tab.
                        </EmptyDescription>
                    </EmptyHeader>
                </Empty>
            ) : (
                tabs.map((tab) => (
                    <TabsContent
                        key={tab.id}
                        value={tab.id}
                        className="min-h-0 flex-1 p-0"
                    >
                        {tab.id === "home" ? (
                            <HomeView />
                        ) : tab.id === "inbox" ? (
                            <InboxView />
                        ) : tab.id.startsWith("story-") ? (
                            <StorylineView storylineId={tab.id} />
                        ) : (
                            <ChatView conversationId={tab.id} />
                        )}
                    </TabsContent>
                ))
            )}
        </Tabs>
    );
}
