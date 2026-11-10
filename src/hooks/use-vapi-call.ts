"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { preconnect } from "react-dom";

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

  // Current connection step while connecting.
  const [progress, setProgress] = useState("");

  // null until checked; false if the microphone is blocked.
  const [micAllowed, setMicAllowed] = useState<
    boolean | null
  >(null);

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

  /**
   * Free work done before the call: load the SDK and
   * open a connection to Vapi, so Start is quicker.
   */
  const preload = useCallback(async () => {
    preconnect("https://api.vapi.ai");
    await getVapi();
  }, [getVapi]);

  /**
   * preload(), plus ask for the microphone now
   * rather than in the middle of starting the call.
   * Nothing is billed: no call exists yet.
   */
  const prepare = useCallback(async () => {
    await preload();

    try {
      const stream =
        await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
      stream.getTracks().forEach((track) => track.stop());
      setMicAllowed(true);
    } catch {
      setMicAllowed(false);
    }
  }, [preload]);

  /**
   * Start with a saved assistant's id, or with a
   * full assistant configuration (voice previews).
   */
  const start = useCallback(
    async (assistant: string | Record<string, unknown>) => {
      setError("");
      setState("connecting");
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
    micAllowed,
    callId,
    preload,
    prepare,
    start,
    stop,
    toggleMute,
  };
}
