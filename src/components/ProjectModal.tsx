import { Project } from "../types/Project";
import ProjectDetail from "./ProjectDetail";
import { useEffect, useRef } from "react";
import gsap from 'gsap';

interface ProjectModalProps {
    project: Project;
    onClose: () => void;
    onPrevious: () => void;
    onNext: () => void;
}

const ProjectModal = ({
    project,
    onClose,
    onPrevious,
    onNext
}: ProjectModalProps) => {

    const overlayRef = useRef<HTMLDivElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {

            gsap.fromTo(
                overlayRef.current,
                { opacity: 0 },
                {
                    opacity: 1,
                    duration: 0.4,
                    ease: "power2.out"
                }
            );

            gsap.fromTo(
                modalRef.current,
                {
                    opacity: 0,
                    x: 80,
                },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.7,
                    ease: "power3.out"
                }
            );

        });

        return () => ctx.revert();
    }, []);

    return (
        <div
            ref={modalRef}
            className="fixed inset-0 z-50 w-screen h-screen"
            onClick={onClose}
        >
            <div
                ref={overlayRef}
                className="w-screen h-screen max-w-400 bg-transparent"
            >
                <ProjectDetail
                    project={project}
                    onClose={onClose}
                    onPrevious={onPrevious}
                    onNext={onNext}
                />
            </div>
        </div>
    );
};

export default ProjectModal;