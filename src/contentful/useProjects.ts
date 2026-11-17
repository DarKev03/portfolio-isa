import { useEffect, useState } from "react";
import localProjects from "../assets/projects.json";
import type { Project } from "../types/Project";
import type { DisplayProject } from "../types/CmsProject";
import { ContentfulDataError, fetchProjects } from "./projects";

type ProjectsState =
    | { status: "loading"; projects: [] }
    | { status: "error"; projects: []; message: string }
    | { status: "ready"; projects: DisplayProject[] };

export function useProjects(): ProjectsState {
    const [state, setState] = useState<ProjectsState>(() =>
        __CONTENTFUL_CONFIG__
            ? { status: "loading", projects: [] }
            : { status: "ready", projects: localProjects as Project[] }
    );

    useEffect(() => {
        if (!__CONTENTFUL_CONFIG__) return;

        let isActive = true;
        fetchProjects("es").then(
            projects => {
                if (isActive) setState({ status: "ready", projects });
            },
            error => {
                if (isActive) setState({
                    status: "error",
                    projects: [],
                    message: error instanceof ContentfulDataError
                        ? error.message
                        : "No se pudieron cargar los proyectos. Comprueba la conexión y la configuración de Contentful.",
                });
            },
        );
        return () => { isActive = false; };
    }, []);

    return state;
}
