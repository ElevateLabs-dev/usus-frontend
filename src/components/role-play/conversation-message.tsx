import type { ConversationMessage } from "@/types/role-play";

interface ConversationMessageProps {
  message: ConversationMessage;
  customerName: string;
}

export function ConversationMessage({
  message,
  customerName,
}: ConversationMessageProps) {
  const isCustomer = message.sender === "customer";

  return (
    <div
      className={`flex ${
        isCustomer ? "justify-start" : "justify-end"
      }`}
    >
      <div className="max-w-[85%] sm:max-w-[75%]">
        <p
          className={`
            mb-1 text-xs font-medium
            text-[var(--usus-text-muted)]
            ${!isCustomer ? "text-right" : ""}
          `}
        >
          {isCustomer ? customerName : "You"}
        </p>

        <div
          className={`
            rounded-2xl px-4 py-3
            text-sm leading-6
            ${
              isCustomer
                ? `
                  rounded-tl-md
                  bg-[var(--usus-muted)]
                  text-[var(--usus-text)]
                `
                : `
                  rounded-tr-md
                  bg-[var(--usus-primary)]
                  text-[#111111]
                `
            }
          `}
        >
          {message.content}
        </div>

        <p
          className={`
            mt-1 text-[10px]
            text-[var(--usus-text-soft)]
            ${!isCustomer ? "text-right" : ""}
          `}
        >
          {message.timestamp}
        </p>
      </div>
    </div>
  );
};