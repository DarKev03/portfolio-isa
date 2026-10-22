import { useGesture } from "@use-gesture/react";
import { useEffect, useRef, useState } from "react";
import projects from "../assets/projects.json";

const CELL_W = 280;
const CELL_H = 190;
const GAP = 220;
const STEP_X = CELL_W + GAP;
const STEP_Y = CELL_H + GAP;
const MARGIN = 3;

const imagePool: string[] = projects.flatMap((p) => [
  p.image,
  ...(p.content ?? []).map((c) => c.image),
]);

const pickImage = (r: number, c: number) => {
  const idx = (Math.abs(r) * 7 + Math.abs(c) * 13) % imagePool.length;
  return imagePool[idx];
};

const InfiniteCanvas = () => {
  const viewRef = useRef<HTMLDivElement>(null);
  const inertiaFrameRef = useRef<number | null>(null);
  const wheelFrameRef = useRef<number | null>(null);
  const wheelDeltaRef = useRef({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [viewW, setViewW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  const [viewH, setViewH] = useState(typeof window !== "undefined" ? window.innerHeight : 800);

  useGesture(
    {
      onDrag: ({ delta: [dx, dy] }) => {
        if (inertiaFrameRef.current !== null) {
          cancelAnimationFrame(inertiaFrameRef.current);
          inertiaFrameRef.current = null;
        }
        if (wheelFrameRef.current !== null) {
          cancelAnimationFrame(wheelFrameRef.current);
          wheelFrameRef.current = null;
        }
        wheelDeltaRef.current = { x: 0, y: 0 };
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
      drag: { filterTaps: true },
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
      className="w-full h-full overflow-hidden touch-none select-none"
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
        {cells.map(({ r, c }) => (
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
            <img
              src={pickImage(r, c)}
              alt=""
              loading="eager"
              decoding="async"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                userSelect: "none",
                WebkitUserSelect: "none",
                pointerEvents: "none",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfiniteCanvas;
