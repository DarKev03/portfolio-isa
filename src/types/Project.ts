import { ContentBlock } from "./ContentBlock";

export interface Project {
    id: number;
    title: string;
    description: string;
    tags: string[];
    image: string;
    year: number;
    content?: ContentBlock[];
}
