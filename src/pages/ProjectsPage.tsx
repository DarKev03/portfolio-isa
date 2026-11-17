import Title from "../components/Title";
import { useProjects } from "../contentful/useProjects";
import { useRef, useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import ProjectModal from "../components/ProjectModal";
import ProjectPreview from "../components/ProjectPreview";
import gsap from 'gsap';
import { Link } from "react-router-dom";
import { useTranslation } from "../i18n/translations";
import { useReducedMotion } from "../components/useReducedMotion";

const ProjectsPage = () => {
    const text = useTranslation();
    const reducedMotion = useReducedMotion();
    const backgroundRef = useRef<HTMLDivElement>(null);
    const projectsState = useProjects();
    const projectList = projectsState.projects;
    const castoroFamily = { fontFamily: "'Castoro', serif" };

    const [hoveredProjectId, setHoveredProjectId] = useState<string | number | null>(null);
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

    const selectedProject = projectList.find(project => project.id === selectedProjectId);
    const isProjectOpen = Boolean(selectedProject);

    const navBarRef = useRef<HTMLDivElement>(null);

    function setPreviousProject() {
        if (!selectedProject) return;

        const currentIndex = projectList.findIndex(
            project => project.id === selectedProject.id
        );

        const previousIndex =
            currentIndex === 0
                ? projectList.length - 1
                : currentIndex - 1;

        setSelectedProjectId(projectList[previousIndex].id);
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

        setSelectedProjectId(projectList[nextIndex].id);
    }

    useEffect(() => {
        const animation = gsap.to(navBarRef.current, {
            opacity: isProjectOpen ? 0 : 1,
            duration: reducedMotion ? 0 : 0.5,
            ease: "power2.inOut",
        });
        return () => { animation.kill(); };
    }, [isProjectOpen, reducedMotion]);


    return (
        <div ref={backgroundRef} className="bg-[rgba(255,254,253,1)] min-h-screen flex flex-col">

            <div className="fixed top-0 left-0 z-50 pointer-events-none p-8">
                <Link to={"/"} className="pointer-events-auto inline-block">
                    <Title />
                </Link>
            </div>

            <div ref={navBarRef} className="fixed top-0 right-0 z-50 p-8">
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
                        className="group relative w-full"
                        onMouseEnter={() => setHoveredProjectId(project.id)}
                        onMouseLeave={() => setHoveredProjectId(null)}
                    >
                        <button
                            type="button"
                            aria-haspopup="dialog"
                            onClick={() => setSelectedProjectId(project.id)}
                            className="flex w-full cursor-pointer flex-row items-center gap-3 px-4 text-left transition-colors duration-500 ease-in-out hover:text-gray-600 sm:gap-8 sm:px-11 lg:gap-25"
                        >
                            <span className="m-0 mt-auto flex min-w-0 flex-1 flex-col items-start sm:w-64 sm:flex-none">
                                <span className="text-2xl font-normal m-0 leading-none transition-all duration-400 group-hover:-skew-x-10">
                                    {project.title}
                                </span>
                                <span className="flex flex-wrap m-0 leading-none -mt-0.5">
                                    {project.tags.slice(0, 2).map((tag, tagIndex) => (
                                        <span
                                            key={`${tag}-${tagIndex}`}
                                            className="flex items-center leading-none"
                                        >
                                            <span className="text-sm font-normal">
                                                {tag}
                                            </span>

                                            {tagIndex === 0 && project.tags.length > 1 && (
                                                <span className="mx-2">
                                                    /
                                                </span>
                                            )}
                                        </span>
                                    ))}
                                </span>
                            </span>

                            <span className="mt-auto flex w-12 shrink-0 justify-between text-base font-normal italic sm:w-22">
                                <span>(</span>
                                <span>{` 0${index + 1} `}</span>
                                <span>)</span>
                            </span>

                            <span className="text-base font-normal mt-auto">
                                {project.year}
                            </span>
                        </button>

                        {hoveredProjectId === project.id && (
                            <ProjectPreview
                                project={project}
                            />
                        )}
                    </div>
                ))}
            </div>

            {projectsState.status === "loading" && <p role="status" className="p-8">{text.loadingProjects}</p>}
            {projectsState.status === "error" && <p role="alert" className="p-8">{projectsState.message}</p>}
            {projectsState.status === "ready" && projectList.length === 0 && <p role="status" className="p-8">{text.noProjects}</p>}

            {selectedProject && (
                <ProjectModal
                    project={selectedProject}
                    onClose={() => setSelectedProjectId(null)}
                    onPrevious={setPreviousProject}
                    onNext={setNextProject}
                />
            )}

        </div>
    );
};

export default ProjectsPage;
