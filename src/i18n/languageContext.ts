import { createContext, useContext } from "react";
import type { Language } from "../types/Language";

interface LanguageContextValue {
    language: Language;
    setLanguage: (language: Language) => void;
}

export const LanguageContext = createContext<LanguageContextValue | null>(null);

export function useLanguage(): LanguageContextValue {
    const context = useContext(LanguageContext);
    if (!context) throw new Error("LanguageProvider is missing.");
    return context;
}
