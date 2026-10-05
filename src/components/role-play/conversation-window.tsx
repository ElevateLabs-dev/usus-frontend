"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

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

interface SpeechRecognitionEventLike
  extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEventLike
  extends Event {
  error: string;
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult:
    | ((event: SpeechRecognitionEventLike) => void)
    | null;
  onerror:
    | ((
        event: SpeechRecognitionErrorEventLike,
      ) => void)
    | null;
  onend: (() => void) | null;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionInstance;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

export function ConversationWindow({
  messages,
  customerName,
  status,
  onSend,
}: ConversationWindowProps) {
  const messagesEndRef =
    useRef<HTMLDivElement>(null);

  const recognitionRef =
    useRef<SpeechRecognitionInstance | null>(
      null,
    );

  const [isListening, setIsListening] =
    useState(false);

  const [voiceText, setVoiceText] =
    useState("");

  const [voiceError, setVoiceError] =
    useState("");

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, status]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
      recognitionRef.current = null;
    };
  }, []);

  const isResponding =
    status === "customer-responding";

  const isDisabled =
    status === "sending" ||
    status === "customer-responding" ||
    status === "session-ended";

  const speechSupported =
    typeof window !== "undefined" &&
    Boolean(
      window.SpeechRecognition ||
        window.webkitSpeechRecognition,
    );

  function startVoiceRecording() {
    if (
      isDisabled ||
      isListening
    ) {
      return;
    }

    setVoiceError("");
    setVoiceText("");

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceError(
        "Voice input is not supported by this browser.",
      );
      return;
    }

    const recognition =
      new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (
      event,
    ) => {
      let transcript = "";

      for (
        let i = 0;
        i < event.results.length;
        i++
      ) {
        transcript +=
          event.results[i][0].transcript;
      }

      setVoiceText(
        transcript.trim(),
      );
    };

    recognition.onerror = (
      event,
    ) => {
      console.error(
        "Speech recognition error:",
        event.error,
      );

      setIsListening(false);

      if (
        event.error ===
        "not-allowed"
      ) {
        setVoiceError(
          "Microphone access was denied. Please allow microphone access and try again.",
        );
      } else if (
        event.error === "no-speech"
      ) {
        setVoiceError(
          "No speech was detected. Please try again.",
        );
      } else {
        setVoiceError(
          "Unable to capture your voice. Please try again.",
        );
      }

      recognitionRef.current =
        null;
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognitionRef.current =
      recognition;

    setIsListening(true);

    try {
      recognition.start();
    } catch (error) {
      console.error(
        "Unable to start speech recognition:",
        error,
      );

      setIsListening(false);
      recognitionRef.current =
        null;

      setVoiceError(
        "Unable to start voice input.",
      );
    }
  }

  function stopVoiceRecording() {
    if (!recognitionRef.current) {
      return;
    }

    recognitionRef.current.stop();
    setIsListening(false);
  }

  function cancelVoiceRecording() {
    if (recognitionRef.current) {
      recognitionRef.current.abort();
      recognitionRef.current = null;
    }

    setIsListening(false);
    setVoiceText("");
    setVoiceError("");
  }

  function sendVoiceMessage() {
    const message =
      voiceText.trim();

    if (!message || isDisabled) {
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    setIsListening(false);
    setVoiceText("");
    setVoiceError("");

    onSend(message);
  }

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
          <AiThinking
            customerName={customerName}
          />
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Voice input */}
      <div
        className="
          border-t
          border-[var(--usus-border)]
          px-4
          py-3
          sm:px-5
        "
      >
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            {isListening ? (
              <div className="flex items-center gap-2">
                <span
                  className="
                    h-2.5
                    w-2.5
                    animate-pulse
                    rounded-full
                    bg-red-500
                  "
                />

                <span className="text-xs font-medium text-[var(--usus-text)]">
                  Listening...
                </span>

                <span className="truncate text-xs text-[var(--usus-text-muted)]">
                  Speak naturally
                </span>
              </div>
            ) : voiceText ? (
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wide text-[var(--usus-text-muted)]">
                  Voice transcription
                </p>

                <p className="mt-1 line-clamp-2 text-sm text-[var(--usus-text)]">
                  {voiceText}
                </p>
              </div>
            ) : (
              <p className="text-xs text-[var(--usus-text-muted)]">
                Prefer speaking? Use the microphone to
                practise the conversation by voice.
              </p>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {isListening ? (
              <button
                type="button"
                onClick={stopVoiceRecording}
                className="
                  flex
                  h-10
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-red-300
                  bg-red-50
                  px-4
                  text-xs
                  font-semibold
                  text-red-600
                  transition-colors
                  hover:bg-red-100
                "
              >
                <span
                  className="
                    h-2
                    w-2
                    rounded-full
                    bg-red-500
                  "
                />

                Stop
              </button>
            ) : voiceText ? (
              <>
                <button
                  type="button"
                  onClick={
                    cancelVoiceRecording
                  }
                  disabled={isDisabled}
                  className="
                    flex
                    h-10
                    items-center
                    rounded-full
                    border
                    border-[var(--usus-border)]
                    bg-[var(--usus-surface)]
                    px-4
                    text-xs
                    font-medium
                    text-[var(--usus-text)]
                    transition-colors
                    hover:border-[var(--usus-danger)]
                    hover:text-[var(--usus-danger)]
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  Clear
                </button>

                <button
                  type="button"
                  onClick={
                    sendVoiceMessage
                  }
                  disabled={
                    isDisabled ||
                    !voiceText.trim()
                  }
                  className="
                    flex
                    h-10
                    items-center
                    gap-2
                    rounded-full
                    bg-[var(--usus-primary)]
                    px-4
                    text-xs
                    font-semibold
                    text-[#111111]
                    transition-all
                    hover:brightness-95
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  Send voice
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={
                  startVoiceRecording
                }
                disabled={
                  isDisabled ||
                  !speechSupported
                }
                aria-label="Start voice input"
                title={
                  speechSupported
                    ? "Speak your response"
                    : "Voice input is not supported"
                }
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[var(--usus-border)]
                  bg-[var(--usus-surface)]
                  text-[var(--usus-text)]
                  transition-all
                  hover:border-[var(--usus-primary)]
                  hover:bg-[var(--usus-sidebar-hover)]
                  hover:text-[var(--usus-primary)]
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line
                    x1="12"
                    x2="12"
                    y1="19"
                    y2="22"
                  />
                  <line
                    x1="8"
                    x2="16"
                    y1="22"
                    y2="22"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {voiceError && (
          <div
            role="alert"
            className="
              mt-3
              rounded-lg
              border
              border-[var(--usus-danger)]
              bg-[var(--usus-surface)]
              px-3
              py-2
              text-xs
              text-[var(--usus-danger)]
            "
          >
            {voiceError}
          </div>
        )}
      </div>

      {/* Existing text input */}
      <MessageInput
        disabled={isDisabled}
        onSend={onSend}
      />
    </section>
  );
};