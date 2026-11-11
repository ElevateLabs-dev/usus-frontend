"use client";

import { useEffect, useRef } from "react";

import type {
  ConversationMessage,
  SimulationStatus,
} from "@/types/role-play";

import { ConversationMessage as Message } from "./conversation-message";
import { AiThinking } from "./ai-thinking";
import { MessageInput } from "./message-input";

interface ConversationWindowProps {
  messages: ConversationMessage[];
  customerName: string;
  status: SimulationStatus;
  onSend: (message: string) => void;
}

export function ConversationWindow({
  messages,
  customerName,
  status,
  onSend,
}: ConversationWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, status]);

  const isResponding =
    status === "customer-responding";

  const isDisabled =
    status === "sending" ||
    status === "customer-responding" ||
    status === "session-ended";

  return (
    <section
      className="
        flex min-h-[500px]
        flex-col
        overflow-hidden
        rounded-2xl
        border border-[var(--usus-border)]
        bg-[var(--usus-surface)]
        shadow-[var(--usus-shadow)]
        lg:min-h-[620px]
      "
    >
      {/* Header */}
      <div
        className="
          border-b border-[var(--usus-border)]
          px-5 py-4
        "
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--usus-text)]">
              Conversation
            </p>

            <p className="mt-0.5 text-xs text-[var(--usus-text-muted)]">
              Respond naturally to the customer.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-[var(--usus-text-muted)]">
            <span
              className="
                h-2
                w-2
                rounded-full
                bg-[var(--usus-primary)]
              "
            />

            Live
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        className="
          flex-1
          space-y-5
          overflow-y-auto
          p-5
          sm:p-6
        "
      >
        {messages.map((message) => (
          <Message
            key={message.id}
            message={message}
            customerName={customerName}
          />
        ))}

        {isResponding && (
          <AiThinking customerName={customerName} />
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Text input */}
      <MessageInput
        disabled={isDisabled}
        onSend={onSend}
      />
    </section>
  );
}