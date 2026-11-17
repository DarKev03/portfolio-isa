import { z } from "zod";
import type { CmsAbout } from "../types/CmsAbout";
import type { Language } from "../types/Language";
import { ContentfulDataError, getContentfulClient } from "./client";
import { parseRichText, readImage } from "./projects";

const aboutSchema = z.object({
    fields: z.object({
        textoSobreMi: z.record(z.string(), z.unknown()).optional(),
        fotosDeslizantesSobreMi: z.record(z.string(), z.unknown()).optional(),
    }),
});

const photoSchema = z.object({
    fields: z.object({ file: z.record(z.string(), z.unknown()) }),
});
const imageFileSchema = z.object({
    contentType: z.string().regex(/^image\//i),
});

export function parseAbout(value: unknown, locale: Language): CmsAbout {
    const entry = aboutSchema.safeParse(value);
    if (!entry.success) {
        throw new ContentfulDataError("La entrada de «Sobre mí» contiene campos inválidos.", "The About me entry contains invalid fields.");
    }

    const richText = entry.data.fields.textoSobreMi?.[locale];
    if (richText === undefined) {
        throw new ContentfulDataError(
            `Falta la traducción (${locale}) de textoSobreMi.`,
            `The translation (${locale}) of textoSobreMi is missing.`,
        );
    }

    const photoList = entry.data.fields.fotosDeslizantesSobreMi?.es;
    const photos = z.array(z.unknown()).max(2).safeParse(photoList === undefined ? [] : photoList);
    if (!photos.success) {
        throw new ContentfulDataError("«Sobre mí» necesita una lista válida de hasta dos fotos.", "About me requires a valid list of up to two photos.");
    }
    return {
        richContent: parseRichText(richText, "Isabel Faubel", locale),
        photos: photos.data.map(photo => {
            const asset = photoSchema.safeParse(photo);
            const file = asset.success ? asset.data.fields.file[locale] ?? asset.data.fields.file.es : undefined;
            if (!imageFileSchema.safeParse(file).success) {
                throw new ContentfulDataError("Una foto de «Sobre mí» no es una imagen publicada válida.", "An About me photo is not a valid published image.");
            }
            return readImage(photo, "Isabel Faubel", locale);
        }),
    };
}

export async function fetchAbout(locale: Language): Promise<CmsAbout | null> {
    const response = await getContentfulClient().withAllLocales.getEntries({
        content_type: "sobreMi",
        include: 4,
        limit: 2,
    });
    if (response.total === 0) return null;
    if (response.total !== 1 || response.items.length !== 1) {
        throw new ContentfulDataError("Debe haber una sola entrada de «Sobre mí» publicada en Contentful.", "There must be exactly one published About me entry in Contentful.");
    }
    return parseAbout(response.items[0], locale);
}
