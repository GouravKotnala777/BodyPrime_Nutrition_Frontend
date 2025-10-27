import { useEffect, useRef, useState } from "react";
import type { ProductTypes } from "../utils/types";
import ImageWithFallback from "./ImageWithFallback.component";


function ImageSliderWithPreview({singleProduct}:{singleProduct:ProductTypes|null}) {
    const [visibleIndex, setVisibleIndex] = useState<number>(0);
    const imgContainerRef = useRef<HTMLDivElement|null>(null);


    function imgPreviewHandler(index:number){
        const container = imgContainerRef.current;
        const image = container?.children[index];

        if (image && container) {
            image.scrollIntoView({behavior:"smooth", inline:"center"});
        }
    };


    useEffect(() => {
        if (!imgContainerRef.current || singleProduct?.images.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const index = Number(entry.target.getAttribute("data-index"));
                    console.log({index});
                    
                    setVisibleIndex(index);
                }
            });
        }, {root:imgContainerRef.current, threshold:0.5});

        const children = imgContainerRef.current.children;

        if (children) {
            Array.from(children).forEach((child) => observer.observe(child));
        }

        return () => observer.disconnect();
    }, [singleProduct?.images]);
    
    return(
        <>
            <div className="h-[400px] w-full bg-gray-100 overflow-x-scroll flex snap-x snap-mandatory"
                ref={imgContainerRef}
            >
                {
                    (singleProduct&&singleProduct.images&&singleProduct.images[0]) ?
                        singleProduct.images.map((imageURL, index) => (
                            <ImageWithFallback
                                key={index}
                                data-index={index}
                                src={`${import.meta.env.VITE_SERVER_URL}/api/v1${imageURL}`}
                                alt={`${import.meta.env.VITE_SERVER_URL}/api/v1${imageURL}`}
                                fallbackSrc={`${import.meta.env.VITE_SERVER_URL}/api/v1/public/no_product.png`}
                                className="w-full h-full flex-shrink-0 snap-center"
                            />
                        ))
                        :
                        <img src={`${import.meta.env.VITE_SERVER_URL}/api/v1/public/no_product.png`} alt={`${import.meta.env.VITE_SERVER_URL}/api/v1/public/no_product.png`} className="h-full w-full" />
                }
            </div>

            <div className="flex">
                {
                    singleProduct?.images.map((imgURL, index) => (
                        <div className="w-[60px] h-[60px] rounded-[4px]"
                            style={{
                                border:visibleIndex === index ? "2px solid black":"none"
                            }}
                            onClick={()=>imgPreviewHandler(index)}
                        >
                            <ImageWithFallback
                                src={`${import.meta.env.VITE_SERVER_URL}/api/v1${imgURL}`}
                                alt={`${import.meta.env.VITE_SERVER_URL}/api/v1${imgURL}`}
                                fallbackSrc={`${import.meta.env.VITE_SERVER_URL}/api/v1/public/no_product.png`}
                            />
                        </div>
                    ))
                }
            </div>
        </>
    )
};

export default ImageSliderWithPreview;