import { useEffect, useState } from "react";
import { useLanguage } from "../i18n/languageContext";
import { useTranslation } from "../i18n/translations";
import type { CmsAbout } from "../types/CmsAbout";
import type { Language } from "../types/Language";
import { fetchAbout } from "./about";
import { getContentfulErrorMessage } from "./client";

type AboutResult =
    | { status: "loading" }
    | { status: "unavailable" }
    | { status: "ready"; content: CmsAbout }
    | { status: "error"; error: unknown };

export function useAbout() {
    const { language } = useLanguage();
    const text = useTranslation();
    const [state, setState] = useState<{ language: Language; result: AboutResult }>({
        language,
        result: { status: "loading" },
    });

    useEffect(() => {
        let isActive = true;
        fetchAbout(language).then(
            content => {
                if (isActive) setState({ language, result: content ? { status: "ready", content } : { status: "unavailable" } });
            },
            error => {
                if (isActive) setState({ language, result: { status: "error", error } });
            },
        );
        return () => { isActive = false; };
    }, [language]);

    if (state.language !== language) return { status: "loading" } as const;
    if (state.result.status === "error") {
        return {
            status: "error",
            message: getContentfulErrorMessage(state.result.error, language, text.aboutLoadError),
        } as const;
    }
    return state.result;
}
