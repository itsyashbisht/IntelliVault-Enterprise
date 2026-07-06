"use client";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  PromptInput,
  PromptInputBody,
  PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { Fragment, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { Message, MessageContent } from "@/components/ai-elements/message";
import { Response } from "@/components/ai-elements/response";
import { DefaultChatTransport, UIMessage } from "ai";
import { Bot, Loader2, Sparkles } from "lucide-react";
import CitationChip from "@/components/citation-chip";

interface ChatUIProps {
  workspaceId: string;
  sessionId: string | null;
  initialMessages?: UIMessage[];
}

export function ChatUI(props: ChatUIProps) {
  const { workspaceId, sessionId, initialMessages } = props;
  const [input, setInput] = useState<string>("");
  const [sessionError, setSessionError] = useState<string | null>(null);

  const {
    messages,
    sendMessage,
    status,
    error: ChatError,
  } = useChat({
    messages: initialMessages ?? [],
    transport: new DefaultChatTransport({
      api: `/api/workspaces/${workspaceId}/chat`,
      body: { sessionId },
    }),
  });

  const handleSubmit = async (message: PromptInputMessage) => {
    if (!message.text?.trim()) return;

    try {
      if (!sessionId) {
        const res = await fetch(
          `/api/workspaces/${workspaceId}/chat/sessions`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ firstMessage: message.text.trim() }),
          },
        );
        const { data } = await res.json();
        window.history.replaceState(
          null,
          "",
          `/workspace/${workspaceId}/chat/${data.sessionId}`,
        );
        await sendMessage(
          { text: message.text },
          { body: { sessionId: data.sessionId } },
        );
      } else {
        // Existing session — just send
        await sendMessage({ text: message.text });
      }

      setInput("");
    } catch (error) {
      console.error("Failed to create session:", error);
      setSessionError(
        error instanceof Error ? error.message : "Something went wrong",
      );
      setInput("");
    }
  };

  const isLoading = status === "submitted" || status === "streaming";
  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-full max-w-full w-full bg-[var(--color-canvas)] p-5">
      {/* ── Page header ─────────────────────────────── */}
      <header className="flex flex-col gap-2 pb-8 px-1 shrink-0">
        <h1 className="text-[28px] font-semibold tracking-[-0.6px] text-[var(--color-ink)]">
          IntelliVault Chat
        </h1>
        <p className="text-[14px] font-400 text-[var(--color-ink-subtle)]">
          Ask questions about your workspace documents.
        </p>
      </header>

      {/* ── Chat area ───────────────────────────────── */}
      <div className="flex flex-col flex-1 min-h-0 rounded-lg border border-[var(--color-hairline)] overflow-hidden bg-[var(--color-surface-1)]">
        {/* Messages */}
        <Conversation className="flex-1 min-h-0">
          <ConversationContent className="px-8 py-8 flex flex-col gap-8">
            {/* Empty state */}
            {isEmpty && (
              <div className="flex flex-col items-center justify-center h-full gap-6 py-32">
                <div className="w-14 h-14 rounded-xl bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 flex items-center justify-center">
                  <Sparkles size={24} className="text-[var(--color-primary)]" />
                </div>
                <div className="flex flex-col items-center gap-2 max-w-sm">
                  <p className="text-[16px] font-500 text-[var(--color-ink)]">
                    Ask anything about your documents
                  </p>
                  <p className="text-[14px] text-[var(--color-ink-subtle)] text-center">
                    IntelliVault searches your uploaded files to answer
                    accurately.
                  </p>
                </div>

                {/* Suggested prompts */}
                <div className="flex flex-wrap gap-2 mt-4 justify-center max-w-2xl">
                  {[
                    "Summarize the key points",
                    "What are the main topics?",
                    "Find important dates or numbers",
                  ].map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => {
                        handleSubmit({ text: prompt });
                      }}
                      className="
                        px-3 py-2 rounded-md text-[13px] font-500
                        bg-[var(--color-surface-2)]
                        border border-[var(--color-hairline)]
                        text-[var(--color-ink-subtle)]
                        hover:text-[var(--color-ink-muted)]
                        hover:border-[var(--color-hairline-strong)]
                        hover:bg-[var(--color-surface-3)]
                        transition-all duration-150
                        cursor-pointer
                      "
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Message list */}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {/* Assistant avatar */}
                {message.role === "assistant" && (
                  <div
                    className="
                    shrink-0 w-8 h-8 rounded-md mt-1
                    bg-[var(--color-primary)]/10
                    border border-[var(--color-primary)]/20
                    flex items-center justify-center
                  "
                  >
                    <Bot size={16} className="text-[var(--color-primary)]" />
                  </div>
                )}

                <div
                  className={`flex flex-col gap-2 max-w-[75%] ${message.role === "user" ? "items-end" : "items-start"}`}
                >
                  {message.parts.map((part, i) => {
                    console.log(part);
                    switch (part.type) {
                      case "text":
                        return (
                          <Fragment key={`${message.id}-${i}`}>
                            <Message from={message.role}>
                              <MessageContent
                                className={`
                                  px-4 py-3 rounded-lg text-[14px] leading-relaxed font-400
                                  ${
                                    message.role === "user"
                                      ? "bg-[var(--color-primary)] text-white rounded-br-md"
                                      : "bg-[var(--color-surface-2)] text-[var(--color-ink)] rounded-bl-md border border-[var(--color-hairline)]"
                                  }
                                `}
                              >
                                <Response>{part.text}</Response>
                              </MessageContent>
                            </Message>
                          </Fragment>
                        );

                      case "tool-searchKnowledgeBase": {
                        const callId = part.toolCallId;

                        switch (part.state) {
                          case "output-available":
                            const results = part.output as Array<{
                              content: string;
                              source: string;
                              chunkId: string;
                            }>;
                            console.log(results);

                            if (!results || results.length === 0) return null;

                            const uniqueSet = [
                              ...new Set(results?.map((r) => r.source)),
                            ];

                            return (
                              <div
                                key={`${callId}-${i}`}
                                className="flex flex-wrap gap-2 mt-2"
                              >
                                {uniqueSet?.map((r) => (
                                  <CitationChip key={r} source={r} />
                                ))}
                              </div>
                            );

                          default:
                            return null;
                        }
                      }
                      default:
                        return null;
                    }
                  })}
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex gap-4 justify-start">
                <div
                  className="
                  shrink-0 w-8 h-8 rounded-md mt-1
                  bg-[var(--color-primary)]/10
                  border border-[var(--color-primary)]/20
                  flex items-center justify-center
                "
                >
                  <Bot size={16} className="text-[var(--color-primary)]" />
                </div>
                <div
                  className="
                  flex items-center gap-2
                  px-4 py-3 rounded-lg rounded-bl-md
                  bg-[var(--color-surface-2)]
                  border border-[var(--color-hairline)]
                "
                >
                  <Loader2
                    size={16}
                    className="text-[var(--color-primary)] animate-spin"
                  />
                  <span className="text-[14px] text-[var(--color-ink-subtle)] font-400">
                    Searching documents...
                  </span>
                </div>
              </div>
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        {/* ── Input bar ───────────────────────────────── */}
        <div className="shrink-0 border-t border-[var(--color-hairline)] p-5 bg-[var(--color-surface-1)] flex flex-col gap-3">
          <PromptInput
            onSubmit={handleSubmit}
            className="
              rounded-md
              bg-[var(--color-surface-2)]
              border border-[var(--color-hairline)]
              focus-within:border-[var(--color-hairline-strong)]
              focus-within:ring-2 focus-within:ring-[var(--color-primary-focus)]/50
              transition-all duration-150
            "
          >
            <PromptInputBody>
              <PromptInputTextarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question about your documents..."
                className="
                  bg-transparent border-none outline-none
                  text-[14px] font-400 text-[var(--color-ink)]
                  placeholder:text-[var(--color-ink-tertiary)]
                  resize-none min-h-[44px] max-h-[160px]
                  px-4 py-3
                "
              />
            </PromptInputBody>
            <PromptInputToolbar className="px-3 pb-2 flex items-center justify-between">
              <PromptInputTools />
              <PromptInputSubmit
                className="
                  text-[13px] px-4 py-2 min-h-[32px]
                  disabled:opacity-40 disabled:cursor-not-allowed
                "
              />
            </PromptInputToolbar>
          </PromptInput>

          <p className="text-center text-[12px] text-[var(--color-ink-tertiary)]">
            Answers are grounded in your workspace documents only.
          </p>
        </div>
      </div>
    </div>
  );
}
