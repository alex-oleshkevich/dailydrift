import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { MomentumBadge } from "@/components/chat/messages/parts";
import { HomeBlock } from "@/components/home/home-block";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { seedHome } from "@/lib/home";

const DIGESTS = ["Daily", "Weekly", "Space"];

export function HomeView() {
    const [data, setData] = useState(seedHome);
    const [digest, setDigest] = useState(DIGESTS[0]);

    const resolveSituation = (id: string, action: string) =>
        setData((prev) => ({
            ...prev,
            groups: prev.groups.map((group) => ({
                ...group,
                blocks: group.blocks.map((block) =>
                    block.kind === "situation" && block.situation.id === id
                        ? {
                              ...block,
                              situation: {
                                  ...block.situation,
                                  resolved: action,
                              },
                          }
                        : block,
                ),
            })),
        }));

    return (
        <ScrollArea className="h-full">
            <div className="mx-auto flex max-w-2xl flex-col gap-10 px-8 py-12">
                <header className="flex flex-col gap-5">
                    <div className="flex items-center gap-3">
                        <Badge variant="secondary">{data.space}</Badge>
                        <DropdownMenu>
                            <DropdownMenuTrigger
                                render={
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="ml-auto"
                                    >
                                        {digest} digest
                                        <ChevronDown data-icon="inline-end" />
                                    </Button>
                                }
                            />
                            <DropdownMenuContent align="end">
                                {DIGESTS.map((option) => (
                                    <DropdownMenuItem
                                        key={option}
                                        onClick={() => setDigest(option)}
                                    >
                                        {option}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <p className="text-pretty font-medium text-xl leading-relaxed tracking-tight">
                        {data.briefing}
                    </p>
                </header>

                {data.groups.map((group) => (
                    <section key={group.id} className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <h2 className="min-w-0 flex-1 truncate font-semibold text-base">
                                {group.title}
                            </h2>
                            <MomentumBadge momentum={group.momentum} />
                        </div>
                        <div className="flex flex-col gap-4 border-border border-l pl-4">
                            {group.blocks.map((block) => (
                                <HomeBlock
                                    key={block.id}
                                    block={block}
                                    onResolveSituation={resolveSituation}
                                />
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </ScrollArea>
    );
}
