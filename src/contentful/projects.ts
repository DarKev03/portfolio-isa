import { BLOCKS, type Document } from "@contentful/rich-text-types";
import { z } from "zod";
import type { CmsProject } from "../types/CmsProject";
import type { Language } from "../types/Language";
import { ContentfulDataError, getContentfulClient } from "./client";
import { readImage } from "./assets";
import { parseRichText } from "./richText";

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
