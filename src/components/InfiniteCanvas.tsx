import { useGesture } from "@use-gesture/react";
import { useCallback, useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { useGallery } from "../contentful/useGallery";
import { useTranslation } from "../i18n/translations";

const CELL_W = 280;
const CELL_H = 190;
const GAP = 220;
const STEP_X = CELL_W + GAP;
const STEP_Y = CELL_H + GAP;
const MARGIN = 3;
const KEYBOARD_STEP = 120;
const MEDIA_STYLE: CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
  userSelect: "none",
  WebkitUserSelect: "none",
  pointerEvents: "none",
};

const GalleryVideo = ({ url, isPlaying, onError }: { url: string; isPlaying: boolean; onError: () => void }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let isActive = true;
    if (isPlaying) {
      video.play().catch(error => {
        if (isActive && !(error instanceof DOMException && error.name === "AbortError")) onError();
      });
    } else {
      video.pause();
    }
    return () => {
      isActive = false;
      video.pause();
    };
  }, [isPlaying, onError, url]);

  return <video ref={videoRef} src={url} loop muted playsInline aria-hidden="true" tabIndex={-1} onError={onError} style={MEDIA_STYLE} />;
};

const InfiniteCanvas = () => {
  const text = useTranslation();
  const instructionsId = useId();
  const galleryState = useGallery();
  const mediaPool = galleryState.status === "ready" ? galleryState.media : [];
  const hasVideos = mediaPool.some(media => media.type === "video");
  const [isPlaying, setIsPlaying] = useState(true);
  const [hasMediaError, setHasMediaError] = useState(false);
  const handleMediaError = useCallback(() => setHasMediaError(true), []);
  const viewRef = useRef<HTMLDivElement>(null);
  const inertiaFrameRef = useRef<number | null>(null);
  const wheelFrameRef = useRef<number | null>(null);
  const wheelDeltaRef = useRef({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [viewW, setViewW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  const [viewH, setViewH] = useState(typeof window !== "undefined" ? window.innerHeight : 800);

  const stopMotion = () => {
    if (inertiaFrameRef.current !== null) {
      cancelAnimationFrame(inertiaFrameRef.current);
      inertiaFrameRef.current = null;
    }
    if (wheelFrameRef.current !== null) {
      cancelAnimationFrame(wheelFrameRef.current);
      wheelFrameRef.current = null;
    }
    wheelDeltaRef.current = { x: 0, y: 0 };
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget || event.defaultPrevented || event.nativeEvent.isComposing || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;

    let x = 0;
    let y = 0;
    switch (event.key) {
      case "ArrowLeft": x = KEYBOARD_STEP; break;
      case "ArrowRight": x = -KEYBOARD_STEP; break;
      case "ArrowUp": y = KEYBOARD_STEP; break;
      case "ArrowDown": y = -KEYBOARD_STEP; break;
      default: return;
    }

    event.preventDefault();
    stopMotion();
    setOffset((current) => ({ x: current.x + x, y: current.y + y }));
  };

  useGesture(
    {
      onDrag: ({ delta: [dx, dy] }) => {
        stopMotion();
        setOffset((o) => ({ x: o.x + dx, y: o.y + dy }));
      },
      onDragEnd: ({ velocity: [vx, vy] }) => {
        let velX = vx * 120;
        let velY = vy * 120;
        let last = performance.now();
        const step = (now: number) => {
          const dt = Math.min((now - last) / 1000, 0.05);
          last = now;
          velX *= Math.pow(0.0008, dt);
          velY *= Math.pow(0.0008, dt);
          if (Math.abs(velX) < 0.3 && Math.abs(velY) < 0.3) {
            inertiaFrameRef.current = null;
            return;
          }
          setOffset((o) => ({ x: o.x + velX * dt, y: o.y + velY * dt }));
          inertiaFrameRef.current = requestAnimationFrame(step);
        };
        inertiaFrameRef.current = requestAnimationFrame(step);
      },
      onWheel: ({ delta: [dx, dy] }) => {
        if (inertiaFrameRef.current !== null) {
          cancelAnimationFrame(inertiaFrameRef.current);
          inertiaFrameRef.current = null;
        }
        wheelDeltaRef.current.x -= dx;
        wheelDeltaRef.current.y -= dy;

        if (wheelFrameRef.current !== null) return;

        wheelFrameRef.current = requestAnimationFrame(() => {
          const wheelDelta = wheelDeltaRef.current;

          setOffset((o) => ({
            x: o.x + wheelDelta.x,
            y: o.y + wheelDelta.y,
          }));
          wheelDeltaRef.current = { x: 0, y: 0 };
          wheelFrameRef.current = null;
        });
      },
    },
    {
      target: viewRef,
      drag: { filterTaps: true, pointer: { keys: false } },
      wheel: { preventDefault: true },
      eventOptions: { passive: false },
    },
  );

  useEffect(() => {
    const el = viewRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const r = entries[0].contentRect;
      setViewW(r.width);
      setViewH(r.height);
    });
    observer.observe(el);
    return () => {
      observer.disconnect();

      if (inertiaFrameRef.current !== null) {
        cancelAnimationFrame(inertiaFrameRef.current);
      }
      if (wheelFrameRef.current !== null) {
        cancelAnimationFrame(wheelFrameRef.current);
      }
    };
  }, []);

  const colStart = Math.floor(-offset.x / STEP_X) - MARGIN;
  const colEnd = Math.ceil((-offset.x + viewW) / STEP_X) + MARGIN;
  const rowStart = Math.floor(-offset.y / STEP_Y) - MARGIN;
  const rowEnd = Math.ceil((-offset.y + viewH) / STEP_Y) + MARGIN;

  const cells = [];
  for (let i = rowStart; i < rowEnd; i++) {
    for (let j = colStart; j < colEnd; j++) {
      cells.push({ r: i, c: j });
    }
  }

  return (
    <div
      ref={viewRef}
      role="region"
      aria-label={text.gallery}
      aria-describedby={instructionsId}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="group w-full h-full overflow-hidden touch-none select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-neutral-700"
      style={{ background: "#F7F7F5", cursor: "default" }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
          willChange: "transform",
        }}
      >
        {mediaPool.length > 0 && cells.map(({ r, c }) => {
          const media = mediaPool[(Math.abs(r) * 7 + Math.abs(c) * 13) % mediaPool.length];
          const isVisible = c * STEP_X + offset.x < viewW && c * STEP_X + offset.x + CELL_W > 0
            && r * STEP_Y + offset.y < viewH && r * STEP_Y + offset.y + CELL_H > 0;
          return (
            <div
              key={`${r}-${c}`}
              style={{
                position: "absolute",
                left: c * STEP_X,
                top: r * STEP_Y,
                width: CELL_W,
                height: CELL_H,
                borderRadius: 8,
                overflow: "hidden",
                backgroundColor: "#e0e0e0",
              }}
            >
              {media.type === "image" ? (
                <img src={media.url} alt="" loading="eager" decoding="async" onError={handleMediaError} style={MEDIA_STYLE} />
              ) : isVisible ? (
                <GalleryVideo url={media.url} isPlaying={isPlaying} onError={handleMediaError} />
              ) : null}
            </div>
          );
        })}
      </div>
      {galleryState.status === "loading" && <p role="status" className="relative p-8">{text.loadingGallery}</p>}
      {galleryState.status === "unavailable" && <p role="status" className="relative p-8">{text.unavailableGallery}</p>}
      {galleryState.status === "error" && (
        <p role="alert" className="relative p-8">{galleryState.message}</p>
      )}
      {hasMediaError && <p role="alert" className="relative p-8">{text.galleryMediaError}</p>}
      <p id={instructionsId} className="sr-only group-focus-visible:not-sr-only group-focus-visible:absolute group-focus-visible:bottom-4 group-focus-visible:left-4 group-focus-visible:rounded group-focus-visible:bg-white group-focus-visible:p-2">
        {text.galleryInstructions}
      </p>
      {hasVideos && (
        <button
          type="button"
          onClick={() => setIsPlaying(current => !current)}
          className="absolute bottom-4 right-4 rounded bg-white p-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          {isPlaying ? text.pauseGalleryVideos : text.playGalleryVideos}
        </button>
      )}
    </div>
  );
};

export default InfiniteCanvas;
