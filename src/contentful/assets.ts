import { z } from "zod";
import type { Language } from "../types/Language";
import { ContentfulDataError } from "./client";

const assetSchema = z.object({
    fields: z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        file: z.object({ url: z.string() }),
    }),
});

const localizedAssetSchema = z.object({
    fields: z.object({
        title: z.record(z.string(), z.unknown()).optional(),
        description: z.record(z.string(), z.unknown()).optional(),
        file: z.record(z.string(), z.unknown()),
    }),
});

export function readAssetUrl(
    rawUrl: string,
    allowedHosts: readonly string[],
    invalidUrlError: ContentfulDataError,
    disallowedOriginError: ContentfulDataError,
): string {
    let url: URL;
    try {
        url = new URL(rawUrl.startsWith("//") ? `https:${rawUrl}` : rawUrl);
    } catch {
        throw invalidUrlError;
    }

    if (url.protocol !== "https:" || url.username || url.password || url.port || !allowedHosts.includes(url.hostname)) {
        throw disallowedOriginError;
    }
    return url.href;
}

export function readImage(value: unknown, fallbackAlt: string, locale: Language = "es") {
    let asset = assetSchema.safeParse(value);
    if (!asset.success) {
        const localized = localizedAssetSchema.safeParse(value);
        if (localized.success) {
            const fields = localized.data.fields;
            asset = assetSchema.safeParse({
                fields: {
                    title: fields.title?.[locale] ?? fields.title?.es,
                    description: fields.description?.[locale] ?? fields.description?.es,
                    file: fields.file[locale] ?? fields.file.es,
                },
            });
        }
    }
    if (!asset.success) throw new ContentfulDataError("Una imagen de Contentful no está disponible.", "A Contentful image is unavailable.");

    return {
        url: readAssetUrl(
            asset.data.fields.file.url,
            ["images.ctfassets.net", "images.eu.ctfassets.net"],
            new ContentfulDataError("Una imagen de Contentful tiene una URL inválida.", "A Contentful image has an invalid URL."),
            new ContentfulDataError("Una imagen de Contentful tiene un origen no permitido.", "A Contentful image has a disallowed origin."),
        ),
        alt: asset.data.fields.description?.trim() || asset.data.fields.title?.trim() || fallbackAlt,
    };
}
