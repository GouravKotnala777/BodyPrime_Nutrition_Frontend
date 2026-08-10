import { useEffect, useRef, useState, type ReactNode } from "react";

interface PickerScrollerInterface{
    items:ReactNode[];
};

function PickerScroller({items}:PickerScrollerInterface) {
    const parentRef = useRef<HTMLDivElement|null>(null);
    const scrollableRef = useRef<HTMLDivElement|null>(null);
    const [parentWidth, setParentWidth] = useState<number>(0);
    const [translatedScrollable, setTranslatedScrollable] = useState<number>(0);
    const [translatedScrollable2, setTranslatedScrollable2] = useState<number>(0);
    const [selectedVideo, setSelectedVideo] = useState<{index:number; left:number; width:number;}>({index:-1, left:-1, width:0});

    function onBtnClick(btnName:"left"|"right") {        
        if (btnName === "right") {
            setTranslatedScrollable2((prev) => prev-1);
        }
        else{
            setTranslatedScrollable2((prev) => prev+1);
        }
    };

    useEffect(() => {
        const parent = parentRef.current;
        const scrollable = scrollableRef.current;
        if (!parent || !scrollable) {
            return;
        }
        const {width:parentWidth} = parent.getBoundingClientRect();
        const parentCenter = parentWidth/2;
        const selectedVideoCenter = selectedVideo.width/2;
        const selectedVideoLeft = selectedVideo.left;

        if (selectedVideo.left < 0) {
            setTranslatedScrollable(0);
            return;
        }
        
        if(parentCenter > selectedVideoLeft+selectedVideoCenter){
            setTranslatedScrollable((prev) => prev+parentCenter-selectedVideoLeft-selectedVideoCenter);
        }
        else if(parentCenter < selectedVideoLeft+selectedVideoCenter){
            setTranslatedScrollable((prev) => prev+parentCenter-selectedVideoLeft-selectedVideoCenter);
        }
        else{
            console.log("c");
            console.log("SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS");
        }

    }, [selectedVideo]);

    useEffect(() => {
        const scrollable = scrollableRef.current;
        if (!scrollable) {
            return;
        }
        scrollable.style.transform =  `translate(${translatedScrollable}px, 0px)`;
    }, [translatedScrollable]);
    
    return(
        <div className="border border-red-500">
                <div className="border border-violet-400 relative">
                    <div ref={parentRef} className="border border-indigo-400 overflow-x-scroll">
                        <div ref={scrollableRef} className="flex transition-all ease-in-out duration-300">
                            {
                                items.map((item, index) => (
                                    <div key={index}
                                        className="border border-green-400 bg-green-300 scale-90 hover:scale-85 flex-1/5 shrink-0 overflow-hidden transition-all ease-in-out duration-300 rounded-xl"
                                        onClick={(e) => {
                                            const {left, width} = (e.target as HTMLDivElement).getBoundingClientRect();
                                            setSelectedVideo({index, left, width});
                                        }}
                                    >{item}</div>
                                ))
                            }
                           
                        </div>
                        
                        {/*<button className="border border-gray-400 bg-primary-200 text-3xl text-gray-800 p-2 absolute top-[50%] left-1 -translate-y-[50%] rounded-full"
                            onClick={() => onBtnClick("left")}
                        ><BsArrowLeftShort /></button>
                        <button className="border border-gray-400 bg-primary-200 text-3xl text-gray-800 p-2 absolute top-[50%] right-1 -translate-y-[50%] rounded-full"
                            onClick={() => onBtnClick("right")}
                        ><BsArrowRightShort /></button>*/}
                    </div>
                </div>
            </div>
    )
};

export default PickerScroller;