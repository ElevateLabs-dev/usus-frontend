"use client";

import { useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Phone,
  PhoneOff,
} from "lucide-react";

import type {
  CallState,
  TranscriptLine,
} from "@/hooks/use-vapi-call";

interface VoiceCallProps {
  customerName: string;
  state: CallState;
  error: string;
  muted: boolean;
  customerSpeaking: boolean;
  transcript: TranscriptLine[];
  starting: boolean;
  onStart: () => void;
  onToggleMute: () => void;
  onHangUp: () => void;
}

const STATE_LABELS: Record<CallState, string> = {
  idle: "Ready to call",
  connecting: "Connecting...",
  live: "On the call",
  ended: "Call ended",
  error: "Call interrupted",
};

export function VoiceCall({
  customerName,
  state,
  error,
  muted,
  customerSpeaking,
  transcript,
  starting,
  onStart,
  onToggleMute,
  onHangUp,
}: VoiceCallProps) {
  const transcriptEnd =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    transcriptEnd.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [transcript.length]);

  const live = state === "live";

  return (
    <section className="flex min-h-[520px] flex-col rounded-2xl border border-[var(--usus-border)] bg-[var(--usus-surface)] shadow-[var(--usus-shadow)]">
      {/* Call status */}
      <div className="flex flex-col items-center border-b border-[var(--usus-border)] px-6 py-8 text-center">
        <div
          className={[
            "flex h-20 w-20 items-center justify-center rounded-full border-2 transition-all duration-300",
            live && customerSpeaking
              ? "scale-110 border-[var(--usus-primary)] bg-[var(--usus-primary-soft)]"
              : "border-[var(--usus-border)] bg-[var(--usus-background)]",
          ].join(" ")}
        >
          <span className="text-2xl font-semibold text-[var(--usus-text)]">
            {customerName.charAt(0).toUpperCase()}
          </span>
        </div>

        <p className="mt-4 text-base font-semibold text-[var(--usus-text)]">
          {customerName}
        </p>

        <p className="mt-1 text-xs text-[var(--usus-text-muted)]">
          {live && customerSpeaking
            ? `${customerName} is speaking...`
            : STATE_LABELS[state]}
        </p>

        {error && (
          <p
            role="alert"
            className="mt-3 text-xs text-[var(--usus-danger)]"
          >
            {error}
          </p>
        )}

        <div className="mt-6 flex items-center gap-3">
          {(state === "idle" || state === "error") && (
            <button
              type="button"
              onClick={onStart}
              disabled={starting}
              className="flex cursor-pointer items-center gap-2 rounded-xl bg-[var(--usus-primary)] px-5 py-3 text-sm font-bold text-[#111111] transition-all hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Phone size={16} />
              {starting
                ? "Starting..."
                : state === "error"
                  ? "Call again"
                  : "Start call"}
            </button>
          )}

          {(state === "connecting" || live) && (
            <>
              <button
                type="button"
                onClick={onToggleMute}
                disabled={!live}
                aria-label={muted ? "Unmute" : "Mute"}
                className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[var(--usus-border)] text-[var(--usus-text)] transition-colors hover:bg-[var(--usus-sidebar-hover)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {muted ? (
                  <MicOff size={18} />
                ) : (
                  <Mic size={18} />
                )}
              </button>

              <button
                type="button"
                onClick={onHangUp}
                className="flex cursor-pointer items-center gap-2 rounded-xl bg-[var(--usus-danger)] px-5 py-3 text-sm font-bold text-white transition-all hover:brightness-95"
              >
                <PhoneOff size={16} />
                Hang up & get feedback
              </button>
            </>
          )}
        </div>

        {state === "idle" && (
          <p className="mt-4 max-w-sm text-[11px] leading-5 text-[var(--usus-text-muted)]">
            Your browser will ask to use your
            microphone. Answer the call the way you
            would with a real customer.
          </p>
        )}
      </div>

      {/* Live transcript */}
      <div className="flex-1 space-y-3 overflow-y-auto px-6 py-5">
        {transcript.length === 0 ? (
          <p className="text-center text-xs text-[var(--usus-text-muted)]">
            The conversation will appear here.
          </p>
        ) : (
          transcript.map((line) => (
            <div
              key={line.id}
              className={
                line.speaker === "trainee"
                  ? "ml-auto max-w-[80%] rounded-2xl bg-[var(--usus-primary-soft)] px-4 py-2 text-sm text-[var(--usus-text)]"
                  : "mr-auto max-w-[80%] rounded-2xl bg-[var(--usus-background)] px-4 py-2 text-sm text-[var(--usus-text)]"
              }
            >
              <p className="text-[10px] font-semibold text-[var(--usus-text-muted)]">
                {line.speaker === "trainee"
                  ? "You"
                  : customerName}
              </p>
              {line.text}
            </div>
          ))
        )}

        <div ref={transcriptEnd} />
      </div>
    </section>
  );
}
