import { useEffect, useState } from "react";
import type { CmsProject } from "../types/CmsProject";
import { ContentfulDataError } from "./client";
import { fetchProjects } from "./projects";
import { useLanguage } from "../i18n/languageContext";
import { useTranslation } from "../i18n/translations";

type ProjectsState =
    | { status: "loading"; projects: [] }
    | { status: "error"; projects: []; message: string }
    | { status: "ready"; projects: CmsProject[] };

type InternalProjectsState =
    | { status: "loading"; projects: [] }
    | { status: "error"; projects: []; error: unknown }
    | { status: "ready"; projects: CmsProject[] };

export function useProjects(): ProjectsState {
    const { language } = useLanguage();
    const text = useTranslation();
    const [state, setState] = useState<InternalProjectsState>({ status: "loading", projects: [] });

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
                    error,
                });
            },
        );
        return () => { isActive = false; };
    }, []);

    if (state.status === "error") {
        return {
            status: "error",
            projects: [],
            message: state.error instanceof ContentfulDataError
                ? state.error.forLanguage(language)
                : text.projectLoadError,
        };
    }
    return state;
}
