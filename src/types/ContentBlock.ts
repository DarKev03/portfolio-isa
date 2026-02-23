export type BlockType =
    | "text-image"
    | "image-text"
    | "image-full"
    | "double-image";

export interface ContentBlock {
    type: BlockType;
    text?: string;
    image?: string;
    imageSize?: string;
    values?: string[];
}