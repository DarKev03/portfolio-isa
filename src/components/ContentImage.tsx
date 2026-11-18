import { useState, type ComponentProps } from "react";
import { useTranslation } from "../i18n/translations";

type ContentImageProps = ComponentProps<"img">;

const ContentImage = ({ alt, className, onError, ...props }: ContentImageProps) => {
    const text = useTranslation();
    const [failedSource, setFailedSource] = useState<{ src: string | undefined } | null>(null);

    if (failedSource && failedSource.src === props.src) {
        return (
            <span role="alert" className={`block ${className ?? ""}`}>
                {text.imageLoadError}{alt ? ` (${alt})` : ""}
            </span>
        );
    }

    return <img {...props} alt={alt} className={className} onError={event => {
        setFailedSource({ src: props.src });
        onError?.(event);
    }} />;
};

export default ContentImage;
