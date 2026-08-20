import {motion, useInView} from "motion/react";
import { useRef } from "react";
import RumbleText from "./RumbleText.component";

const statistics = [
    {iconPaths:<>
        <path d="M16.051 12.616a1 1 0 0 1 1.909.024l.737 1.452a1 1 0 0 0 .737.535l1.634.256a1 1 0 0 1 .588 1.806l-1.172 1.168a1 1 0 0 0-.282.866l.259 1.613a1 1 0 0 1-1.541 1.134l-1.465-.75a1 1 0 0 0-.912 0l-1.465.75a1 1 0 0 1-1.539-1.133l.258-1.613a1 1 0 0 0-.282-.866l-1.156-1.153a1 1 0 0 1 .572-1.822l1.633-.256a1 1 0 0 0 .737-.535z"/><path d="M8 15H7a4 4 0 0 0-4 4v2"/><circle cx="10" cy="7" r="4"/>
        </>,
        heading:"5000+", para:"Happy Customers"},
    {iconPaths:<>
        <path d="M12 22V12"/><path d="M20.27 18.27 22 20"/><path d="M21 10.498V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.729l7 4a2 2 0 0 0 2 .001l.98-.559"/><path d="M3.29 7 12 12l8.71-5"/><path d="m7.5 4.27 8.997 5.148"/><circle cx="18.5" cy="16.5" r="2.5"/>
        </>,
        heading:"100+", para:"Premium Products"},
    {iconPaths:<>
        <path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z"/><path d="M21 16v2a4 4 0 0 1-4 4h-5"/>
        </>,
        heading:"24/7", para:"Customer Support"},
    {iconPaths:<>
        <path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"/><path d="M7.828 13.07A3 3 0 0 1 12 8.764a3 3 0 0 1 5.004 2.224 3 3 0 0 1-.832 2.083l-3.447 3.62a1 1 0 0 1-1.45-.001z"/>
        </>,
        heading:"99%", para:"Positive Reviews"},
];


function Statistics() {
    const statisticRef = useRef<HTMLDivElement|null>(null);
    const isInViewStatisticRef = useInView(statisticRef, {amount:0.6});
    
    return(
        <motion.div ref={statisticRef} className="flex justify-around flex-wrap px-10 py-7 gap-5">
            {
                statistics.map((item, index) => (
                    <div key={index} className="text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"
                            className="size-13 sm:size-20 mx-auto text-gray-500"
                        >
                            {item.iconPaths}
                        </svg>
                        <div className="text-4xl sm:text-5xl text-primary-400 font-bold my-2 font-mono">
                            <RumbleText finalText={item.heading} interval={30} restart={isInViewStatisticRef} />
                        </div>
                        <div className="text-lg text-gray-500 my-1 text-shadow-md text-shadow-gray-100">{item.para}</div>
                    </div>
                ))
            }
        </motion.div>
    )
}

export default Statistics;