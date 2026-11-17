import { useEffect, useState, type ReactNode } from "react";
import type { Language } from "../types/Language";
import { LanguageContext } from "./languageContext";

const STORAGE_KEY = "portfolio-language";

function readLanguage(): Language {
    try {
        return localStorage.getItem(STORAGE_KEY) === "en" ? "en" : "es";
    } catch (error) {
        console.warn("No se pudo leer el idioma guardado en el navegador.", error);
        return "es";
    }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setCurrentLanguage] = useState<Language>(readLanguage);

    useEffect(() => {
        document.documentElement.lang = language;
    }, [language]);

    const setLanguage = (nextLanguage: Language) => {
        setCurrentLanguage(nextLanguage);
        try {
            localStorage.setItem(STORAGE_KEY, nextLanguage);
        } catch (error) {
            console.warn("No se pudo guardar el idioma en el navegador.", error);
        }
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
}
