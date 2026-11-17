import type { DisplayProject } from "../types/CmsProject";
import ProjectDetail from "./ProjectDetail";
import { useEffect, useRef } from "react";
import gsap from 'gsap';

interface ProjectModalProps {
    project: DisplayProject;
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
    const modalRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const modal = modalRef.current;
        if (!modal) return;
        const previouslyFocused = document.activeElement;
        modal.showModal();

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

        return () => {
            ctx.revert();
            modal.close();
            if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
        };
    }, []);

    return (
        <dialog
            ref={modalRef}
            aria-label={project.title}
            onCancel={(event) => {
                event.preventDefault();
                onClose();
            }}
            onKeyDown={(event) => {
                if (event.key === "Escape") {
                    event.preventDefault();
                    onClose();
                }
            }}
            className="fixed inset-0 m-0 h-screen max-h-none w-screen max-w-none border-0 bg-transparent p-0 backdrop:bg-transparent"
        >
            <div
                ref={overlayRef}
                className="w-screen h-screen bg-transparent"
            >
                <ProjectDetail
                    project={project}
                    onClose={onClose}
                    onPrevious={onPrevious}
                    onNext={onNext}
                />
            </div>
        </dialog>
    );
};

export default ProjectModal;