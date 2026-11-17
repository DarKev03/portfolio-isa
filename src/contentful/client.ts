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

export function getContentfulErrorMessage(error: unknown, language: Language, fallback: string): string {
    return error instanceof ContentfulDataError ? error.forLanguage(language) : fallback;
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

export async function fetchSingleEntry(
    contentType: string,
    include: 1 | 4,
    multipleEntriesError: ContentfulDataError,
): Promise<{ value: unknown } | null> {
    const response = await getContentfulClient().withAllLocales.getEntries({
        content_type: contentType,
        include,
        limit: 2,
    });
    if (response.total === 0) return null;
    if (response.total !== 1 || response.items.length !== 1) throw multipleEntriesError;
    return { value: response.items[0] };
}
