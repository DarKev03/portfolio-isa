import { Project } from "../types/Project";
import ProjectDetail from "./ProjectDetail";

interface ProjectModalProps {
    project: Project;
    onClose: () => void;
}

const ProjectModal = ({
    project,
    onClose
}: ProjectModalProps) => {
    return (
        <div
            className="
                fixed inset-0
                z-50
                bg-transparent
                flex items-center justify-center
            "
            onClick={onClose}
        >
            <div
                className="
                    w-screen
                    h-screen
                    max-w-400
                    bg-transparent
                    shadow-2xl
                "
            >
                <ProjectDetail
                    project={project}
                    onClose={onClose}
                />
            </div>
        </div>
    );
};

export default ProjectModal;