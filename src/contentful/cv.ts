import { z } from "zod";
import type { Language } from "../types/Language";
import { ContentfulDataError, getContentfulClient } from "./client";

const cvSchema = z.object({
    fields: z.object({
        cv: z.record(z.string(), z.unknown()),
    }),
});

const assetSchema = z.object({
    fields: z.object({
        file: z.record(z.string(), z.unknown()),
    }),
});

const fileSchema = z.object({
    url: z.string(),
    contentType: z.literal("application/pdf"),
});

export function parseCv(value: unknown, locale: Language): string {
    const result = cvSchema.safeParse(value);
    if (!result.success) {
        throw new ContentfulDataError("El CV publicado no contiene un archivo PDF válido para este idioma.", "The published CV does not contain a valid PDF for this language.");
    }

    const asset = assetSchema.safeParse(result.data.fields.cv[locale]);
    const file = fileSchema.safeParse(asset.success ? asset.data.fields.file[locale] ?? asset.data.fields.file.es : undefined);
    if (!file.success) {
        throw new ContentfulDataError("El CV publicado no contiene un archivo PDF válido para este idioma.", "The published CV does not contain a valid PDF for this language.");
    }

    const rawUrl = file.data.url;
    let url: URL;
    try {
        url = new URL(rawUrl.startsWith("//") ? `https:${rawUrl}` : rawUrl);
    } catch {
        throw new ContentfulDataError("El CV publicado tiene una URL inválida.", "The published CV has an invalid URL.");
    }

    const allowedHosts = ["assets.ctfassets.net", "assets.eu.ctfassets.net", "downloads.ctfassets.net", "downloads.eu.ctfassets.net"];
    if (url.protocol !== "https:" || url.username || url.password || url.port || !allowedHosts.includes(url.hostname)) {
        throw new ContentfulDataError("El CV publicado tiene un origen no permitido.", "The published CV has a disallowed origin.");
    }
    return url.href;
}

export async function fetchCv(locale: Language): Promise<string | null> {
    const response = await getContentfulClient().withAllLocales.getEntries({
        content_type: "cv",
        include: 1,
        limit: 2,
    });
    if (response.total === 0) return null;
    if (response.total !== 1 || response.items.length !== 1) {
        throw new ContentfulDataError("Debe haber una sola entrada de CV publicada en Contentful.", "There must be exactly one published CV entry in Contentful.");
    }
    return parseCv(response.items[0], locale);
}
