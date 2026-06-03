import { ArrowDown } from "lucide-react";
import { useRef, useState } from "react";
import { Virtuoso, type VirtuosoHandle } from "react-virtuoso";

import {
    type MessageActions,
    MessageItem,
} from "@/components/chat/message-item";
import { Button } from "@/components/ui/button";
import type { Message } from "@/lib/conversation";

export function MessageList({
    messages,
    actions,
}: {
    messages: Message[];
    actions: MessageActions;
}) {
    const ref = useRef<VirtuosoHandle>(null);
    const [atBottom, setAtBottom] = useState(true);

    return (
        <div className="relative min-h-0 flex-1">
            <Virtuoso
                ref={ref}
                data={messages}
                followOutput="smooth"
                initialTopMostItemIndex={messages.length - 1}
                atBottomStateChange={setAtBottom}
                atBottomThreshold={48}
                className="h-full"
                itemContent={(_index, message) => (
                    <div className="px-4 py-3">
                        <MessageItem message={message} {...actions} />
                    </div>
                )}
            />
            {atBottom ? null : (
                <Button
                    size="icon"
                    variant="outline"
                    aria-label="Scroll to bottom"
                    className="slide-in-from-bottom-1 fade-in-0 absolute right-4 bottom-4 h-8 w-8 animate-in rounded-full shadow-md"
                    onClick={() =>
                        ref.current?.scrollToIndex({
                            index: messages.length - 1,
                            behavior: "smooth",
                        })
                    }
                >
                    <ArrowDown />
                </Button>
            )}
        </div>
    );
}
