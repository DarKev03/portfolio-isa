import { z } from "zod";
import { ContentfulDataError, fetchSingleEntry } from "./client";
import { readAssetUrl, readImage } from "./assets";

export interface GalleryMedia {
    type: "image" | "video";
    url: string;
}

const gallerySchema = z.object({
    fields: z.object({
        fotosGalera: z.object({ es: z.array(z.unknown()).min(1) }),
    }),
});

const assetSchema = z.object({
    fields: z.object({
        file: z.object({
            es: z.object({ url: z.string(), contentType: z.string() }),
        }),
    }),
});

export function parseGallery(value: unknown): GalleryMedia[] {
    const gallery = gallerySchema.safeParse(value);
    if (!gallery.success) {
        throw new ContentfulDataError(
            "La galería necesita al menos una imagen o vídeo publicado.",
            "The gallery requires at least one published image or video.",
        );
    }

    return gallery.data.fields.fotosGalera.es.map(media => {
        const asset = assetSchema.safeParse(media);
        if (!asset.success || !/^(image|video)\//i.test(asset.data.fields.file.es.contentType)) {
            throw new ContentfulDataError(
                "La galería contiene un archivo multimedia inválido o sin publicar.",
                "The gallery contains invalid or unpublished media.",
            );
        }

        const file = asset.data.fields.file.es;
        if (/^image\//i.test(file.contentType)) {
            return { type: "image", url: readImage(media, "Galería", "es").url };
        }

        return {
            type: "video",
            url: readAssetUrl(
                file.url,
                ["videos.ctfassets.net", "videos.eu.ctfassets.net", "assets.ctfassets.net", "assets.eu.ctfassets.net"],
                new ContentfulDataError("Un vídeo de la galería tiene una URL inválida.", "A gallery video has an invalid URL."),
                new ContentfulDataError("Un vídeo de la galería tiene un origen no permitido.", "A gallery video has a disallowed origin."),
            ),
        };
    });
}

export async function fetchGallery(): Promise<GalleryMedia[] | null> {
    const entry = await fetchSingleEntry(
        "galeriaInicio",
        1,
        new ContentfulDataError(
            "Debe haber una sola entrada de la galería publicada en Contentful.",
            "There must be exactly one published gallery entry in Contentful.",
        ),
    );
    return entry === null ? null : parseGallery(entry.value);
}
