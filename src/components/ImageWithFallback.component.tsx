import type { SyntheticEvent } from "react";

interface ImageWithFallbackPropTypes{
    src:string;
    alt?:string;
    fallbackSrc:string;
    className?:string;
};

function ImageWithFallback({src, alt, fallbackSrc, className}:ImageWithFallbackPropTypes) {

    function onErrorHandler(e:SyntheticEvent<HTMLImageElement>) {
        const target = e.currentTarget;
        target.src = fallbackSrc;
        target.onerror = null;
    };
    return(
        <img src={src} alt={alt} onError={onErrorHandler} className={`w-full ${className}`} />
    )
};

export default ImageWithFallback;