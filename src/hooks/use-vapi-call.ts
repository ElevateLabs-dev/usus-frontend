"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import type Vapi from "@vapi-ai/web";

import { VAPI_PUBLIC_KEY } from "@/services/simulation-service";

export type CallState =
  | "idle"
  | "connecting"
  | "live"
  | "ended"
  | "error";

export interface TranscriptLine {
  id: string;
  speaker: "customer" | "trainee";
  text: string;
}

interface VapiTranscriptMessage {
  type?: string;
  role?: string;
  transcriptType?: string;
  transcript?: string;
}

/**
 * One Vapi web call: start, mute, hang up, and
 * the live transcript. onEnded runs when the call
 * ends, whoever hung up.
 */
export function useVapiCall(onEnded?: () => void) {
  const vapiRef = useRef<Vapi | null>(null);
  const callIdRef = useRef<string | null>(null);
  const onEndedRef = useRef(onEnded);

  useEffect(() => {
    onEndedRef.current = onEnded;
  }, [onEnded]);

  const [state, setState] =
    useState<CallState>("idle");

  const [error, setError] = useState("");

  const [muted, setMuted] = useState(false);

  const [customerSpeaking, setCustomerSpeaking] =
    useState(false);

  const [transcript, setTranscript] = useState<
    TranscriptLine[]
  >([]);

  /*
   * Load the SDK in the browser only.
   */
  const getVapi = useCallback(async () => {
    if (vapiRef.current) {
      return vapiRef.current;
    }

    const { default: VapiClient } = await import(
      "@vapi-ai/web"
    );

    const vapi = new VapiClient(VAPI_PUBLIC_KEY);

    vapi.on("call-start", () => setState("live"));

    vapi.on("call-end", () => {
      setState("ended");
      setCustomerSpeaking(false);
      onEndedRef.current?.();
    });

    vapi.on("speech-start", () =>
      setCustomerSpeaking(true),
    );

    vapi.on("speech-end", () =>
      setCustomerSpeaking(false),
    );

    vapi.on(
      "message",
      (message: VapiTranscriptMessage) => {
        if (
          message.type !== "transcript" ||
          message.transcriptType !== "final" ||
          !message.transcript
        ) {
          return;
        }

        const line: TranscriptLine = {
          id: `${Date.now()}-${Math.random()}`,
          speaker:
            message.role === "user"
              ? "trainee"
              : "customer",
          text: message.transcript,
        };

        setTranscript((current) => [
          ...current,
          line,
        ]);
      },
    );

    vapi.on("error", () => {
      setError(
        "The call was interrupted. Check your microphone and connection.",
      );
      setState("error");
    });

    vapiRef.current = vapi;
    return vapi;
  }, []);

  const start = useCallback(
    async (assistantId: string) => {
      setError("");
      setState("connecting");

      try {
        const vapi = await getVapi();
        const call = await vapi.start(assistantId);

        if (!call?.id) {
          throw new Error("No call was started.");
        }

        callIdRef.current = call.id;
      } catch {
        setError(
          "Could not start the call. Allow microphone access and try again.",
        );
        setState("error");
      }
    },
    [getVapi],
  );

  const stop = useCallback(async () => {
    await vapiRef.current?.stop();
  }, []);

  const toggleMute = useCallback(() => {
    const vapi = vapiRef.current;

    if (!vapi) {
      return;
    }

    const next = !vapi.isMuted();
    vapi.setMuted(next);
    setMuted(next);
  }, []);

  /*
   * Hang up if the page is left mid-call.
   */
  useEffect(() => {
    return () => {
      void vapiRef.current?.stop();
    };
  }, []);

  return {
    state,
    error,
    muted,
    customerSpeaking,
    transcript,
    callId: () => callIdRef.current,
    start,
    stop,
    toggleMute,
  };
}
