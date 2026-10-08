import { useLayoutEffect, useRef } from "react";
import { Project } from "../types/Project";
import gsap from "gsap";

interface ProjectPreviewProps {
    project: Project;
}

const ProjectPreview = ({ project }: ProjectPreviewProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline();

            tl.fromTo(
                containerRef.current,
                {
                    opacity: 0,                    
                },
                {
                    opacity: 1,                    
                    duration: 0.7,
                    ease: "power2.out",
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div
            ref={containerRef}
            className="absolute right-0 bottom-0 pr-14 w-[40vw] aspect-video pointer-events-none overflow-hidden"
        >
            <img
                ref={imageRef}
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
            />
        </div>
    );
};

export default ProjectPreview