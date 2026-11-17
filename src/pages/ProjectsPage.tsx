import Title from "../components/Title";
import projectsData from "../assets/projects.json";
import { Project } from "../types/Project";
import { useRef, useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import gif from "../assets/videos/video_projects.mp4";
import ProjectModal from "../components/ProjectModal";
import ProjectPreview from "../components/ProjectPreview";
import gsap from 'gsap';
import { Link, useNavigate, useParams } from "react-router-dom";

let hasHoveredInSession = false;

const ProjectsPage = () => {
    const backgroundRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const projectList: Project[] = projectsData as Project[];
    const castoroFamily = { fontFamily: "'Castoro', serif" };

    const [hoveredProjectId, setHoveredProjectId] = useState<number | null>(null);
    const [alreadyHovered, setAlreadyHovered] = useState<boolean>(hasHoveredInSession);

    const selectedProject = projectList.find(project => String(project.id) === id);

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

        navigate(`/projects/${projectList[previousIndex].id}`);
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

        navigate(`/projects/${projectList[nextIndex].id}`);
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
                    <Link
                        key={project.id}
                        to={`/projects/${project.id}`}
                        className="group relative flex w-full flex-row items-center gap-3 px-4 transition-colors duration-500 ease-in-out hover:text-gray-600 sm:gap-8 sm:px-11 lg:gap-25"
                        onMouseEnter={() => handleMouseEnter(project.id)}
                        onMouseLeave={() => setHoveredProjectId(null)}
                    >
                        <div className="m-0 mt-auto flex min-w-0 flex-1 flex-col items-start sm:w-64 sm:flex-none">
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

                        <div className="mt-auto flex w-12 shrink-0 justify-between text-base font-normal italic sm:w-22">
                            <span>(</span>
                            <span>{` 0${index + 1} `}</span>
                            <span>)</span>
                        </div>

                        <span className="text-base font-normal mt-auto">
                            {project.year}
                        </span>

                        {!alreadyHovered && project.id === 1 && (
                            <div className="pointer-events-none absolute bottom-0 left-250 hidden aspect-square w-90 lg:block">
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
                    </Link>
                ))}
            </div>

            {id && !selectedProject && (
                <div role="status" className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[rgba(255,254,253,1)]">
                    <p>Proyecto no encontrado</p>
                    <Link to="/projects" className="mt-4 underline">Volver a proyectos</Link>
                </div>
            )}

            {selectedProject && (
                <ProjectModal
                    project={selectedProject}
                    onClose={() => navigate("/projects")}
                    onPrevious={setPreviousProject}
                    onNext={setNextProject}
                />
            )}

        </div>
    );
};

export default ProjectsPage;
