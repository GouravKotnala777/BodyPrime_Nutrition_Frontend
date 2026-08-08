import { useState, type MouseEvent } from "react";

const why = [
    {img:"why1.webp", heading:"Wide Range Of Nutritional Products", para:"one-stop fitness and health destination"},
    {img:"why2.webp", heading:"100% Original & Authentic", para:"Tight control on sourcing and distribution"},
    {img:"why3.webp", heading:"Guide to Fit and Healthy Lifestyle", para:"Your true partner in health & wellness journey"}
];

function Why() {
    const [hoveringCard, setHoveringCard] = useState<string>("");
    const [a, setA] = useState<{x:number; y:number;}>({x:0, y:0});

    function onCardHover(e:MouseEvent<HTMLDivElement>){
        const targetedElem = (e.target as HTMLElement).getAttribute(`data-why`);
        if (!targetedElem) {
            setHoveringCard("");
            return;
        }

        const {left, top} = (e.target as HTMLElement).getBoundingClientRect();

        setA({x:e.clientX-left-85, y:e.clientY-top-85});
        setHoveringCard(targetedElem);
    };
    function onCardLeave() {
        setHoveringCard("");
    };

    
    return(
        <div className="px-10 py-7 relative"
            style={{
                backgroundColor:"var(--primary-50)",
                backgroundBlendMode:"overlay",
                backgroundImage:'url(../patterns/hexagons.svg)'
            }}
        >
            <h1 className="text-gray-700 text-3xl font-bold mb-6">Why BodyPrime Nutrition</h1>
            <div className="flex gap-2 flex-wrap justify-around items-center flex-row"
                onMouseMove={onCardHover}
                onMouseLeave={onCardLeave}
            >{
                why.map((item, index) => (
                    <div data-why={`why-${index}`} className="rounded-xl bg-white/70 relative overflow-hidden py-2">

                        {/* blur spot */}
                        <div className="w-50 h-50 absolute top-0 left-0 rounded-full transition-opacity ease-in-out duration-400 pointer-events-none hidden sm:block"
                            style={{
                                background:"radial-gradient(at center, var(--primary-300), var(--primary-300), var(--primary-200), var(--primary-100), var(--primary-50))",
                                opacity:hoveringCard===`why-${index}`?1:0,
                                left:a.x,
                                top:a.y,                                
                            }}
                        ></div>

                        {/* only for div propertion opacity-0 */}
                        <div className="px-3 pt-3 pb-10 min-w-70 rounded-[calc(12px-5px)] bg-white opacity-0 pointer-events-none">
                            <img src={item.img} alt={item.img} className="mx-auto" />
                            <div className="text-primary-700/60 text-xl font-semibold py-2 text-[clamp(1rem,1.5vw,2rem)]">{item.heading}</div>
                            <div className="text-gray-500 text-lg leading-5 text-[clamp(0.8rem,1.3vw,1.6rem)]">{item.para}</div>
                        </div>
                        {/* actual div */}
                        <div className="px-3 pt-3 pb-10 min-w-70 rounded-[calc(12px-5px)] absolute inset-1 backdrop-blur-2xl pointer-events-none">
                            <img src={item.img} alt={item.img} className="mx-auto" />
                            <div className="text-primary-700/60 py-2 font-semibold text-[clamp(1rem,1.5vw,2rem)]">{item.heading}</div>
                            <div className="text-gray-500 text-lg leading-5 [text-shadow:0px_0px_4px_var(--primary-200)] text-[clamp(0.8rem,1.3vw,1.6rem)]">{item.para}</div>
                        </div>
                    </div>
                ))
            }

            </div>
        </div>
    )
}

export default Why;