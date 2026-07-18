"use client";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputBody,
  PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { Response } from "@/components/ai-elements/response";
import CitationChip from "@/components/chat/citation-chip";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, UIMessage } from "ai";
import {
  Bot,
  FileSearch,
  Loader2,
  MessageSquareText,
  Search,
  Sparkles,
} from "lucide-react";
import { Fragment, useState } from "react";

interface ChatUIProps {
  workspaceId: string;
  sessionId: string | null;
  initialMessages?: UIMessage[];
}

const suggestions = [
  {
    icon: FileSearch,
    title: "Summarize documents",
    description: "Get a concise overview of your workspace.",
    prompt: "Summarize the key points from my documents",
  },
  {
    icon: MessageSquareText,
    title: "Explore main topics",
    description: "Understand the subjects covered in your files.",
    prompt: "What are the main topics in my documents?",
  },
  {
    icon: Search,
    title: "Find key details",
    description: "Extract important facts, dates, and numbers.",
    prompt: "Find important dates or numbers",
  },
];

export function ChatUI({
  workspaceId,
  sessionId,
  initialMessages,
}: ChatUIProps) {
  const [input, setInput] = useState("");
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [currentSessionId, currentSetSessionId] = useState<string | null>(
    sessionId
  );

  const {
    messages,
    sendMessage,
    status,
    error: chatError,
  } = useChat({
    messages: initialMessages ?? [],
    transport: new DefaultChatTransport({
      api: `/api/workspaces/${workspaceId}/chat`,
      body: { sessionId },
    }),
  });

  const handleSubmit = async (message: PromptInputMessage) => {
    if (!message.text?.trim()) return;

    let activeSessionId = currentSessionId;

    setSessionError(null);
    try {
      if (!activeSessionId) {
        const res = await fetch(
          `/api/workspaces/${workspaceId}/chat/sessions`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              firstMessage: message.text.trim(),
            }),
          }
        );

        if (!res.ok) throw new Error("Failed to create session");
        const { data } = await res.json();

        activeSessionId = data.sessionId;
        currentSetSessionId(data.sessionId);

        window.history.replaceState(
          null,
          "",
          `/workspace/${workspaceId}/chat/${data.sessionId}`
        );

        await sendMessage(
          { text: message.text },
          {
            body: {
              sessionId: data.sessionId,
            },
          }
        );
      } else {
        await sendMessage(
          { text: message.text },
          {
            body: {
              sessionId: activeSessionId,
            },
          }
        );
      }
    } catch (error) {
      console.error("Failed to create session:", error);

      setSessionError(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setInput("");
    }
  };

  const isLoading = status === "submitted" || status === "streaming";
  const isEmpty = messages.length === 0;

  return (
    <main className="flex min-h-0 flex-1 flex-col bg-[var(--color-canvas)]">
      <header className="flex h-14 shrink-0 items-center border-b border-[var(--color-hairline)] px-5 lg:px-7">
        <div className="min-w-0">
          <h1 className="truncate text-[14px] font-medium tracking-[-0.1px] text-[var(--color-ink)]">
            IntelliVault Chat
          </h1>

          <p className="mt-0.5 truncate text-[11px] text-[var(--color-ink-tertiary)]">
            Search and understand your workspace
          </p>
        </div>
      </header>

      <section className="relative flex min-h-0 flex-1 flex-col">
        <Conversation className="min-h-0 flex-1">
          <ConversationContent
            className={
              isEmpty
                ? "mx-auto flex size-full w-full max-w-[760px] justify-center px-5 py-10 md:px-8"
                : "mx-auto flex w-full max-w-[760px] flex-col gap-9 px-5 pb-10 pt-8 md:px-8 md:pt-10"
            }
          >
            {isEmpty && (
              <div className="flex w-full flex-col justify-center">
                <div className="mb-8">
                  <div className="mb-5 flex size-10 items-center justify-center rounded-lg border border-[var(--color-hairline)] bg-[var(--color-surface-1)]">
                    <Sparkles
                      size={17}
                      strokeWidth={1.8}
                      className="text-[var(--color-primary)]"
                    />
                  </div>

                  <h2 className="text-[26px] font-semibold tracking-[-0.6px] text-[var(--color-ink)]">
                    What can I help you find?
                  </h2>

                  <p className="mt-2 max-w-lg text-[14px] leading-6 text-[var(--color-ink-subtle)]">
                    Ask questions about your workspace and get answers grounded
                    in your documents.
                  </p>
                </div>

                <div className="grid gap-2 md:grid-cols-3">
                  {suggestions.map((suggestion) => {
                    const Icon = suggestion.icon;

                    return (
                      <button
                        key={suggestion.title}
                        type="button"
                        disabled={isLoading}
                        onClick={() =>
                          handleSubmit({
                            text: suggestion.prompt,
                          })
                        }
                        className="
                          group flex min-h-[132px] cursor-pointer
                          flex-col rounded-lg
                          border border-[var(--color-hairline)]
                          bg-[var(--color-surface-1)]
                          p-4 text-left
                          transition-colors duration-150
                          hover:border-[var(--color-hairline-strong)]
                          hover:bg-[var(--color-surface-2)]
                          disabled:pointer-events-none
                          disabled:opacity-50
                        "
                      >
                        <Icon
                          size={16}
                          strokeWidth={1.7}
                          className="
                            text-[var(--color-ink-tertiary)]
                            transition-colors
                            group-hover:text-[var(--color-primary)]
                          "
                        />

                        <div className="mt-auto pt-6">
                          <p className="text-[13px] font-medium text-[var(--color-ink)]">
                            {suggestion.title}
                          </p>

                          <p className="mt-1.5 text-[11px] leading-[17px] text-[var(--color-ink-tertiary)]">
                            {suggestion.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {messages.map((message) => (
              <article
                key={message.id}
                className={`
                  flex w-full
                  ${
                    message.role === "user"
                      ? "justify-end"
                      : "justify-start gap-3"
                  }
                `}
              >
                {message.role === "assistant" && (
                  <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md border border-[var(--color-hairline)] bg-[var(--color-surface-1)]">
                    <Bot
                      size={13}
                      strokeWidth={1.8}
                      className="text-[var(--color-primary)]"
                    />
                  </div>
                )}

                <div
                  className={`
                    flex min-w-0 flex-col gap-3
                    ${
                      message.role === "user"
                        ? "max-w-[80%] items-end"
                        : "max-w-[calc(100%-40px)] flex-1 items-start"
                    }
                  `}
                >
                  {message.parts.map((part, index) => {
                    switch (part.type) {
                      case "text":
                        return (
                          <Fragment key={`${message.id}-${index}`}>
                            <Message from={message.role}>
                              <MessageContent
                                className={
                                  message.role === "user"
                                    ? `
                                      rounded-lg
                                      border border-[var(--color-hairline)]
                                      bg-[var(--color-surface-2)]
                                      px-4 py-2.5
                                      text-[14px] leading-6
                                      text-[var(--color-ink)]
                                    `
                                    : `
                                      w-full
                                      bg-transparent
                                      p-0
                                      text-[14px] leading-7
                                      text-[var(--color-ink-muted)]
                                    `
                                }
                              >
                                <Response>{part.text}</Response>
                              </MessageContent>
                            </Message>
                          </Fragment>
                        );

                      case "tool-searchKnowledgeBase": {
                        if (part.state !== "output-available") return null;

                        const output = part.output;

                        // Handle string response — either error or "no results" message
                        if (typeof output === "string") {
                          // Don't show anything for "no results" — LLM handles it in text response
                          // Only show if it's a real error worth surfacing
                          if (output.toLowerCase().includes("error")) {
                            return (
                              <div
                                key={`${part.toolCallId}-${index}`}
                                className="flex items-center gap-1.5 text-[12px] text-[var(--color-ink-tertiary)]"
                              >
                                <span className="w-1 h-1 rounded-full bg-[var(--color-error)]/50" />
                                Search encountered an issue
                              </div>
                            );
                          }
                          return null; // "No relevant information found" — LLM text handles this
                        }

                        // Handle Array response
                        if (Array.isArray(output) || part?.output.length === 0)
                          return null;

                        const results = part.output as Array<{
                          content: string;
                          source: string;
                          chunkId: string;
                        }>;

                        if (!(results?.length > 0)) return null;

                        const uniqueSources = [
                          ...new Set(results?.map((result) => result.source)),
                        ];

                        return (
                          <div
                            key={`${part.toolCallId}-${index}`}
                            className="flex flex-wrap gap-1.5"
                          >
                            {uniqueSources.map((source) => (
                              <CitationChip key={source} source={source} />
                            ))}
                          </div>
                        );
                      }

                      default:
                        return null;
                    }
                  })}
                </div>
              </article>
            ))}

            {isLoading && (
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md border border-[var(--color-hairline)] bg-[var(--color-surface-1)]">
                  <Bot
                    size={13}
                    strokeWidth={1.8}
                    className="text-[var(--color-primary)]"
                  />
                </div>

                <div className="flex items-center gap-2 py-1">
                  <Loader2
                    size={13}
                    className="animate-spin text-[var(--color-primary)]"
                  />

                  <span className="text-[12px] text-[var(--color-ink-tertiary)]">
                    Searching workspace
                  </span>
                </div>
              </div>
            )}

            {(sessionError || chatError) && (
              <div className="rounded-md border border-[var(--color-hairline)] bg-[var(--color-surface-1)] px-3 py-2.5">
                <p className="text-[12px] text-[var(--color-ink-subtle)]">
                  {sessionError ||
                    chatError?.message ||
                    "Something went wrong while sending your message."}
                </p>
              </div>
            )}
          </ConversationContent>

          <ConversationScrollButton />
        </Conversation>

        <footer className="shrink-0 border-t border-[var(--color-hairline)] bg-[var(--color-canvas)] px-5 py-4">
          <div className="mx-auto w-full max-w-[760px]">
            <PromptInput
              onSubmit={handleSubmit}
              className="
        flex items-center
        rounded-lg
        border border-[var(--color-hairline)]
        bg-[var(--color-surface-1)]
        px-2 py-2
        shadow-none
        transition-[border-color,box-shadow,background-color]
        duration-150
        hover:border-[var(--color-hairline-strong)]
        focus-within:border-[var(--color-hairline-strong)]
        focus-within:bg-[var(--color-surface-2)]
        focus-within:ring-2
        focus-within:ring-[var(--color-primary-focus)]/15
      "
            >
              <PromptInputBody className="min-w-0 flex-1">
                <PromptInputTextarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Ask about your workspace..."
                  className="
            min-h-[36px]
            max-h-[160px]
            w-full
            resize-none
            bg-transparent
            px-2 py-1.5
            text-[14px]
            leading-6
            text-[var(--color-ink)]
            placeholder:text-[var(--color-ink-tertiary)]
          "
                />
              </PromptInputBody>

              <PromptInputToolbar className="shrink-0 p-0 sefl-center">
                <PromptInputTools />

                <PromptInputSubmit
                  status={status}
                  disabled={!input.trim() || isLoading}
                  className="
            size-8
            shrink-0
            rounded-md
            items-center
            bg-[var(--color-primary)]
            text-white
            transition-colors
            hover:bg-[var(--color-primary-hover)]
            disabled:bg-[var(--color-surface-3)]
            disabled:text-[var(--color-ink-tertiary)]
            disabled:opacity-100
          "
                />
              </PromptInputToolbar>
            </PromptInput>

            <p className="mt-2 text-center text-[10px] text-[var(--color-ink-tertiary)]">
              IntelliVault can make mistakes. Verify important information.
            </p>
          </div>
        </footer>
      </section>
    </main>
  );
}
