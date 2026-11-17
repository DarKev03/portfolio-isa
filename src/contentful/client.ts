import { createClient } from "contentful";

export class ContentfulDataError extends Error {}

export function getContentfulClient() {
    const config = __CONTENTFUL_CONFIG__;
    if (!config.space || !config.accessToken || !["us", "eu"].includes(config.region)) {
        throw new ContentfulDataError("La configuración pública de Contentful está incompleta o es inválida.");
    }

    return createClient({
        space: config.space,
        accessToken: config.accessToken,
        host: config.region === "eu" ? "cdn.eu.contentful.com" : "cdn.contentful.com",
    });
}
