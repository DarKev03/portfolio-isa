export type BlockType =
    | "text-image"
    | "image-text"
    | "image-full";

export interface ContentBlock {
    type: BlockType;
    text?: string;
    image?: string;
    imageSize?: string;
}