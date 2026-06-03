import { useState } from "react";

import { MessageInput } from "@/components/ui/message-input";
import type { FileRef } from "@/lib/conversation";

let attachmentCounter = 0;

function formatSize(bytes: number): string {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export function Composer({
    onSend,
}: {
    onSend: (text: string, attachments: FileRef[]) => void;
}) {
    const [text, setText] = useState("");
    const [files, setFiles] = useState<File[] | null>(null);

    const send = () => {
        const trimmed = text.trim();
        if (!trimmed) {
            return;
        }
        const attachments: FileRef[] = (files ?? []).map((file) => ({
            id: `draft-${attachmentCounter++}`,
            name: file.name,
            size: formatSize(file.size),
        }));
        onSend(trimmed, attachments);
        setText("");
        setFiles(null);
    };

    return (
        <form
            onSubmit={(event) => {
                event.preventDefault();
                send();
            }}
            className="border-t p-3"
        >
            <MessageInput
                value={text}
                onChange={(event) => setText(event.target.value)}
                placeholder="Message the System…"
                isGenerating={false}
                allowAttachments
                files={files}
                setFiles={setFiles}
            />
        </form>
    );
}
