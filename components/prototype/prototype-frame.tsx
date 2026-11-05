"use client";

import { useEffect, useRef, useState } from "react";
import MeetingLoading from "@/components/hyper-meeting/meeting-loading";
import { useLoadingPhase } from "./use-loading-phase";
import styles from "./prototype-frame.module.css";

type FrameProps = { src: string; title: string; width: number; height: number; viewportReady: boolean };

function PrototypeDocument({ src, title, width, height, frameWidth, onRetry }: Omit<FrameProps, "viewportReady"> & {
  frameWidth: number;
  onRetry: () => void;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [ready, setReady] = useState(false);
  const [completed, setCompleted] = useState(0);
  const phase = useLoadingPhase(!ready);
  const viewportStyle = { width, height, transform: `scale(${Math.min(1, frameWidth / width)})` };

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.origin !== new URL(src, window.location.href).origin ||
          event.source !== iframeRef.current?.contentWindow) return;
      if (event.data?.type === "hyper-meeting-progress" &&
          Number.isInteger(event.data.completed) && event.data.completed >= 0 && event.data.completed <= 3) {
        setCompleted(event.data.completed);
      }
      if (event.data?.type === "hyper-meeting-ready") {
        setReady(true);
        setLoaded(true);
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [src]);

  return (
    <>
      <div className="absolute inset-0" aria-busy={!ready}>
        {!loaded && <div className="absolute inset-0 origin-top-left" style={viewportStyle}><MeetingLoading /></div>}
        <iframe
          ref={iframeRef}
          src={src}
          title={title}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          // The development React Grab script annotates same-origin iframes before hydration.
          suppressHydrationWarning
          style={{ ...viewportStyle, visibility: loaded ? "visible" : "hidden" }}
          className="absolute inset-0 block max-w-none origin-top-left rounded-lg bg-neutral-950 outline outline-white/10 -outline-offset-1"
          allow="clipboard-write"
        />
      </div>
      {!ready && (
        <div className={phase === "initial" ? "sr-only" : styles.loadingStatus}>
          <p role="status" className="text-xs leading-5 text-white/70">
            {phase !== "initial" && (phase === "slow"
              ? `The meeting is taking longer to load. ${completed} of 3 sections ready. You can keep reading while it loads.`
              : `Preparing the meeting · ${completed} of 3 sections ready`)}
          </p>
          {phase === "slow" && <button type="button" onClick={onRetry} className="shrink-0 cursor-pointer rounded-lg border border-white/15 px-3 py-2 text-xs text-white/80 transition-[color,background-color] duration-150 hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none">Retry</button>}
        </div>
      )}
    </>
  );
}

export default function PrototypeFrame({ src, title, width, height, viewportReady }: FrameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [frameWidth, setFrameWidth] = useState(0);
  const [started, setStarted] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const resize = new ResizeObserver(([entry]) => setFrameWidth(entry.contentRect.width));
    resize.observe(container);
    let idle: number | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const intersection = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      intersection.disconnect();
      // Let the case study paint before starting the heavier document.
      if ("requestIdleCallback" in window) {
        idle = window.requestIdleCallback(() => setStarted(true), { timeout: 1000 });
      } else {
        timer = setTimeout(() => setStarted(true), 0);
      }
    }, { rootMargin: "200px" });
    intersection.observe(container);
    return () => {
      resize.disconnect();
      intersection.disconnect();
      if (idle !== undefined) window.cancelIdleCallback(idle);
      clearTimeout(timer);
    };
  }, []);

  const mounted = started && viewportReady && frameWidth > 0;
  return (
    <div ref={containerRef} className={`${styles.frame} relative w-full overflow-hidden rounded-lg bg-neutral-950`} style={viewportReady ? { maxWidth: width, aspectRatio: width / height } : undefined}>
      {mounted
        ? <PrototypeDocument key={attempt} src={src} title={title} width={width} height={height} frameWidth={frameWidth} onRetry={() => setAttempt((current) => current + 1)} />
        : <div className="absolute inset-0"><MeetingLoading /></div>}
    </div>
  );
}
