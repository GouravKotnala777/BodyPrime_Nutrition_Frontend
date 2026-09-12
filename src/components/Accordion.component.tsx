import { useState, type ReactNode } from "react";

//interface AccordionProptypes{
//    data:{heading:string; para:string}[];
//};
interface AccordionProptypes{
    data:{heading:ReactNode; para:ReactNode}[];
    chevronSize?:"xs"|"sm"|"md"|"lg"|"xl";
};

const applyChevronSize = {
    xs:"size-2.5",
    sm:"size-3",
    md:"size-3.5",
    lg:"size-4",
    xl:"size-4.5",
};


function Accordion({data, chevronSize="md"}:AccordionProptypes) {
    const [activeCords, setActiveCords] = useState<Record<string, boolean>>({});
    

    return(
        <div className="transition-all ease-in-out duration-300">
            {
                data.map(({heading, para}, index) => (
                    <div key={index} className="">
                        <div className="text-gray-700 flex justify-between items-center cursor-pointer hover:bg-primary-50" onClick={()=>setActiveCords((prev)=>({...prev, [`${index}`]:!prev[`${index}`]}))}>
                            {heading}

                            <div className="text-gray-500 mr-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor"
                                className={`${activeCords[index]?"rotate-x-180":"rotate-x-0"} translate-y-0.5 ${applyChevronSize[chevronSize]} origin-center transition-transform ease-in-out duration-400`}
                                >
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                                </svg>

                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor"
                                className={`${activeCords[index]?"rotate-x-180":"rotate-x-0"} -translate-y-0.5 ${applyChevronSize[chevronSize]} origin-center transition-transform ease-in-out duration-400`}
                                >
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                </svg>
                            </div>
                        </div>
                        <div className={`text-gray-600 text-lg
                            [text-shadow:0px_0px_2px_var(--color-gray-300)]
                            tracking-wide text-left  origin-top grid
                            ${activeCords[`${index}`]?"grid-rows-[1fr]":"grid-rows-[0fr]"}
                            transition-[grid-template-rows] ease-in-out duration-400
                        `}>
                            <div className="overflow-hidden">
                                {para}
                            </div>
                        </div>
                    </div>
                ))
            }
        </div>

    )    
};

export default Accordion;