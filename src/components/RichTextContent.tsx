import { BLOCKS, type Document } from "@contentful/rich-text-types";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import type { Language } from "../types/Language";
import { readImage } from "../contentful/assets";
import ContentImage from "./ContentImage";

interface RichTextContentProps {
    document: Document;
    fallbackAlt: string;
    language: Language;
    imageClassName?: string;
}

const RichTextContent = ({ document, fallbackAlt, language, imageClassName }: RichTextContentProps) => (
    documentToReactComponents(document, {
        renderNode: {
            [BLOCKS.EMBEDDED_ASSET]: node => {
                const image = readImage(node.data.target, fallbackAlt, language);
                return <ContentImage src={image.url} alt={image.alt} className={imageClassName} />;
            },
        },
    })
);

export default RichTextContent;
