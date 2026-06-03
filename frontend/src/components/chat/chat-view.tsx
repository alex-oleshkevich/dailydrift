import { PanelRight, PanelRightClose } from "lucide-react";
import {
    useCallback,
    useEffect,
    useMemo,
    useReducer,
    useRef,
    useState,
} from "react";

import { Composer } from "@/components/chat/composer";
import { ConversationSidebar } from "@/components/chat/conversation-sidebar";
import { MessageList } from "@/components/chat/message-list";
import { Button } from "@/components/ui/button";
import {
    type AgentId,
    type ConversationData,
    type Decision,
    type FileRef,
    type Message,
    replyChunks,
    seedConversation,
    type Task,
} from "@/lib/conversation";

type Action =
    | { type: "append"; message: Message }
    | { type: "chunk"; id: string; text: string }
    | { type: "end"; id: string }
    | { type: "resolve-permission"; id: string; decision: Decision }
    | { type: "resolve-situation"; id: string; action: string }
    | { type: "answer-questionnaire"; id: string; answer: string }
    | { type: "remove-agent"; agentId: AgentId }
    | { type: "advance-task"; taskId: string };

function advance(task: Task): Task {
    const steps = task.steps.map((step) => ({ ...step }));
    const current = steps.findIndex((step) => step.status === "current");
    if (current >= 0) {
        steps[current].status = "done";
    }
    const next = steps.findIndex((step) => step.status === "pending");
    if (next >= 0) {
        steps[next].status = "current";
    }
    return { ...task, steps };
}

function reducer(state: ConversationData, action: Action): ConversationData {
    switch (action.type) {
        case "append":
            return { ...state, messages: [...state.messages, action.message] };
        case "chunk":
            return {
                ...state,
                messages: state.messages.map((message) =>
                    message.id === action.id && message.kind === "agent"
                        ? { ...message, body: message.body + action.text }
                        : message,
                ),
            };
        case "end":
            return {
                ...state,
                messages: state.messages.map((message) =>
                    message.id === action.id && message.kind === "agent"
                        ? { ...message, streaming: false }
                        : message,
                ),
            };
        case "resolve-permission":
            return {
                ...state,
                messages: state.messages.map((message) =>
                    message.id === action.id && message.kind === "permission"
                        ? { ...message, decision: action.decision }
                        : message,
                ),
            };
        case "resolve-situation":
            return {
                ...state,
                messages: state.messages.map((message) =>
                    message.id === action.id && message.kind === "situation"
                        ? { ...message, resolved: action.action }
                        : message,
                ),
            };
        case "answer-questionnaire":
            return {
                ...state,
                messages: state.messages.map((message) =>
                    message.id === action.id && message.kind === "questionnaire"
                        ? { ...message, answer: action.answer }
                        : message,
                ),
            };
        case "remove-agent":
            return {
                ...state,
                agents: state.agents.filter(
                    (agent) => agent.id !== action.agentId,
                ),
            };
        case "advance-task":
            return {
                ...state,
                tasks: state.tasks.map((task) =>
                    task.id === action.taskId ? advance(task) : task,
                ),
            };
    }
}

function now(): string {
    const date = new Date();
    return `${String(date.getHours()).padStart(2, "0")}:${String(
        date.getMinutes(),
    ).padStart(2, "0")}`;
}

export function ChatView({ conversationId }: { conversationId: string }) {
    const [state, dispatch] = useReducer(reducer, conversationId, () =>
        seedConversation(conversationId),
    );
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const idRef = useRef(0);
    const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

    useEffect(() => {
        const interval = setInterval(
            () => dispatch({ type: "advance-task", taskId: "task-sources" }),
            4000,
        );
        const pending = timers.current;
        return () => {
            clearInterval(interval);
            pending.forEach(clearTimeout);
        };
    }, []);

    const stream = useCallback((agentId: "research" | "executive") => {
        const id = `live-${idRef.current++}`;
        dispatch({
            type: "append",
            message: {
                id,
                time: now(),
                kind: "agent",
                agentId,
                body: "",
                streaming: true,
            },
        });
        let delay = 350;
        for (const chunk of replyChunks()) {
            timers.current.push(
                setTimeout(
                    () => dispatch({ type: "chunk", id, text: chunk }),
                    delay,
                ),
            );
            delay += 350;
        }
        timers.current.push(
            setTimeout(() => dispatch({ type: "end", id }), delay),
        );
    }, []);

    const onSend = useCallback(
        (text: string, attachments: FileRef[]) => {
            dispatch({
                type: "append",
                message: {
                    id: `live-${idRef.current++}`,
                    time: now(),
                    kind: "user",
                    body: text,
                    attachments: attachments.length ? attachments : undefined,
                },
            });
            stream("research");
        },
        [stream],
    );

    const actions = useMemo(
        () => ({
            onResolvePermission: (id: string, decision: Decision) =>
                dispatch({ type: "resolve-permission", id, decision }),
            onResolveSituation: (id: string, action: string) =>
                dispatch({ type: "resolve-situation", id, action }),
            onAnswerQuestionnaire: (id: string, answer: string) =>
                dispatch({ type: "answer-questionnaire", id, answer }),
            onRetry: () => stream("executive"),
        }),
        [stream],
    );

    const onRemoveAgent = useCallback(
        (agentId: AgentId) => dispatch({ type: "remove-agent", agentId }),
        [],
    );

    const onDownload = useCallback((file: FileRef) => {
        const url = URL.createObjectURL(
            new Blob([file.name], { type: "text/plain" }),
        );
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = file.name;
        anchor.click();
        URL.revokeObjectURL(url);
    }, []);

    const derived = useMemo(() => {
        const attachments = new Map<string, FileRef>();
        for (const message of state.messages) {
            if (
                (message.kind === "agent" || message.kind === "user") &&
                message.attachments
            ) {
                for (const file of message.attachments) {
                    attachments.set(file.id, file);
                }
            }
        }
        return {
            attachments: [...attachments.values()],
        };
    }, [state.messages]);

    return (
        <div className="flex h-full min-h-0">
            <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex h-10 shrink-0 items-center justify-end border-b px-2">
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Toggle details"
                        onClick={() => setSidebarOpen((open) => !open)}
                    >
                        {sidebarOpen ? <PanelRightClose /> : <PanelRight />}
                    </Button>
                </div>
                <MessageList messages={state.messages} actions={actions} />
                <Composer onSend={onSend} />
            </div>
            {sidebarOpen ? (
                <ConversationSidebar
                    agents={state.agents}
                    tasks={state.tasks}
                    attachments={derived.attachments}
                    onRemoveAgent={onRemoveAgent}
                    onDownload={onDownload}
                />
            ) : null}
        </div>
    );
}
