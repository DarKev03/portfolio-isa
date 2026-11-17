import type { ContentBlock } from "../types/ContentBlock";
import ContentImage from "./ContentImage";

interface ProjectContentBlockProps {
    block: ContentBlock;
    index: number;
    total: number;
    reportImageErrors?: boolean;
}

const ProjectContentBlock = ({ block, index, total, reportImageErrors = false }: ProjectContentBlockProps) => {
    const positionClass = index === 0 ? "pl-11 pr-6" : index === total - 1 ? "pl-6 pr-11" : "px-6";
    const blockClass = `flex-none w-1/2 h-full flex flex-col justify-start py-10 ${positionClass}`;
    const Image = reportImageErrors ? ContentImage : "img";
    const image = <Image src={block.image} alt="" className="w-full h-full object-cover" />;
    const textStyle = { fontFamily: "'Castoro', serif" };

    switch (block.type) {
        case "text-image":
            return (
                <div className={blockClass}>
                    <div className="text-xl leading-relaxed text-gray-700 mb-8" style={textStyle}>{block.text}</div>
                    <div style={{ height: `${block.imageSize}%` }} className="overflow-hidden mt-auto">{image}</div>
                </div>
            );
        case "image-text":
            return (
                <div className={`${blockClass} mb-auto`}>
                    <div style={{ height: `${block.imageSize}%` }} className="overflow-hidden">{image}</div>
                    <div className="text-xl leading-relaxed text-gray-700 pt-5" style={textStyle}>{block.text}</div>
                </div>
            );
        case "image-full":
            return <div className={blockClass}><div className="w-full h-full overflow-hidden">{image}</div></div>;
        default:
            return null;
    }
};

export default ProjectContentBlock;
