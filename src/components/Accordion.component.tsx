import { useState } from "react";
import {BsArrowUpShort} from "react-icons/bs";

interface AccordionProptypes{
    data:{tags:string[]; heading:string; para:string}[];
};

function Accordion({data}:AccordionProptypes) {
    const [activeCords, setActiveCords] = useState<Record<string, boolean>>({});
    

    return(
        <div className="transition-all ease-in-out duration-300">
            {
                data.map(({heading, para}, index) => (
                    <div key={index} className={`transition-all ease-in-out duration-300`}>
                        <div className="text-gray-700 font-semibold p-3 flex justify-between items-center cursor-pointer transition-all ease-in-out duration-300" onClick={()=>setActiveCords((prev)=>({...prev, [`${index}`]:!prev[`${index}`]}))}>
                            <div className="text-md sm:text-xl">{heading}</div>
                            <div className={`text-xl ${activeCords[`${index}`]?"rotate-0":"rotate-180"} transition-transform ease-in-out duration-300`}><BsArrowUpShort /></div>
                        </div>
                        <div className={`text-gray-600 bg-primary-50 text-sm sm:text-lg px-4 [text-shadow:0px_0px_2px_var(--color-gray-300)] tracking-wide text-left overflow-hidden rounded-lg origin-top [box-shadow:0px_0px_4px_0px_var(--primary-300)_inset] ${activeCords[`${index}`]?"h-60 py-2":"h-0 py-0"} transition-all ease-in-out duration-300`}>{para}</div>
                    </div>
                ))
            }
        </div>

    )    
};

export default Accordion;