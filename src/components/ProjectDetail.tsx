import useEmblaCarousel from "embla-carousel-react";
import { Project } from "../types/Project";
import { ContentBlock } from "../types/ContentBlock";

interface ProjectDetailProps {
    project: Project;
    onClose: () => void;
    onPrevious: () => void;
    onNext: () => void;
}

const ProjectDetail = ({ project, onClose, onPrevious, onNext }: ProjectDetailProps) => {
    const castoroFamily = { fontFamily: "'Castoro', serif" };

    const [emblaRef] = useEmblaCarousel({
        dragFree: true,
        containScroll: "trimSnaps",
        align: "start"
    });

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
            onClick={onClose}
        >
            <div className="flex-none flex items-start pt-9 pl-11 pr-11 h-24 z-10">
                <div className="ml-auto flex flex-row gap-5 text-base font-normal italic text-[rgba(65, 65, 65, 1)]">
                    <button
                        onClick={onClose}
                        className="hover:text-black transition-colors pr-35 cursor-pointer"
                    >
                        ( proyectos )
                    </button>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onPrevious();
                        }}
                        className="hover:text-black transition-colors cursor-pointer"
                    >
                        ( atras )
                    </button>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onNext();
                        }}
                        className="hover:text-black transition-colors cursor-pointer"
                    >
                        ( siguiente )
                    </button>
                </div>
            </div>

            {/* Contenido */}
            <div
                className="flex-1 overflow-hidden p-8 pr-0"
                ref={emblaRef}
            >
                <div className="flex h-full">

                    <div className="flex-none w-[50vw]" />

                    {project.content?.map((block, index) =>
                        renderBlock(
                            block,
                            index,
                            project.content?.length || 0
                        )
                    )}

                </div>
            </div>
        </div>
    );
};

export default ProjectDetail;