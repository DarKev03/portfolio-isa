import Title from "../components/Title";
import projectsData from "../assets/projects.json";
import { Project } from "../types/Project";
import { useRef, useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import gif from "../assets/videos/video_projects.mp4";
import ProjectModal from "../components/ProjectModal";
import ProjectPreview from "../components/ProjectPreview";
import gsap from 'gsap';

let hasHoveredInSession = false;

const ProjectsPage = () => {
    const backgroundRef = useRef<HTMLDivElement>(null);

    const projectList: Project[] = projectsData as Project[];
    const castoroFamily = { fontFamily: "'Castoro', serif" };

    const [hoveredProjectId, setHoveredProjectId] = useState<number | null>(null);
    const [alreadyHovered, setAlreadyHovered] = useState<boolean>(hasHoveredInSession);

    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    const navBarRef = useRef<HTMLDivElement>(null);

    const handleMouseEnter = (projectId: number) => {
        setHoveredProjectId(projectId);

        if (!alreadyHovered) {
            setAlreadyHovered(true);
            hasHoveredInSession = true;
        }
    };

    function setPreviousProject() {
        if (!selectedProject) return;

        const currentIndex = projectList.findIndex(
            project => project.id === selectedProject.id
        );

        const previousIndex =
            currentIndex === 0
                ? projectList.length - 1
                : currentIndex - 1;

        setSelectedProject(projectList[previousIndex]);
    }

    function setNextProject() {
        if (!selectedProject) return;

        const currentIndex = projectList.findIndex(
            project => project.id === selectedProject.id
        );

        const nextIndex =
            currentIndex === (projectList.length - 1)
                ? 0
                : currentIndex + 1

        setSelectedProject(projectList[nextIndex]);
    }

    useEffect(() => {
        if (selectedProject) {
            gsap.to(navBarRef.current, {
                opacity: 0,
                ease: "power2.inOut",
            });
        }
        else {
            gsap.to(navBarRef.current, {
                opacity: 1,
                ease: "power2.inOut",
            });
        }
    }, [selectedProject]);
    

    return (
        <div ref={backgroundRef} className="bg-[rgba(255,254,253,1)] min-h-screen flex flex-col">

            <div className="fixed top-0 left-0 z-50 pointer-events-none p-8">
                <Title />
            </div>

            <div ref={navBarRef} className="fixed top-0 right-0 z-50 pt-8 pr-10">
                <NavBar />
            </div>

            <div
                className="mt-auto flex flex-col items-start gap-8 pb-11"
                style={{
                    ...castoroFamily,
                    color: selectedProject ? "rgba(76, 76, 76, 0.3)" : "rgba(65, 65, 65, 1)"
                }}
            >
                {projectList.map((project, index) => (
                    <div
                        key={project.id}
                        className="group relative flex flex-row items-center gap-25 pl-11 pr-11 hover:text-gray-600 cursor-pointer transition-colors duration-500 ease-in-out w-full"
                        onClick={() => setSelectedProject(project)}
                        onMouseEnter={() => handleMouseEnter(project.id)}
                        onMouseLeave={() => setHoveredProjectId(null)}
                    >
                        <div className="flex flex-col items-start w-64 m-0 mt-auto">
                            <h3 className="text-2xl font-normal m-0 leading-none transition-all duration-400 group-hover:-skew-x-10">
                                {project.title}
                            </h3>
                            <div className="flex flex-wrap m-0 leading-none -mt-0.5">
                                {project.tags.map((tag, tagIndex) => (
                                    <div
                                        key={tag}
                                        className="flex items-center leading-none"
                                    >
                                        <span className="text-sm font-normal">
                                            {tag}
                                        </span>

                                        {tagIndex < project.tags.length - 1 && (
                                            <span className="mx-2">
                                                /
                                            </span>
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

                        <span className="text-base font-normal mt-auto">
                            {project.year}
                        </span>

                        {!alreadyHovered && project.id === 1 && (
                            <div className="absolute left-200 bottom-0 w-90 lg:left-250 aspect-square pointer-events-none">
                                <video
                                    src={gif}
                                    autoPlay
                                    loop
                                    muted
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        {hoveredProjectId === project.id && (
                            <ProjectPreview
                                project={project}
                            />
                        )}
                    </div>
                ))}
            </div>

            {selectedProject && (
                <ProjectModal
                    project={selectedProject}
                    onClose={() => setSelectedProject(null)}
                    onPrevious={setPreviousProject}
                    onNext={setNextProject}
                />
            )}

        </div>
    );
};

export default ProjectsPage;