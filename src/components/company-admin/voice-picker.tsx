"use client";

import { useEffect, useState } from "react";
import { Square, Volume2 } from "lucide-react";

import { useVapiCall } from "@/hooks/use-vapi-call";
import { voiceAvailable } from "@/services/simulation-service";
import {
  getVoicePreview,
  getVoices,
  type VoiceOption,
} from "@/services/training-service";

interface VoicePickerProps {
  value: string | null;
  onChange: (voiceId: string | null) => void;
  /** Scenario fields that shape how the customer sounds. */
  persona: string;
  customerName: string | null;
  customerEmotion: string | null;
  description: string;
  selectClassName: string;
}

/**
 * Choose the scenario's voice and hear it: the
 * customer introduces their problem in that voice
 * and emotion (a short live call).
 */
export function VoicePicker({
  value,
  onChange,
  persona,
  customerName,
  customerEmotion,
  description,
  selectClassName,
}: VoicePickerProps) {
  const [voices, setVoices] = useState<VoiceOption[]>([]);
  const [loadError, setLoadError] = useState("");
  const [previewError, setPreviewError] = useState("");
  const [starting, setStarting] = useState(false);

  const call = useVapiCall();
  const { preload } = call;
  const playing =
    call.state === "connecting" || call.state === "live";

  // Load the voice SDK early so previews start faster.
  useEffect(() => {
    if (voiceAvailable) {
      void preload();
    }
  }, [preload]);

  useEffect(() => {
    getVoices()
      .then(setVoices)
      .catch((err) =>
        setLoadError(
          err instanceof Error
            ? err.message
            : "Unable to load the voices.",
        ),
      );
  }, []);

  async function preview() {
    setPreviewError("");
    setStarting(true);

    try {
      const config = await getVoicePreview({
        voice_id: value,
        persona,
        customer_name: customerName,
        customer_emotion: customerEmotion,
        description,
      });

      await call.start(config);
    } catch (err) {
      setPreviewError(
        err instanceof Error
          ? err.message
          : "Unable to play the preview.",
      );
    } finally {
      setStarting(false);
    }
  }

  return (
    <div>
      <label
        htmlFor="scenario-voice"
        className="mb-2 block text-sm font-medium text-[var(--usus-text)]"
      >
        Voice
      </label>

      <div className="flex flex-col gap-2 sm:flex-row">
        <select
          id="scenario-voice"
          value={value ?? ""}
          onChange={(event) =>
            onChange(event.target.value || null)
          }
          className={selectClassName}
        >
          <option value="">Default voice</option>
          {voices.map((voice) => (
            <option key={voice.id} value={voice.id}>
              {voice.name} ({voice.gender})
            </option>
          ))}
        </select>

        {voiceAvailable && (
          <button
            type="button"
            onClick={playing ? () => void call.stop() : preview}
            disabled={starting}
            className="flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg border border-[var(--usus-primary)] px-4 py-2 text-sm font-medium text-[var(--usus-text)] transition-colors hover:bg-[var(--usus-primary-soft)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {playing ? (
              <>
                <Square size={14} />
                Stop
              </>
            ) : (
              <>
                <Volume2 size={15} />
                {starting ? "Starting..." : "Hear this voice"}
              </>
            )}
          </button>
        )}
      </div>

      <p className="mt-1 text-xs text-[var(--usus-text-muted)]">
        The customer introduces their problem in this
        voice, with the persona and emotion above. Allow
        the microphone if asked.
      </p>

      {(loadError || previewError || call.error) && (
        <p
          role="alert"
          className="mt-1 text-xs text-[var(--usus-danger)]"
        >
          {loadError || previewError || call.error}
        </p>
      )}
    </div>
  );
}
