import type { Document } from "@contentful/rich-text-types";

export interface CmsAbout {
    richContent: Document;
    photos: { url: string; alt: string }[];
}
