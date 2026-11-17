import { useEffect, useState } from "react";
import type { CmsProject } from "../types/CmsProject";
import { ContentfulDataError } from "./client";
import { fetchProjects } from "./projects";

type ProjectsState =
    | { status: "loading"; projects: [] }
    | { status: "error"; projects: []; message: string }
    | { status: "ready"; projects: CmsProject[] };

export function useProjects(): ProjectsState {
    const [state, setState] = useState<ProjectsState>({ status: "loading", projects: [] });

    useEffect(() => {
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
