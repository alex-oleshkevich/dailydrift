import { RotateCw, TriangleAlert } from "lucide-react";

import { SystemEvent } from "@/components/chat/messages/parts";
import { Button } from "@/components/ui/button";
import type { ErrorMessage } from "@/lib/conversation";

export function ErrorRow({
    message,
    onRetry,
}: {
    message: ErrorMessage;
    onRetry: (id: string) => void;
}) {
    return (
        <SystemEvent
            accent="destructive"
            emphasis
            icon={TriangleAlert}
            label="Error"
            time={message.time}
            footer={
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRetry(message.id)}
                >
                    <RotateCw data-icon="inline-start" />
                    Retry
                </Button>
            }
        >
            <p className="text-pretty leading-relaxed">{message.body}</p>
        </SystemEvent>
    );
}
