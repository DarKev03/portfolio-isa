import { useEffect, useState } from "react";
import type { CmsProject } from "../types/CmsProject";
import { getContentfulErrorMessage } from "./client";
import { fetchProjects } from "./projects";
import { useLanguage } from "../i18n/languageContext";
import { useTranslation } from "../i18n/translations";
import type { Language } from "../types/Language";

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
    const [state, setState] = useState<{ language: Language; result: InternalProjectsState }>({
        language,
        result: { status: "loading", projects: [] },
    });

    useEffect(() => {
        let isActive = true;
        fetchProjects(language).then(
            projects => {
                if (isActive) setState({ language, result: { status: "ready", projects } });
            },
            error => {
                if (isActive) setState({
                    language,
                    result: { status: "error", projects: [], error },
                });
            },
        );
        return () => { isActive = false; };
    }, [language]);

    if (state.language !== language) return { status: "loading", projects: [] };
    const result = state.result;
    if (result.status === "error") {
        return {
            status: "error",
            projects: [],
            message: getContentfulErrorMessage(result.error, language, text.projectLoadError),
        };
    }
    return result;
}
