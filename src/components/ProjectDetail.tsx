import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import type { DisplayProject } from "../types/CmsProject";
import { splitProjectContent } from "../contentful/projects";
import { useTranslation } from "../i18n/translations";
import { useLanguage } from "../i18n/languageContext";
import { useLayoutEffect, useRef, type KeyboardEvent, type ReactNode } from "react";
import { useReducedMotion } from "./useReducedMotion";
import RichTextContent from "./RichTextContent";
import ProjectContentBlock from "./ProjectContentBlock";

const ProjectSection = ({ children }: { children: ReactNode }) => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const viewportRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const section = sectionRef.current;
        const viewport = viewportRef.current;
        const content = contentRef.current;
        const container = section?.parentElement;
        if (!section || !viewport || !content || !container) return;

        const updateScale = () => {
            const style = getComputedStyle(section);
            const padding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
            const maxWidth = container.clientWidth / 2;
            // Measure at the maximum width so the scaled section does not rewrap itself.
            viewport.style.width = `${Math.max(0, maxWidth - padding)}px`;
            if (!viewport.clientWidth || !viewport.clientHeight || !content.scrollWidth || !content.scrollHeight) return;
            const scale = Math.min(
                1,
                viewport.clientWidth / content.scrollWidth,
                viewport.clientHeight / content.scrollHeight,
            );
            content.style.transform = `scale(${scale})`;
            section.style.width = `${Math.min(maxWidth, padding + (maxWidth - padding) * scale)}px`;
        };

        const observer = new ResizeObserver(updateScale);
        observer.observe(container);
        observer.observe(viewport);
        observer.observe(content);
        updateScale();
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={sectionRef} tabIndex={0} className="flex-none w-1/2 h-full overflow-clip px-4 py-10 text-[clamp(0.875rem,1.111vw,1.25rem)] sm:px-6" style={{ fontFamily: "'Castoro', serif" }}>
            <div ref={viewportRef} className="h-full overflow-clip">
                <div ref={contentRef} className="origin-top-left space-y-4 break-words [&_table]:w-full [&_table]:table-fixed">
                    {children}
                </div>
            </div>
        </div>
    );
};

interface ProjectDetailProps {
    project: DisplayProject;
    onClose: () => void;
    onPrevious: () => void;
    onNext: () => void;
}

const ProjectDetail = ({ project, onClose, onPrevious, onNext }: ProjectDetailProps) => {
    const text = useTranslation();
    const { language } = useLanguage();
    const reducedMotion = useReducedMotion();

    const [emblaRef, emblaApi] = useEmblaCarousel({
        dragFree: !reducedMotion,
        duration: reducedMotion ? 0 : 25,
        containScroll: "trimSnaps",
        align: "start"
    }, [WheelGesturesPlugin()]);

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (!emblaApi || event.defaultPrevented || event.nativeEvent.isComposing || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
        if (event.target instanceof HTMLElement && event.target.closest("input, textarea, select, [contenteditable]:not([contenteditable='false'])")) return;

        if (event.key === "ArrowRight") {
            if (emblaApi.canScrollNext()) {
                event.preventDefault();
                emblaApi.scrollNext(reducedMotion);
            } else if (emblaApi.scrollProgress() < 1) {
                event.preventDefault();
                emblaApi.scrollTo(emblaApi.scrollSnapList().length - 1, reducedMotion);
            }
        } else if (event.key === "ArrowLeft") {
            if (emblaApi.canScrollPrev()) {
                event.preventDefault();
                emblaApi.scrollPrev(reducedMotion);
            } else if (emblaApi.scrollProgress() > 0) {
                event.preventDefault();
                emblaApi.scrollTo(0, reducedMotion);
            }
        }
    };

    return (
        <div
            className="relative bg-transparent w-full h-full flex flex-col overflow-hidden"
            onKeyDown={handleKeyDown}
            onWheelCapture={(event) => {
                if (event.ctrlKey) event.stopPropagation();
            }}
        >
            <div className="flex-none flex items-start px-4 pt-9 h-24 z-10 sm:px-11">
                <div className="ml-auto flex flex-row gap-3 text-base font-normal italic text-[rgba(65, 65, 65, 1)] sm:gap-5">
                    <button
                        onClick={onClose}
                        className="hover:text-black transition-colors cursor-pointer sm:pr-35"
                    >
                        ( {text.projects.toLowerCase()} )
                    </button>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onPrevious();
                        }}
                        className="hover:text-black transition-colors cursor-pointer"
                    >
                        ( {text.previous} )
                    </button>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onNext();
                        }}
                        className="hover:text-black transition-colors cursor-pointer"
                    >
                        ( {text.next} )
                    </button>
                </div>
            </div>

            {/* Contenido */}
            <div
                className="flex-1 overflow-hidden py-8"
                ref={emblaRef}
            >
                <div className="flex h-full">

                    <div className="flex-none w-1/2" />

                    {"richContent" in project
                        ? splitProjectContent(project.richContent).map((section, index) => (
                            <ProjectSection key={index}>
                                <RichTextContent document={section} fallbackAlt={project.title} language={language} imageClassName="w-full h-auto object-contain" />
                            </ProjectSection>
                        ))
                        : project.content?.map((block, index, blocks) => (
                            <ProjectContentBlock key={index} block={block} index={index} total={blocks.length} reportImageErrors />
                        ))}

                </div>
            </div>
        </div>
    );
};

export default ProjectDetail;