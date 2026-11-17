import { z } from "zod";
import { ContentfulDataError, getContentfulClient } from "./client";
import { readImage } from "./projects";

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

        let url: URL;
        try {
            url = new URL(file.url.startsWith("//") ? `https:${file.url}` : file.url);
        } catch {
            throw new ContentfulDataError("Un vídeo de la galería tiene una URL inválida.", "A gallery video has an invalid URL.");
        }
        const allowedHosts = ["videos.ctfassets.net", "videos.eu.ctfassets.net", "assets.ctfassets.net", "assets.eu.ctfassets.net"];
        if (url.protocol !== "https:" || url.username || url.password || url.port || !allowedHosts.includes(url.hostname)) {
            throw new ContentfulDataError("Un vídeo de la galería tiene un origen no permitido.", "A gallery video has a disallowed origin.");
        }
        return { type: "video", url: url.href };
    });
}

export async function fetchGallery(): Promise<GalleryMedia[] | null> {
    const response = await getContentfulClient().withAllLocales.getEntries({
        content_type: "galeriaInicio",
        include: 1,
        limit: 2,
    });
    if (response.total === 0) return null;
    if (response.total !== 1 || response.items.length !== 1) {
        throw new ContentfulDataError(
            "Debe haber una sola entrada de la galería publicada en Contentful.",
            "There must be exactly one published gallery entry in Contentful.",
        );
    }
    return parseGallery(response.items[0]);
}
