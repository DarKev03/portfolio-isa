import { BLOCKS, INLINES, type Block, type Document, type Inline } from "@contentful/rich-text-types";
import { z } from "zod";
import type { Language } from "../types/Language";
import { readImage } from "./assets";
import { ContentfulDataError } from "./client";

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

const supportedNodes: string[] = [
    BLOCKS.PARAGRAPH, BLOCKS.HEADING_1, BLOCKS.HEADING_2, BLOCKS.HEADING_3,
    BLOCKS.HEADING_4, BLOCKS.HEADING_5, BLOCKS.HEADING_6, BLOCKS.UL_LIST,
    BLOCKS.OL_LIST, BLOCKS.LIST_ITEM, BLOCKS.QUOTE, BLOCKS.HR,
    BLOCKS.TABLE, BLOCKS.TABLE_ROW, BLOCKS.TABLE_CELL, BLOCKS.TABLE_HEADER_CELL,
    BLOCKS.EMBEDDED_ASSET, INLINES.HYPERLINK,
];

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

export function parseRichText(value: unknown, fallbackAlt: string, locale: Language): Document {
    if (!isDocument(value)) {
        throw new ContentfulDataError("El texto enriquecido no es válido.", "The rich text is invalid.");
    }
    for (const node of value.content) validateNodes(node, fallbackAlt, locale);
    return value;
}
