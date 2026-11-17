import { z } from "zod";
import type { Language } from "../types/Language";
import { ContentfulDataError, fetchSingleEntry } from "./client";
import { readAssetUrl } from "./assets";

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

    return readAssetUrl(
        file.data.url,
        ["assets.ctfassets.net", "assets.eu.ctfassets.net", "downloads.ctfassets.net", "downloads.eu.ctfassets.net"],
        new ContentfulDataError("El CV publicado tiene una URL inválida.", "The published CV has an invalid URL."),
        new ContentfulDataError("El CV publicado tiene un origen no permitido.", "The published CV has a disallowed origin."),
    );
}

export async function fetchCv(locale: Language): Promise<string | null> {
    const entry = await fetchSingleEntry(
        "cv",
        1,
        new ContentfulDataError("Debe haber una sola entrada de CV publicada en Contentful.", "There must be exactly one published CV entry in Contentful."),
    );
    return entry === null ? null : parseCv(entry.value, locale);
}
