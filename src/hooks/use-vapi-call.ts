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

// What the trainee sees while a call is connecting.
const PROGRESS_LABELS: Record<string, string> = {
  "web-call-creation": "Calling the customer...",
  "daily-call-object-creation": "Setting up audio...",
  "mobile-permissions": "Checking your microphone...",
  "daily-call-join": "Connecting audio...",
};

interface VapiTranscriptMessage {
  type?: string;
  role?: string;
  transcriptType?: string;
  transcript?: string;
}

/**
 * One Vapi web call: start, mute, hang up, and
 * the live transcript. onEnded runs when the call
 * ends, whoever hung up. A call that drops before
 * the customer says anything does not count: it
 * shows an error and can be started again.
 */
export function useVapiCall(onEnded?: () => void) {
  const vapiRef = useRef<Vapi | null>(null);
  const callIdRef = useRef<string | null>(null);
  const onEndedRef = useRef(onEnded);
  // Whether the customer spoke, and whether the
  // trainee hung up, in the current call.
  const customerSpokeRef = useRef(false);
  const hangingUpRef = useRef(false);

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

  // Current connection step while connecting.
  const [progress, setProgress] = useState("");

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

    vapi.on("call-start", () => {
      setState("live");
      setProgress("");
    });

    vapi.on(
      "call-start-progress",
      (event: { stage?: string }) => {
        const label =
          PROGRESS_LABELS[event.stage ?? ""];
        if (label) {
          setProgress(label);
        }
      },
    );

    vapi.on("call-end", () => {
      setCustomerSpeaking(false);
      setProgress("");

      if (
        !hangingUpRef.current &&
        !customerSpokeRef.current
      ) {
        setError(
          "The call dropped before the customer answered. Start the call again.",
        );
        setState("error");
        return;
      }

      setState("ended");
      onEndedRef.current?.();
    });

    vapi.on("speech-start", () => {
      customerSpokeRef.current = true;
      setCustomerSpeaking(true);
    });

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

        if (message.role !== "user") {
          customerSpokeRef.current = true;
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

  /**
   * Start with a saved assistant's id, or with a
   * full assistant configuration (voice previews).
   */
  const start = useCallback(
    async (assistant: string | Record<string, unknown>) => {
      setError("");
      setState("connecting");
      setTranscript([]);
      customerSpokeRef.current = false;
      hangingUpRef.current = false;
      setProgress("Calling the customer...");

      try {
        const vapi = await getVapi();
        const call = await vapi.start(
          assistant as Parameters<Vapi["start"]>[0],
        );

        if (!call?.id) {
          throw new Error("No call was started.");
        }

        callIdRef.current = call.id;
      } catch {
        setError(
          "Could not start the call. Allow microphone access and try again.",
        );
        setState("error");
        setProgress("");
      }
    },
    [getVapi],
  );

  const callId = useCallback(
    () => callIdRef.current,
    [],
  );

  const stop = useCallback(async () => {
    hangingUpRef.current = true;
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
    progress,
    callId,
    start,
    stop,
    toggleMute,
  };
}
