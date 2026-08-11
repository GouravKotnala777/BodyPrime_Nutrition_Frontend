import { useEffect, useRef, useState, type ReactNode } from "react";

interface PickerScrollerInterface{
    items:ReactNode[];
    onSelect?: (index: number) => void;
    onMouseEnter?: (index: number) => void;
    onMouseLeave?: (index: number) => void;
};

function PickerScroller({items, onSelect, onMouseEnter, onMouseLeave}:PickerScrollerInterface) {
    const parentRef = useRef<HTMLDivElement|null>(null);
    const scrollableRef = useRef<HTMLDivElement|null>(null);
    //const [parentWidth, setParentWidth] = useState<number>(0);
    const [translatedScrollable, setTranslatedScrollable] = useState<number>(0);
    //const [translatedScrollable2, setTranslatedScrollable2] = useState<number>(0);
    const [selectedVideo, setSelectedVideo] = useState<{index:number; left:number; width:number;}>({index:-1, left:-1, width:0});

    //function onBtnClick(btnName:"left"|"right") {    
    //    setTranslatedScrollable(-1);
    //    setSelectedVideo({index:-1, left:-1, width:0});
    //    if (btnName === "right") {
    //        setTranslatedScrollable2((prev) => prev-1);
    //    }
    //    else{
    //        setTranslatedScrollable2((prev) => prev+1);
    //    }
    //};

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

        const difference = parentCenter-selectedVideoLeft-selectedVideoCenter;

        if (selectedVideo.left > 0) {
            setTranslatedScrollable((prev) => prev+difference);
        }

    }, [selectedVideo]);

    useEffect(() => {
        const scrollable = scrollableRef.current;
        if (!scrollable) {
            return;
        }
        scrollable.style.transform =  `translate(${translatedScrollable}px, 0px)`;
    }, [translatedScrollable]);
    //useEffect(() => {
    //    const scrollable = scrollableRef.current;
    //    if (!scrollable) {
    //        return;
    //    }
    //    scrollable.style.transform =  `translate(${100*translatedScrollable2}%, 0px)`;
    //}, [translatedScrollable2]);
    
    return(
        <div>
                <div className="relative">
                    <div ref={parentRef} className="overflow-x-hidden">
                        <div ref={scrollableRef} className="flex transition-all ease-in-out duration-1000">
                            {
                                items.map((item, index) => (
                                    <div key={index}
                                        className="
                                            border border-gray-200 scale-90 hover:scale-85 basis-1/2 sm:basis-1/3 lg:basis-1/4 xl:basis-1/5 shrink-0 overflow-hidden transition-all duration-300 ease-in-out rounded-xl"
                                        onClick={(e) => {
                                            const {left, width} = (e.target as HTMLDivElement).getBoundingClientRect();
                                            setSelectedVideo({index, left, width});
                                            //setTranslatedScrollable2(0);
                                            onSelect?.(index);
                                        }}
                                        onMouseEnter={() => {
                                            onMouseEnter?.(index);
                                        }}
                                        onMouseLeave={() => {
                                            onMouseLeave?.(index);
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