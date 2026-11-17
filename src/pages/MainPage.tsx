import { useEffect, useRef } from "react";
import { useState } from "react";
import gsap from "gsap";
import InfiniteCanvas from "../components/InfiniteCanvas";
import Title from "../components/Title";
import NavBar from "../components/NavBar";

const MainPage = () => {
    const titleRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLDivElement>(null);
    const backgroundRef = useRef<HTMLDivElement>(null);
    const titleRef2 = useRef<HTMLDivElement>(null);
    const navBarRef = useRef<HTMLDivElement>(null);
    const pendingFocusRef = useRef<"first" | "last" | null>(null);

    const [hasIntroFinished, setHasIntroFinished] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);
    const [contactOpen, setContactOpen] = useState(false);
    const secondTitleVisible = hasIntroFinished && hasInteracted;

    useEffect(() => {
        const el = titleRef.current;
        const canvasEl = canvasRef.current;
        const backgroundEl = backgroundRef.current;

        if (el && canvasEl && backgroundEl) {
            const tl = gsap.timeline({ onComplete: () => setHasIntroFinished(true) });
            tl.fromTo(
                backgroundEl,
                { opacity: 1, y: 0 },
                { opacity: 1, y: 0, duration: 2 },
            )
                .fromTo(
                    el,
                    { opacity: 0 },
                    { opacity: 1, duration: 2 },
                    "-=0.4",
                )
                .fromTo(
                    canvasEl,
                    { opacity: 0 },
                    { opacity: 1, duration: 2 },
                    "-=0.5",
                );
            return () => { tl.kill(); };
        }
    }, []);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (secondTitleVisible || event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey) return;
            if (["Shift", "Control", "Alt", "Meta"].includes(event.key)) return;

            if (event.key === "Tab") {
                event.preventDefault();
                pendingFocusRef.current = event.shiftKey ? "last" : "first";
            }
            setHasInteracted(true);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [secondTitleVisible]);

    useEffect(() => {
        const el2 = titleRef2.current;
        const el = titleRef.current;
        const navBarEl = navBarRef.current;

        if (el2 && navBarEl && secondTitleVisible) {
            const tl = gsap.timeline();
            tl.to(
                el,
                { opacity: 0, duration: 2 },
            )
                .to(
                    el2,
                    { opacity: 1, duration: 2 },
                    "-=2",
                );

            if (pendingFocusRef.current) {
                gsap.set(navBarEl, { opacity: 1 });
                const controls = navBarEl.querySelectorAll<HTMLElement>("button:not([disabled]), a[href]");
                const target = pendingFocusRef.current === "last" ? controls[controls.length - 1] : controls[0];
                pendingFocusRef.current = null;
                target?.focus();
            } else {
                tl.to(navBarEl, { opacity: 1, duration: 2 }, "-=4");
            }
            return () => { tl.kill(); };
        }
    }, [secondTitleVisible]);

    useEffect(() => {
        const titleEl = titleRef2.current;

        if (!titleEl) return;

        const tl = gsap.timeline();

        if (contactOpen) {
            tl.to(
                titleEl,
                {
                    opacity: 0,
                    duration: 0.5,
                    ease: "power2.out",
                },
                0
            );
        } else if (!contactOpen && secondTitleVisible) {
            tl.to(
                titleEl,
                {
                    opacity: 1,
                    duration: 4,
                    ease: "power2.out",
                },
                0
            );
        }

        return () => {
            tl.kill();
        };
    }, [contactOpen]);

    return (
        <div
            onPointerDown={() => { pendingFocusRef.current = null; setHasInteracted(true); }}
            onWheel={() => { pendingFocusRef.current = null; setHasInteracted(true); }}
            ref={backgroundRef}
            className="relative h-screen w-screen overflow-hidden">
            <div
                ref={titleRef}
                className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
            >
                <Title />
            </div>
            <div
                ref={titleRef2}
                className="fixed inset-0 z-50 pointer-events-none p-8 opacity-0"
            >
                <Title />
            </div>
            <div
                ref={navBarRef}
                className="fixed top-0 right-0 z-50 p-8 opacity-0"
                inert={!secondTitleVisible}
                aria-hidden={!secondTitleVisible}
                onFocusCapture={() => {
                    gsap.killTweensOf(navBarRef.current);
                    gsap.set(navBarRef.current, { opacity: 1 });
                }}
            >
                <NavBar onContactOpenChange={setContactOpen} />
            </div>
            <div
                ref={canvasRef}
                className="absolute inset-0">
                <InfiniteCanvas />
            </div>
        </div>

    );
};

export default MainPage;
