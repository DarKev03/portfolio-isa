import type { Document } from "@contentful/rich-text-types";
import type { Project } from "./Project";

export interface CmsProject {
    id: string;
    title: string;
    tags: string[];
    image: string;
    imageAlt: string;
    year: number;
    richContent: Document;
}

export type DisplayProject = Project | CmsProject;
