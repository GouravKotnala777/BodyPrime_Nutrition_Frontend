import type { SyntheticEvent } from "react";

interface ImageWithFallbackPropTypes{
    src:string;
    alt?:string;
    fallbackSrc:string;
    className?:string;
    "data-index"?:number;
};

function ImageWithFallback({src, alt, fallbackSrc, className, "data-index":dataIndex}:ImageWithFallbackPropTypes) {

    //console.log({src, alt, fallbackSrc, className});
    

    function onErrorHandler(e:SyntheticEvent<HTMLImageElement>) {
        const target = e.currentTarget;
        target.src = fallbackSrc;
        target.onerror = null;
    };
    return(
        <img src={src} data-index={dataIndex} alt={alt} onError={onErrorHandler} className={`w-full ${className}`} />
    )
};

export default ImageWithFallback;