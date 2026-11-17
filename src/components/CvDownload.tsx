import { useEffect, useRef, useState } from "react";
import { getContentfulErrorMessage } from "../contentful/client";
import { fetchCv } from "../contentful/cv";
import type { Language } from "../types/Language";
import { useTranslation } from "../i18n/translations";

type CvState =
    | { status: "loading" }
    | { status: "unavailable" }
    | { status: "ready"; url: string }
    | { status: "error"; error: unknown };

interface CvDownloadProps {
    language: Language;
}

const CvDownload = ({ language }: CvDownloadProps) => {
    const text = useTranslation();
    const [state, setState] = useState<CvState>({ status: "loading" });
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadError, setDownloadError] = useState("");
    const downloadRef = useRef<AbortController | null>(null);

    useEffect(() => {
        let isActive = true;
        fetchCv(language).then(
            url => {
                if (isActive) setState(url ? { status: "ready", url } : { status: "unavailable" });
            },
            error => {
                if (isActive) setState({
                    status: "error",
                    error,
                });
            },
        );
        return () => {
            isActive = false;
            downloadRef.current?.abort();
        };
    }, [language]);

    const download = async () => {
        if (state.status !== "ready" || isDownloading) return;

        const controller = new AbortController();
        downloadRef.current = controller;
        setIsDownloading(true);
        setDownloadError("");
        try {
            const response = await fetch(state.url, { signal: controller.signal, redirect: "error" });
            if (!response.ok || !/^application\/pdf(?:\s*;|$)/i.test(response.headers.get("content-type") ?? "")) {
                throw new Error("Respuesta de PDF inválida.");
            }
            const file = await response.blob();
            if (controller.signal.aborted) return;
            const objectUrl = URL.createObjectURL(file);
            const link = document.createElement("a");
            link.href = objectUrl;
            link.download = `CV-${language}.pdf`;
            document.body.appendChild(link);
            try {
                link.click();
            } finally {
                link.remove();
                window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
            }
        } catch {
            if (!controller.signal.aborted) {
                setDownloadError(text.cvDownloadError);
            }
        } finally {
            if (!controller.signal.aborted) {
                downloadRef.current = null;
                setIsDownloading(false);
            }
        }
    };

    return (
        <div>
            <button
                type="button"
                onClick={download}
                disabled={state.status !== "ready" || isDownloading}
                className="text-lg font-normal leading-tight italic text-[#4c4c4c9e] enabled:cursor-pointer enabled:text-[#4c4c4c] enabled:hover:text-[#414141] disabled:cursor-not-allowed"
            >
                ( {text.downloadCv} )
            </button>
            {state.status === "loading" && <p role="status" className="text-sm">{text.loadingCv}</p>}
            {state.status === "unavailable" && <p role="status" className="text-sm">{text.unavailableCv}</p>}
            {state.status === "error" && <p role="alert" className="text-sm">{getContentfulErrorMessage(state.error, language, text.cvLoadError)}</p>}
            {downloadError && <p role="alert" className="text-sm">{downloadError}</p>}
        </div>
    );
};

export default CvDownload;
