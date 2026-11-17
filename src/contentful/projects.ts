import { BLOCKS, INLINES, type Block, type Document, type Inline } from "@contentful/rich-text-types";
import { z } from "zod";
import type { CmsProject } from "../types/CmsProject";
import type { Language } from "../types/Language";
import { ContentfulDataError, getContentfulClient } from "./client";

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

    const rawUrl = asset.data.fields.file.url;
    let url: URL;
    try {
        url = new URL(rawUrl.startsWith("//") ? `https:${rawUrl}` : rawUrl);
    } catch {
        throw new ContentfulDataError("Una imagen de Contentful tiene una URL inválida.", "A Contentful image has an invalid URL.");
    }

    const allowedHosts = ["images.ctfassets.net", "images.eu.ctfassets.net"];
    if (url.protocol !== "https:" || url.username || url.password || url.port || !allowedHosts.includes(url.hostname)) {
        throw new ContentfulDataError("Una imagen de Contentful tiene un origen no permitido.", "A Contentful image has a disallowed origin.");
    }

    return {
        url: url.href,
        alt: asset.data.fields.description?.trim() || asset.data.fields.title?.trim() || fallbackAlt,
    };
}

const nodeSchema: z.ZodType<unknown> = z.lazy(() => z.union([
    z.object({
        nodeType: z.literal("text"),
        data: z.record(z.string(), z.unknown()),
        value: z.string(),
        marks: z.array(z.object({ type: z.string() })),
    }),
    z.object({
        nodeType: z.string(),
        data: z.record(z.string(), z.unknown()),
        content: z.array(nodeSchema),
    }).refine(node => node.nodeType !== "text"),
]));

function isDocument(value: unknown): value is Document {
    return z.object({
        nodeType: z.literal(BLOCKS.DOCUMENT),
        data: z.record(z.string(), z.unknown()),
        content: z.array(z.object({
            nodeType: z.string().refine(type => type !== "text"),
            data: z.record(z.string(), z.unknown()),
            content: z.array(nodeSchema),
        })),
    }).safeParse(value).success;
}

function validateNodes(node: Block | Inline, title: string, locale: Language): void {
    const supportedNodes: string[] = [
        BLOCKS.PARAGRAPH, BLOCKS.HEADING_1, BLOCKS.HEADING_2, BLOCKS.HEADING_3,
        BLOCKS.HEADING_4, BLOCKS.HEADING_5, BLOCKS.HEADING_6, BLOCKS.UL_LIST,
        BLOCKS.OL_LIST, BLOCKS.LIST_ITEM, BLOCKS.QUOTE, BLOCKS.HR,
        BLOCKS.TABLE, BLOCKS.TABLE_ROW, BLOCKS.TABLE_CELL, BLOCKS.TABLE_HEADER_CELL,
        BLOCKS.EMBEDDED_ASSET, INLINES.HYPERLINK,
    ];
    if (!supportedNodes.includes(node.nodeType)) {
        throw new ContentfulDataError("El contenido contiene un bloque no compatible.", "The content contains an unsupported block.");
    }
    if (node.nodeType === BLOCKS.EMBEDDED_ASSET) {
        readImage(node.data.target, title, locale);
    }
    if (node.nodeType === INLINES.HYPERLINK) {
        const href = z.string().safeParse(node.data.uri);
        if (!href.success || !/^(https?:|mailto:)/i.test(href.data)) {
            throw new ContentfulDataError("El contenido contiene un enlace no permitido.", "The content contains a disallowed link.");
        }
    }
    for (const child of node.content) {
        if ("content" in child) validateNodes(child, title, locale);
    }
}

export function getContentImages(document: Document, title: string, locale: Language = "es"): string[] {
    const images: string[] = [];
    function visit(node: Block | Inline) {
        if (node.nodeType === BLOCKS.EMBEDDED_ASSET) images.push(readImage(node.data.target, title, locale).url);
        for (const child of node.content) {
            if ("content" in child) visit(child);
        }
    }
    document.content.forEach(visit);
    return images;
}

export function splitProjectContent(document: Document): Document[] {
    const sections: Document[] = [];
    let content: Document["content"] = [];

    for (const block of document.content) {
        if (block.nodeType === BLOCKS.HR) {
            if (content.length > 0) sections.push({ ...document, content });
            content = [];
        } else {
            content.push(block);
        }
    }

    if (content.length > 0) sections.push({ ...document, content });
    return sections;
}

const entrySchema = z.object({
    sys: z.object({ id: z.string().min(1) }),
    fields: z.object({
        titulo: z.string().trim().min(1),
        portada: z.unknown(),
        categorias: z.array(z.string().trim().min(1)).optional(),
        textoProyecto: z.unknown(),
        fechaPublicacin: z.union([z.iso.date(), z.iso.datetime({ offset: true })]).optional(),
    }),
});

export function parseRichText(value: unknown, fallbackAlt: string, locale: Language): Document {
    if (!isDocument(value)) {
        throw new ContentfulDataError("El texto enriquecido no es válido.", "The rich text is invalid.");
    }
    for (const node of value.content) validateNodes(node, fallbackAlt, locale);
    return value;
}

export function parseProject(value: unknown, locale: Language = "es"): CmsProject {
    const result = entrySchema.safeParse(value);
    if (!result.success) {
        const fields = [...new Set(result.error.issues.map(issue => issue.path.slice(0, 2).join(".")))];
        throw new ContentfulDataError(
            `Un proyecto publicado tiene campos incompletos o inválidos: ${fields.join(", ")}.`,
            `A published project has missing or invalid fields: ${fields.join(", ")}.`,
        );
    }

    const { sys, fields } = result.data;
    const image = readImage(fields.portada, fields.titulo, locale);
    const richContent = parseRichText(fields.textoProyecto, fields.titulo, locale);

    return {
        id: sys.id,
        title: fields.titulo,
        tags: fields.categorias ?? [],
        image: image.url,
        imageAlt: image.alt,
        year: fields.fechaPublicacin ? Number(fields.fechaPublicacin.slice(0, 4)) : undefined,
        richContent,
    };
}

const localizedEntrySchema = z.object({
    sys: z.object({ id: z.string().min(1) }),
    fields: z.record(z.string(), z.record(z.string(), z.unknown())),
});

export function parseLocalizedProject(value: unknown, locale: Language): CmsProject {
    const result = localizedEntrySchema.safeParse(value);
    if (!result.success) {
        throw new ContentfulDataError(
            "Un proyecto publicado tiene campos localizados inválidos.",
            "A published project has invalid localized fields.",
        );
    }
    const { sys, fields } = result.data;
    const missingFields = [
        fields.titulo?.[locale] === undefined ? "titulo" : null,
        fields.textoProyecto?.[locale] === undefined ? "textoProyecto" : null,
    ].filter(field => field !== null);
    if (missingFields.length > 0) {
        throw new ContentfulDataError(
            `Al proyecto ${sys.id} le faltan traducciones (${locale}): ${missingFields.join(", ")}.`,
            `Project ${sys.id} is missing translations (${locale}): ${missingFields.join(", ")}.`,
        );
    }
    return parseProject({
        sys,
        fields: {
            titulo: fields.titulo?.[locale],
            categorias: fields.categorias?.[locale],
            textoProyecto: fields.textoProyecto?.[locale],
            portada: fields.portada?.es,
            fechaPublicacin: fields.fechaPublicacin?.es,
        },
    }, locale);
}

export async function fetchProjects(locale: Language): Promise<CmsProject[]> {
    const client = getContentfulClient().withAllLocales;

    const projects: CmsProject[] = [];
    let total = 0;
    do {
        const response = await client.getEntries({
            content_type: "proyecto",
            limit: 100,
            skip: projects.length,
            include: 4,
        });
        total = response.total;
        if (response.items.length === 0 && projects.length < total) {
            throw new ContentfulDataError("No se pudieron recuperar todos los proyectos.", "Could not retrieve all projects.");
        }
        projects.push(...response.items.map(item => parseLocalizedProject(item, locale)));
    } while (projects.length < total);
    return projects;
}
