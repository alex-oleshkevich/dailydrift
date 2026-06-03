import { ArrowRight, Check, MessageCircleQuestion, Send } from "lucide-react";
import { useState } from "react";

import { SystemEvent } from "@/components/chat/messages/parts";
import { Button } from "@/components/ui/button";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from "@/components/ui/input-group";
import { AGENTS, type QuestionnaireMessage } from "@/lib/conversation";

const OPTION_KEYS = ["A", "B", "C", "D", "E", "F"];

export function QuestionnaireCard({
    message,
    onAnswer,
}: {
    message: QuestionnaireMessage;
    onAnswer: (id: string, answer: string) => void;
}) {
    const agent = AGENTS[message.agentId];
    const [other, setOther] = useState("");

    const submitOther = () => {
        const value = other.trim();
        if (value) {
            onAnswer(message.id, value);
        }
    };

    return (
        <SystemEvent
            accent="primary"
            emphasis
            icon={MessageCircleQuestion}
            label={`${agent.name} asks`}
            time={message.time}
        >
            <p className="text-pretty font-medium leading-relaxed">
                {message.question}
            </p>
            {message.answer ? (
                <div className="flex items-center gap-2 text-sm">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Check className="size-3" />
                    </span>
                    <span className="font-medium">{message.answer}</span>
                </div>
            ) : (
                <>
                    <div className="flex flex-col gap-1.5">
                        {message.options.map((option, index) => (
                            <Button
                                key={option}
                                variant="outline"
                                className="group/opt h-auto justify-start gap-2.5 py-2 text-left"
                                onClick={() => onAnswer(message.id, option)}
                            >
                                <span className="flex size-5 shrink-0 items-center justify-center rounded-md border bg-muted font-medium text-muted-foreground text-xs">
                                    {OPTION_KEYS[index] ?? "•"}
                                </span>
                                <span className="flex-1 whitespace-normal">
                                    {option}
                                </span>
                                <ArrowRight className="size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover/opt:opacity-100" />
                            </Button>
                        ))}
                    </div>
                    <InputGroup>
                        <InputGroupInput
                            value={other}
                            onChange={(event) => setOther(event.target.value)}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    submitOther();
                                }
                            }}
                            placeholder="Type another answer…"
                        />
                        <InputGroupAddon align="inline-end">
                            <InputGroupButton
                                size="icon-xs"
                                variant="default"
                                disabled={!other.trim()}
                                onClick={submitOther}
                                aria-label="Send answer"
                            >
                                <Send />
                            </InputGroupButton>
                        </InputGroupAddon>
                    </InputGroup>
                </>
            )}
        </SystemEvent>
    );
}
