import type { ReactNode } from "react";

interface MarqueePropTypes {
    marqueeElements:ReactNode[];
    gap?:string;
};

function Marquee({marqueeElements, gap="10px"}:MarqueePropTypes) {
    

    return(
        <div className="relative max-w-5xl mx-auto overflow-x-scroll">
            <div className="marquee-scrollable border border-gray-200 flex w-max"
                style={{
                    gap
                }}
            >
                {
                    [...marqueeElements, ...marqueeElements].map((item, index) => (
                        <div key={index}
                            style={{
                                marginLeft:index===0?gap:"0px"
                            }}
                        >
                            {item}
                        </div>
                    ))
                }
            </div>
        </div>
    )
};

export default Marquee;