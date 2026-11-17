import { createClient } from "contentful";
import type { Language } from "../types/Language";

export class ContentfulDataError extends Error {
    constructor(message: string, private readonly englishMessage: string) {
        super(message);
    }

    forLanguage(language: Language): string {
        return language === "en" ? this.englishMessage : this.message;
    }
}

export function getContentfulClient() {
    const config = __CONTENTFUL_CONFIG__;
    if (!config.space || !config.accessToken || !["us", "eu"].includes(config.region)) {
        throw new ContentfulDataError("La configuración pública de Contentful está incompleta o es inválida.", "The public Contentful configuration is incomplete or invalid.");
    }

    return createClient({
        space: config.space,
        accessToken: config.accessToken,
        host: config.region === "eu" ? "cdn.eu.contentful.com" : "cdn.contentful.com",
    });
}
