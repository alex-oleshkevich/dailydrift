import { LayoutDashboard, X } from "lucide-react";

import type { NavLeaf } from "@/components/app-sidebar";
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type TabItem = NavLeaf;

interface TabViewProps {
    tabs: TabItem[];
    activeId?: string;
    onActiveChange: (id: string) => void;
    onClose: (id: string) => void;
}

export function TabView({
    tabs,
    activeId,
    onActiveChange,
    onClose,
}: TabViewProps) {
    return (
        <Tabs
            value={activeId ?? ""}
            onValueChange={(value) => onActiveChange(value as string)}
            className="flex h-full min-h-0 flex-1 flex-col gap-0"
        >
            <div className="flex h-12 shrink-0 items-center gap-2 border-b px-2">
                <SidebarTrigger />
                <Separator orientation="vertical" className="h-5" />
                <ScrollArea className="min-w-0 flex-1">
                    <TabsList variant="line" className="h-10 justify-start">
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
                </ScrollArea>
            </div>

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
                        <Empty className="h-full border-none">
                            <EmptyHeader>
                                <EmptyMedia variant="icon">
                                    <tab.icon />
                                </EmptyMedia>
                                <EmptyTitle>{tab.title}</EmptyTitle>
                                <EmptyDescription>
                                    This is the {tab.title} page. Empty for now.
                                </EmptyDescription>
                            </EmptyHeader>
                        </Empty>
                    </TabsContent>
                ))
            )}
        </Tabs>
    );
}
