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
    

    const [secondTitleVisible, setSecondTitleVisible] = useState(false);

    useEffect(() => {
        const el = titleRef.current;
        const canvasEl = canvasRef.current;
        const backgroundEl = backgroundRef.current;

        if (el && canvasEl && backgroundEl) {
            const tl = gsap.timeline();
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

        }
    }, []);

    useEffect(() => {
        const el2 = titleRef2.current;
        const el = titleRef.current;
        const navBarEl = navBarRef.current;

        if (el2 && secondTitleVisible) {
            const tl = gsap.timeline();
            tl.to(
                el,
                { opacity: 0, duration: 2 },
            )
                .to(
                    el2,
                    { opacity: 1, duration: 2 },
                    "-=2",
                )
                .to(
                    navBarEl,
                    { opacity: 1, duration: 2 },
                    "-=4",
                );
        }
    }, [secondTitleVisible]);

    return (
        <div
            onPointerDown={() => setSecondTitleVisible(true)}
            ref={backgroundRef}
            className="relative h-screen w-screen overflow-hidden">
            <div
                ref={canvasRef}
                className="absolute inset-0">
                <InfiniteCanvas />
            </div>

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
            >
                <NavBar />
            </div>
        </div>

    );
};

export default MainPage;
