import { useEffect, useState } from "react";
import { useLanguage } from "../i18n/languageContext";
import { useTranslation } from "../i18n/translations";
import { getContentfulErrorMessage } from "./client";
import { fetchGallery, type GalleryMedia } from "./gallery";

type GalleryResult =
    | { status: "loading" }
    | { status: "unavailable" }
    | { status: "ready"; media: GalleryMedia[] }
    | { status: "error"; error: unknown };

export function useGallery() {
    const { language } = useLanguage();
    const text = useTranslation();
    const [result, setResult] = useState<GalleryResult>({ status: "loading" });

    useEffect(() => {
        let isActive = true;
        fetchGallery().then(
            media => {
                if (isActive) setResult(media ? { status: "ready", media } : { status: "unavailable" });
            },
            error => {
                if (isActive) setResult({ status: "error", error });
            },
        );
        return () => { isActive = false; };
    }, []);

    if (result.status === "error") {
        return {
            status: "error",
            message: getContentfulErrorMessage(result.error, language, text.galleryLoadError),
        } as const;
    }
    return result;
}
