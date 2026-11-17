import { BLOCKS, INLINES, type Block, type Document, type Inline } from "@contentful/rich-text-types";
import { z } from "zod";
import type { CmsProject } from "../types/CmsProject";
import { ContentfulDataError, getContentfulClient } from "./client";

const assetSchema = z.object({
    fields: z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        file: z.object({ url: z.string() }),
    }),
});

export function readImage(value: unknown, fallbackAlt: string) {
    const asset = assetSchema.safeParse(value);
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

function validateNodes(node: Block | Inline, title: string): void {
    const supportedNodes: string[] = [
        BLOCKS.PARAGRAPH, BLOCKS.HEADING_1, BLOCKS.HEADING_2, BLOCKS.HEADING_3,
        BLOCKS.HEADING_4, BLOCKS.HEADING_5, BLOCKS.HEADING_6, BLOCKS.UL_LIST,
        BLOCKS.OL_LIST, BLOCKS.LIST_ITEM, BLOCKS.QUOTE, BLOCKS.HR,
        BLOCKS.TABLE, BLOCKS.TABLE_ROW, BLOCKS.TABLE_CELL, BLOCKS.TABLE_HEADER_CELL,
        BLOCKS.EMBEDDED_ASSET, INLINES.HYPERLINK,
    ];
    if (!supportedNodes.includes(node.nodeType)) {
        throw new ContentfulDataError("El proyecto contiene un bloque no compatible.", "The project contains an unsupported block.");
    }
    if (node.nodeType === BLOCKS.EMBEDDED_ASSET) {
        readImage(node.data.target, title);
    }
    if (node.nodeType === INLINES.HYPERLINK) {
        const href = z.string().safeParse(node.data.uri);
        if (!href.success || !/^(https?:|mailto:)/i.test(href.data)) {
            throw new ContentfulDataError("El proyecto contiene un enlace no permitido.", "The project contains a disallowed link.");
        }
    }
    for (const child of node.content) {
        if ("content" in child) validateNodes(child, title);
    }
}

export function getContentImages(document: Document, title: string): string[] {
    const images: string[] = [];
    function visit(node: Block | Inline) {
        if (node.nodeType === BLOCKS.EMBEDDED_ASSET) images.push(readImage(node.data.target, title).url);
        for (const child of node.content) {
            if ("content" in child) visit(child);
        }
    }
    document.content.forEach(visit);
    return images;
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

export function parseProject(value: unknown): CmsProject {
    const result = entrySchema.safeParse(value);
    if (!result.success) {
        const fields = [...new Set(result.error.issues.map(issue => issue.path.slice(0, 2).join(".")))];
        throw new ContentfulDataError(
            `Un proyecto publicado tiene campos incompletos o inválidos: ${fields.join(", ")}.`,
            `A published project has missing or invalid fields: ${fields.join(", ")}.`,
        );
    }

    const { sys, fields } = result.data;
    const image = readImage(fields.portada, fields.titulo);
    if (!isDocument(fields.textoProyecto)) {
        throw new ContentfulDataError("El texto enriquecido de un proyecto no es válido.", "A project's rich text is invalid.");
    }
    for (const node of fields.textoProyecto.content) validateNodes(node, fields.titulo);

    return {
        id: sys.id,
        title: fields.titulo,
        tags: fields.categorias ?? [],
        image: image.url,
        imageAlt: image.alt,
        year: fields.fechaPublicacin ? Number(fields.fechaPublicacin.slice(0, 4)) : undefined,
        richContent: fields.textoProyecto,
    };
}

export async function fetchProjects(locale: "es" | "en"): Promise<CmsProject[]> {
    const client = getContentfulClient();

    const projects: CmsProject[] = [];
    let total = 0;
    do {
        const response = await client.getEntries({
            content_type: "proyecto",
            locale,
            limit: 100,
            skip: projects.length,
            include: 4,
        });
        total = response.total;
        if (response.items.length === 0 && projects.length < total) {
            throw new ContentfulDataError("No se pudieron recuperar todos los proyectos.", "Could not retrieve all projects.");
        }
        projects.push(...response.items.map(parseProject));
    } while (projects.length < total);
    return projects;
}
