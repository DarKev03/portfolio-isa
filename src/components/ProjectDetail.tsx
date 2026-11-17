import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { BLOCKS } from "@contentful/rich-text-types";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import type { DisplayProject } from "../types/CmsProject";
import { ContentBlock } from "../types/ContentBlock";
import { readImage, splitProjectContent } from "../contentful/projects";
import { useTranslation } from "../i18n/translations";
import { useLanguage } from "../i18n/languageContext";
import type { KeyboardEvent } from "react";

interface ProjectDetailProps {
    project: DisplayProject;
    onClose: () => void;
    onPrevious: () => void;
    onNext: () => void;
}

const ProjectDetail = ({ project, onClose, onPrevious, onNext }: ProjectDetailProps) => {
    const text = useTranslation();
    const { language } = useLanguage();
    const castoroFamily = { fontFamily: "'Castoro', serif" };

    const [emblaRef, emblaApi] = useEmblaCarousel({
        dragFree: true,
        containScroll: "trimSnaps",
        align: "start"
    }, [WheelGesturesPlugin()]);

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (!emblaApi || event.defaultPrevented || event.nativeEvent.isComposing || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
        if (event.target instanceof HTMLElement && event.target.closest("input, textarea, select, [contenteditable]:not([contenteditable='false'])")) return;

        if (event.key === "ArrowRight") {
            if (emblaApi.canScrollNext()) {
                event.preventDefault();
                emblaApi.scrollNext();
            } else if (emblaApi.scrollProgress() < 1) {
                event.preventDefault();
                emblaApi.scrollTo(emblaApi.scrollSnapList().length - 1);
            }
        } else if (event.key === "ArrowLeft") {
            if (emblaApi.canScrollPrev()) {
                event.preventDefault();
                emblaApi.scrollPrev();
            } else if (emblaApi.scrollProgress() > 0) {
                event.preventDefault();
                emblaApi.scrollTo(0);
            }
        }
    };

    const renderBlock = (
        block: ContentBlock,
        index: number,
        total: number
    ) => {
        const isFirst = index === 0;
        const isLast = index === total - 1;

        const blockBaseClass = `
            flex-none w-1/2 h-full flex flex-col justify-start py-10
            ${isFirst
                ? "pl-11 pr-6"
                : isLast
                    ? "pl-6 pr-11"
                    : "px-6"
            }
        `;

        switch (block.type) {
            case "text-image":
                return (
                    <div key={index} className={blockBaseClass}>
                        <div
                            className="text-xl leading-relaxed text-gray-700 mb-8"
                            style={castoroFamily}
                        >
                            {block.text}
                        </div>

                        <div
                            style={{ height: `${block.imageSize}%` }}
                            className="overflow-hidden mt-auto"
                        >
                            <img
                                src={block.image}
                                alt=""
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                );

            case "image-text":
                return (
                    <div
                        key={index}
                        className={blockBaseClass + " mb-auto"}
                    >
                        <div
                            style={{ height: `${block.imageSize}%` }}
                            className="overflow-hidden"
                        >
                            <img
                                src={block.image}
                                alt=""
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div
                            className="text-xl leading-relaxed text-gray-700 pt-5"
                            style={castoroFamily}
                        >
                            {block.text}
                        </div>
                    </div>
                );

            case "image-full":
                return (
                    <div key={index} className={blockBaseClass}>
                        <div className="w-full h-full overflow-hidden">
                            <img
                                src={block.image}
                                alt=""
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                );

            default:
                return null;
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
            <div className="flex-none flex items-start pt-9 pl-11 pr-11 h-24 z-10">
                <div className="ml-auto flex flex-row gap-5 text-base font-normal italic text-[rgba(65, 65, 65, 1)]">
                    <button
                        onClick={onClose}
                        className="hover:text-black transition-colors pr-35 cursor-pointer"
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
                            <div key={index} tabIndex={0} className="flex-none w-1/2 h-full overflow-y-auto px-4 py-10 text-[clamp(0.875rem,1.111vw,1.25rem)] sm:px-6" style={castoroFamily}>
                                <div className="space-y-4 break-words [&_table]:w-full [&_table]:table-fixed">
                                    {documentToReactComponents(
                                        section,
                                        { renderNode: {
                                            [BLOCKS.EMBEDDED_ASSET]: node => {
                                                const image = readImage(node.data.target, project.title, language);
                                                return <img src={image.url} alt={image.alt} className="w-full h-auto object-contain" />;
                                            },
                                        } },
                                    )}
                                </div>
                            </div>
                        ))
                        : project.content?.map((block, index) =>
                            renderBlock(block, index, project.content?.length || 0)
                        )}

                </div>
            </div>
        </div>
    );
};

export default ProjectDetail;