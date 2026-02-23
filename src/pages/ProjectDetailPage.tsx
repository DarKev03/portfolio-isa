import { useParams, Link } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import projectsData from "../assets/projects.json";
import { Project } from "../types/Project";
import { ContentBlock } from "../types/ContentBlock";
import Title from "../components/Title";

const ProjectDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const project = (projectsData as Project[]).find(p => p.id === Number(id));
    const castoroFamily = { fontFamily: "'Castoro', serif" };

    const [emblaRef] = useEmblaCarousel({
        dragFree: true,
        containScroll: "trimSnaps",
        align: "start"
    });

    if (!project) {
        return (
            <div className="min-h-screen bg-[rgba(255,254,253,1)] flex flex-col items-center justify-center">
                <p>Proyecto no encontrado</p>
                <Link to="/projects" className="mt-4 text-blue-600 underline">Volver a proyectos</Link>
            </div>
        );
    }

    const renderBlock = (block: ContentBlock, index: number, total: number) => {
        const isFirst = index === 0;
        const isLast = index === total - 1;

        const blockBaseClass = `flex-none w-1/2 h-full flex flex-col justify-start py-10 ${isFirst ? "pl-11 pr-6" :
            isLast ? "pl-6 pr-11" :
                "px-6"
            }`;

        switch (block.type) {
            case "text-image":
                return (
                    <div key={index} className={blockBaseClass}>
                        <div className="text-xl leading-relaxed text-gray-700 mb-8" style={castoroFamily}>
                            {block.text}
                        </div>
                        <div
                            style={{ height: `${block.imageSize}%` }}
                            className="overflow-hidden mt-auto"
                        >
                            <img src={block.image} alt="" className="w-full h-full object-cover" />
                        </div>
                    </div>
                );
            case "image-text":
                return (
                    <div key={index} className={blockBaseClass + " mb-auto"}>
                        <div
                            style={{ height: `${block.imageSize}%` }}
                            className="overflow-hidden"
                        >
                            <img src={block.image} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="text-xl leading-relaxed text-gray-700 pt-5" style={castoroFamily}>
                            {block.text}
                        </div>
                    </div>
                );
            case "image-full":
                return (
                    <div key={index} className={blockBaseClass}>
                        <div className="w-full h-full overflow-hidden">
                            <img src={block.image} alt="" className="w-full h-full object-cover" />
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="bg-[rgba(255,254,253,1)] h-screen flex flex-col overflow-hidden">
            {/* Cabecera */}
            <div className="flex-none flex items-start pt-9 pl-11 pr-11 h-24 z-10">
                <Title />
                <div className="flex flex-row mt-auto ml-auto gap-5 justify-between text-base font-normal italic text-gray-400">
                    <Link to="/projects" className="hover:text-black transition-colors pr-35">{`( proyectos )`}</Link>
                    <Link to={`/projects/${project.id - 1}`} className="cursor-pointer hover:text-black transition-colors">{`( atras )`}</Link>
                    <Link to={`/projects/${project.id + 1}`} className="cursor-pointer hover:text-black transition-colors">{`( siguiente )`}</Link>
                </div>
            </div>

            <div className="flex-1 overflow-hidden" ref={emblaRef}>
                <div className="flex h-full">
                    {project.content?.map((block, index) =>
                        renderBlock(block, index, project.content?.length || 0)
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectDetailPage;
