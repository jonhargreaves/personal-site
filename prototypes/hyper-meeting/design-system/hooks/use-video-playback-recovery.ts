import { delay, randomInt } from "es-toolkit";
import { useCallback, useEffect, useRef, useState } from "react";

/** Reasons why recovery was triggered */
export type RecoveryReason =
  | "play_rejected"
  | "no_playing_event"
  | "stalled"
  | "error"
  | "track_ended";

/**
 * The recovery lifecycle as one discriminated phase: healthy and recovering
 * are mutually exclusive by construction, and a terminal failure is a real
 * state instead of a callback-only signal consumers must shadow.
 */
export type VideoPlaybackRecoveryState =
  | { readonly status: "idle" }
  | { readonly status: "healthy" }
  | {
      readonly status: "recovering";
      readonly attempt: number;
      readonly reason: RecoveryReason;
    }
  | {
      readonly status: "failed";
      readonly attempts: number;
      readonly reason: RecoveryReason;
    };

export interface UseVideoPlaybackRecoveryOptions {
  /**
   * Base delay (ms) for exponential backoff.
   * @default 250
   */
  baseDelay?: number;
  /**
   * Whether recovery is enabled.
   * @default true
   */
  enabled?: boolean;
  /**
   * Number of recovery attempts before calling onEscalate.
   * @default 3
   */
  escalateAfterAttempts?: number;
  /**
   * Maximum total recovery attempts before giving up.
   * @default 8
   */
  maxAttempts?: number;
  /**
   * Maximum delay (ms) for exponential backoff.
   * @default 10000
   */
  maxDelay?: number;
  /**
   * Called when recovery attempts exceed the escalation threshold.
   * Use this to trigger more aggressive recovery (e.g., reacquire camera).
   */
  onEscalate?: (reason: RecoveryReason) => void;
  /**
   * Called when recovery fails after max attempts.
   */
  onGaveUp?: (reason: RecoveryReason) => void;
  /**
   * Called when recovery succeeds.
   */
  onRecovered?: () => void;
  /**
   * Timeout (ms) to wait for `playing` event after srcObject assignment.
   * If not reached, treat as stuck.
   * @default 2000
   */
  playingTimeout?: number;
}

/**
 * Calculates exponential backoff delay with jitter.
 */
export function calculateBackoffDelay(
  attempt: number,
  baseDelay: number,
  maxDelay: number
): number {
  // Exponential: baseDelay * 2^attempt
  const exponential = baseDelay * 2 ** attempt;
  // Clamp to maxDelay
  const clamped = Math.min(exponential, maxDelay);
  // Add jitter: ±25%
  const jitter = randomInt(
    Math.floor(clamped * 0.75),
    Math.floor(clamped * 1.25)
  );
  return jitter;
}

/**
 * Hook to detect and recover from stuck video playback.
 *
 * Monitors a video element for playback issues and automatically attempts
 * recovery using exponential backoff. If recovery fails repeatedly, it
 * escalates to allow more aggressive recovery (e.g., reacquiring the camera).
 *
 * @example
 * ```tsx
 * const videoRef = useRef<HTMLVideoElement>(null);
 * const { state } = useVideoPlaybackRecovery(videoRef, stream, {
 *   onEscalate: (reason) => {
 *     // Trigger camera reacquisition
 *     media.store.trigger.updateCamera();
 *   },
 * });
 * ```
 */
export function useVideoPlaybackRecovery(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  stream: MediaStream | null,
  options: UseVideoPlaybackRecoveryOptions = {}
) {
  const {
    playingTimeout = 2000,
    baseDelay = 250,
    maxDelay = 10_000,
    escalateAfterAttempts = 3,
    maxAttempts = 8,
    enabled = true,
    onEscalate,
    onRecovered,
    onGaveUp,
  } = options;

  const [state, setState] = useState<VideoPlaybackRecoveryState>({
    status: "idle",
  });

  // Track whether we're in a recovery cycle
  const recoveryInProgressRef = useRef(false);
  // Abort controller for cleanup
  const abortRef = useRef<AbortController | null>(null);
  // Track stream identity to reset on stream change
  const streamIdRef = useRef<string | null>(null);
  // Track if we've already escalated this cycle
  const escalatedRef = useRef(false);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    recoveryInProgressRef.current = false;
    escalatedRef.current = false;
    setState({ status: "idle" });
  }, []);

  /**
   * Attempts to recover playback by rebinding srcObject and calling play().
   */
  const attemptRecovery = useCallback(
    async (
      video: HTMLVideoElement,
      _reason: RecoveryReason,
      currentStream: MediaStream,
      signal: AbortSignal
    ): Promise<boolean> => {
      if (signal.aborted) return false;

      // Step 1: Try simple play() first
      try {
        await video.play();
        // Check if we actually got frames
        if (video.videoWidth > 0 && video.videoHeight > 0) {
          return true;
        }
      } catch {
        // play() rejected, continue to rebind
      }

      if (signal.aborted) return false;

      // Step 2: Rebind srcObject
      video.srcObject = null;

      // Small delay to let browser process the null assignment
      await delay(50);
      if (signal.aborted) return false;

      video.srcObject = currentStream;

      // Step 3: Try play() again
      try {
        await video.play();
        // Check for valid dimensions
        if (video.videoWidth > 0 && video.videoHeight > 0) {
          return true;
        }
        // Wait a bit more for dimensions
        await delay(100);
        if (signal.aborted) return false;
        return video.videoWidth > 0 && video.videoHeight > 0;
      } catch {
        return false;
      }
    },
    []
  );

  /**
   * Main recovery loop with exponential backoff.
   */
  const runRecoveryLoop = useCallback(
    async (
      video: HTMLVideoElement,
      reason: RecoveryReason,
      currentStream: MediaStream
    ) => {
      if (recoveryInProgressRef.current) return;
      recoveryInProgressRef.current = true;
      escalatedRef.current = false;

      // Create new abort controller for this recovery cycle
      abortRef.current?.abort();
      const abortController = new AbortController();
      abortRef.current = abortController;
      const signal = abortController.signal;

      let attempt = 0;

      while (attempt < maxAttempts && !signal.aborted) {
        setState({ attempt: attempt + 1, reason, status: "recovering" });

        const success = await attemptRecovery(
          video,
          reason,
          currentStream,
          signal
        );

        if (signal.aborted) break;

        if (success) {
          setState({ status: "healthy" });
          recoveryInProgressRef.current = false;
          onRecovered?.();
          return;
        }

        attempt += 1;

        // Check if we should escalate
        if (attempt >= escalateAfterAttempts && !escalatedRef.current) {
          escalatedRef.current = true;
          onEscalate?.(reason);
        }

        // Calculate backoff delay
        const backoffDelay = calculateBackoffDelay(
          attempt,
          baseDelay,
          maxDelay
        );

        // Wait before next attempt
        await delay(backoffDelay);
      }

      // Gave up after max attempts
      if (!signal.aborted) {
        setState({ attempts: attempt, reason, status: "failed" });
        recoveryInProgressRef.current = false;
        onGaveUp?.(reason);
      }
    },
    [
      maxAttempts,
      escalateAfterAttempts,
      baseDelay,
      maxDelay,
      attemptRecovery,
      onEscalate,
      onRecovered,
      onGaveUp,
    ]
  );

  useEffect(() => {
    if (!enabled) {
      // Clear recovery state when its external media resource changes.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      reset();
      return;
    }

    const video = videoRef.current;
    if (!(video && stream)) {
      reset();
      return;
    }

    // Check if stream changed
    const newStreamId = stream.id;
    if (streamIdRef.current !== newStreamId) {
      streamIdRef.current = newStreamId;
      reset();
    }

    // Create abort controller for this effect
    const abortController = new AbortController();
    const signal = abortController.signal;

    let playingTimeoutId: ReturnType<typeof setTimeout> | null = null;
    let isPlaying = false;
    let hasDimensions = false;

    const checkHealthy = () => {
      if (isPlaying && hasDimensions) {
        if (recoveryInProgressRef.current) {
          // The element recovered on its own: stop the loop instead of
          // rebinding a playing video until it exhausts its attempts and
          // reports a failure over working playback.
          abortRef.current?.abort();
          recoveryInProgressRef.current = false;
        }
        setState({ status: "healthy" });
      }
    };

    const handlePlaying = () => {
      isPlaying = true;
      if (playingTimeoutId) {
        clearTimeout(playingTimeoutId);
        playingTimeoutId = null;
      }
      // Check dimensions
      hasDimensions = video.videoWidth > 0 && video.videoHeight > 0;
      checkHealthy();
    };

    const handleLoadedMetadata = () => {
      hasDimensions = video.videoWidth > 0 && video.videoHeight > 0;
      checkHealthy();
    };

    const handleStalled = () => {
      if (!recoveryInProgressRef.current && isPlaying) {
        runRecoveryLoop(video, "stalled", stream);
      }
    };

    const handleError = () => {
      if (!recoveryInProgressRef.current) {
        runRecoveryLoop(video, "error", stream);
      }
    };

    // Track track end events
    const handleTrackEnded = () => {
      if (!recoveryInProgressRef.current) {
        runRecoveryLoop(video, "track_ended", stream);
      }
    };

    // Add event listeners
    video.addEventListener("playing", handlePlaying);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("stalled", handleStalled);
    video.addEventListener("error", handleError);

    // Listen to track ended events
    const videoTracks = stream.getVideoTracks();
    for (const track of videoTracks) {
      track.addEventListener("ended", handleTrackEnded);
    }

    // Start watchdog timer for initial playback
    playingTimeoutId = setTimeout(() => {
      if (signal.aborted) return;
      if (!(isPlaying && hasDimensions)) {
        // Video hasn't started playing within timeout
        runRecoveryLoop(video, "no_playing_event", stream);
      }
    }, playingTimeout);

    // Try initial play
    video.play().catch((error) => {
      if (signal.aborted) return;
      // AbortError is expected when stream changes rapidly
      if (error.name !== "AbortError" && !recoveryInProgressRef.current) {
        runRecoveryLoop(video, "play_rejected", stream);
      }
    });

    return () => {
      abortController.abort();
      // Ensure any in-flight recovery loop is stopped too
      abortRef.current?.abort();
      recoveryInProgressRef.current = false;
      if (playingTimeoutId) {
        clearTimeout(playingTimeoutId);
      }
      video.removeEventListener("playing", handlePlaying);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("stalled", handleStalled);
      video.removeEventListener("error", handleError);

      for (const track of videoTracks) {
        track.removeEventListener("ended", handleTrackEnded);
      }
    };
  }, [enabled, stream, videoRef, playingTimeout, reset, runRecoveryLoop]);

  return { state, reset };
}
