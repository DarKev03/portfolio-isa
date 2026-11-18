import { useParams, Link } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import projectsData from "../assets/projects.json";
import { Project } from "../types/Project";
import Title from "../components/Title";
import ProjectContentBlock from "../components/ProjectContentBlock";

const ProjectDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const project = (projectsData as Project[]).find(p => p.id === Number(id));
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
                    {project.content?.map((block, index, blocks) => (
                        <ProjectContentBlock key={index} block={block} index={index} total={blocks.length} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProjectDetailPage;
