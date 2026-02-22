import Title from "../components/Title";
import projectsData from "../assets/projects.json";
import { Project } from "../types/Project";
import { useState } from "react";
import NavBar from "../components/NavBar";
import gif from "../assets/videos/200.gif";

let hasHoveredInSession = false;

const ProjectsPage = () => {
    const projectList: Project[] = projectsData;
    const castoroFamily = { fontFamily: "'Castoro', serif" };

    const [hoveredProjectId, setHoveredProjectId] = useState<number | null>(null);
    const [alreadyHovered, setAlreadyHovered] = useState<boolean>(hasHoveredInSession);

    const handleMouseEnter = (projectId: number) => {
        setHoveredProjectId(projectId);
        if (!alreadyHovered) {
            setAlreadyHovered(true);
            hasHoveredInSession = true;
        }
    };

    return (
        <div className="bg-[rgba(255,254,253,1)] min-h-screen flex flex-col">
            <div className="flex items-start pt-9 pl-11">
                <Title />
            </div>

            <div className="flex flex-col ml-auto pr-10">
                <NavBar />
            </div>

            <div className="mt-auto flex flex-col items-start gap-2 pb-11" style={{ ...castoroFamily, color: 'rgba(76, 76, 76, 0.3)' }}>
                {projectList.map((project, index) => (
                    <div
                        key={project.id}
                        className="relative flex flex-row items-center gap-20 pl-11 hover:text-gray-600 cursor-pointer transition-colors duration-500 ease-in-out"
                        onMouseEnter={() => handleMouseEnter(project.id)}
                        onMouseLeave={() => setHoveredProjectId(null)}
                    >
                        <div className="flex flex-col items-start w-64 m-0 mt-auto">
                            <h3 className="text-2xl font-normal m-0 leading-none">{project.title}</h3>
                            <div className="flex flex-wrap m-0 leading-none -mt-0.5">
                                {project.tags.map((tag, tagIndex) => (
                                    <div key={tag} className="flex items-center leading-none">
                                        <span className="text-sm font-normal">{tag}</span>
                                        {tagIndex < project.tags.length - 1 && (
                                            <span className="mx-2 text-gray-400">/</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex w-22 justify-between text-base font-normal mt-auto italic">
                            <span>(</span>
                            <span>{` 0${index + 1} `}</span>
                            <span>)</span>
                        </div>
                        <span className="text-base font-normal pl-8 mt-auto">{project.year}</span>
                        {!alreadyHovered && (
                            <div className="absolute left-200 bottom-0 w-100 h-80 pointer-events-none">
                                <img src={gif} alt={project.title} className="w-full h-full object-cover" />
                            </div>
                        )}
                        {hoveredProjectId === project.id && (
                            <div className="absolute left-200 bottom-0 w-100 h-80 pointer-events-none">
                                <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                            </div>
                        )}
                        {hoveredProjectId === project.id ? (
                            <span className="rounded-full bg-gray-600 px-1 py-1 mt-auto ml-175"></span>
                        ) : (
                            <span className="rounded-full bg-gray-300 px-1 py-1 mt-auto ml-175"></span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProjectsPage;