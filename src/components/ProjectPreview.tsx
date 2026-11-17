import { useLayoutEffect, useRef } from "react";
import type { DisplayProject } from "../types/CmsProject";
import gsap from "gsap";
import { useReducedMotion } from "./useReducedMotion";
import ContentImage from "./ContentImage";

interface ProjectPreviewProps {
    project: DisplayProject;
}

const ProjectPreview = ({ project }: ProjectPreviewProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const reducedMotion = useReducedMotion();

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline();

            tl.fromTo(
                containerRef.current,
                {
                    opacity: reducedMotion ? 1 : 0,
                },
                {
                    opacity: 1,                    
                    duration: reducedMotion ? 0 : 0.7,
                    ease: "power2.out",
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, [reducedMotion]);

    return (
        <div
            ref={containerRef}
            className="absolute right-0 bottom-0 pr-14 w-[40vw] aspect-video pointer-events-none overflow-hidden"
        >
            <ContentImage
                ref={imageRef}
                src={project.image}
                alt={"imageAlt" in project ? project.imageAlt : project.title}
                className="w-full h-full object-cover"
            />
        </div>
    );
};

export default ProjectPreview