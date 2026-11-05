import { useCallback, useEffect, useRef, useState } from "react";

interface UseStreamBindingOptions {
  onDimensionsChange?: (aspectRatio: number) => void;
  onPlayingChange?: (playing: boolean) => void;
  onReadyChange?: (ready: boolean) => void;
}

interface UseStreamBindingResult {
  isPlaying: boolean;
  isReady: boolean;
}

export function useStreamBinding(
  videoElement: HTMLVideoElement | null,
  stream: MediaStream | null,
  {
    onDimensionsChange,
    onReadyChange,
    onPlayingChange,
  }: UseStreamBindingOptions = {}
): UseStreamBindingResult {
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const readyRef = useRef(false);
  const playingRef = useRef(false);
  const onDimensionsChangeRef = useRef(onDimensionsChange);
  const onReadyChangeRef = useRef(onReadyChange);
  const onPlayingChangeRef = useRef(onPlayingChange);

  useEffect(() => {
    onDimensionsChangeRef.current = onDimensionsChange;
  }, [onDimensionsChange]);

  useEffect(() => {
    onReadyChangeRef.current = onReadyChange;
  }, [onReadyChange]);

  useEffect(() => {
    onPlayingChangeRef.current = onPlayingChange;
  }, [onPlayingChange]);

  const setReady = useCallback((nextReady: boolean) => {
    if (readyRef.current === nextReady) return;
    readyRef.current = nextReady;
    setIsReady(nextReady);
    onReadyChangeRef.current?.(nextReady);
  }, []);

  const setPlaying = useCallback((nextPlaying: boolean) => {
    if (playingRef.current === nextPlaying) return;
    playingRef.current = nextPlaying;
    setIsPlaying(nextPlaying);
    onPlayingChangeRef.current?.(nextPlaying);
  }, []);

  const updateDimensions = useCallback((video: HTMLVideoElement) => {
    if (!(video.videoWidth > 0 && video.videoHeight > 0)) return;
    onDimensionsChangeRef.current?.(video.videoWidth / video.videoHeight);
  }, []);

  const updateReadiness = useCallback(
    (video: HTMLVideoElement) => {
      updateDimensions(video);
      const hasDimensions = video.videoWidth > 0 && video.videoHeight > 0;
      setReady(
        hasDimensions || video.readyState >= HTMLMediaElement.HAVE_METADATA
      );
    },
    [setReady, updateDimensions]
  );

  useEffect(() => {
    const video = videoElement;
    if (!video) return;

    if (video.srcObject !== stream) {
      video.srcObject = stream;
      setReady(false);
      setPlaying(false);
    }

    if (stream) {
      // Warm streams may not re-fire metadata events on re-attach.
      updateReadiness(video);
    }

    const handleReady = () => {
      updateReadiness(video);
    };

    const handlePlaying = () => {
      setPlaying(true);
      updateReadiness(video);
    };

    const handlePause = () => {
      setPlaying(false);
    };

    video.addEventListener("loadedmetadata", handleReady);
    video.addEventListener("loadeddata", handleReady);
    video.addEventListener("resize", handleReady);
    video.addEventListener("playing", handlePlaying);
    video.addEventListener("pause", handlePause);

    return () => {
      video.removeEventListener("loadedmetadata", handleReady);
      video.removeEventListener("loadeddata", handleReady);
      video.removeEventListener("resize", handleReady);
      video.removeEventListener("playing", handlePlaying);
      video.removeEventListener("pause", handlePause);

      if (video.srcObject === stream) {
        video.srcObject = null;
      }
    };
  }, [videoElement, stream, setPlaying, setReady, updateReadiness]);

  return { isPlaying, isReady };
}
