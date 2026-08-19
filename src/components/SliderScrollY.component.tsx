import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";

const labels = [
    {name:"Atom Whey", para:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo beatae maiores repellat mollitia rerum ut, deleniti voluptatem magni. Libero facilis, obcaecati animi aliquid voluptates commodi sit molestiae at sunt, excepturi doloribus accusamus? Incidunt aliquam ducimus eius. Similique autem ipsam ullam!"},
    {name:"MuscleTech Whey", para:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo beatae maiores repellat mollitia rerum ut, deleniti voluptatem magni. Libero facilis, obcaecati animi aliquid voluptates commodi sit molestiae at sunt, excepturi doloribus accusamus?"},
    {name:"Avvatar", para:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo beatae maiores repellat mollitia rerum ut, deleniti voluptatem magni. Libero facilis, obcaecati animi aliquid voluptates commodi sit molestiae at sunt, excepturi doloribus accusamus? Incidunt aliquam ducimus eius. Similique autem ipsam ullam! Incidunt aliquam ducimus eius. Similique autem ipsam ullam!"},
    {name:"Monster Burn", para:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo beatae maiores repellat mollitia rerum ut, deleniti voluptatem magni. Libero facilis, obcaecati animi aliquid voluptates commodi sit imilique autem ipsam ullam!"},
    {name:"Cheetah Cut", para:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo beatae maiores repellat mollitia rerum ut, deleniti voluptatem magni. Libero facilis, obcaecati animi aliquid voluptates commodi sit molestiae at sunt, excepturi doloribus accusamus? Incidunt aliquam ducimus eius. Similique autem ipsam ullam!"},
    {name:"Atom Whey", para:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo beatae maiores repellat mollitia rerum ut, deleniti voluptatem magni. Libero facilis, obcaecati animi aliquid voluptates commodi sit molestiae at sunt, excepturi doloribus accusamus? Incidunt aliquam ducimus eius. Similique autem ipsam ullam!"},
    {name:"MuscleTech Whey", para:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo beatae maiores repellat mollitia rerum ut, deleniti voluptatem magni. Libero facilis, obcaecati animi aliquid voluptates commodi sit molestiae at sunt, excepturi doloribus accusamus?"},
    {name:"Avvatar", para:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo beatae maiores repellat mollitia rerum ut, deleniti voluptatem magni. Libero facilis, obcaecati animi aliquid voluptates commodi sit molestiae at sunt, excepturi doloribus accusamus? Incidunt aliquam ducimus eius. Similique autem ipsam ullam! Incidunt aliquam ducimus eius. Similique autem ipsam ullam!"},
    {name:"Monster Burn", para:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo beatae maiores repellat mollitia rerum ut, deleniti voluptatem magni. Libero facilis, obcaecati animi aliquid voluptates commodi sit imilique autem ipsam ullam!"},
    {name:"Cheetah Cut", para:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo beatae maiores repellat mollitia rerum ut, deleniti voluptatem magni. Libero facilis, obcaecati animi aliquid voluptates commodi sit molestiae at sunt, excepturi doloribus accusamus? Incidunt aliquam ducimus eius. Similique autem ipsam ullam!"}
]

function yHandler(index:number, targetedIndex:number) {
    if (targetedIndex === null) {
        return 0;
    }
    if (index-1 === targetedIndex) {
        return -50;
    }
    else if (index === targetedIndex) {
        return -100;
    }
    else if (index+1 === targetedIndex) {
        return -50;
    }
    else{
        return 0;
    }
};
function opacityHandler(index:number, targetedIndex:number) {
    if (targetedIndex === null) {
        return 0.3;
    }
    if (index-1 === targetedIndex) {
        return 0.5;
    }
    else if (index === targetedIndex) {
        return 1;
    }
    else if (index+1 === targetedIndex) {
        return 0.5;
    }
    else{
        return 0.3;
    }
};
function blurHandler(index:number, targetedIndex:number) {
    if (targetedIndex === null) {
        return "blur(3px)";
    }
    if (index-1 === targetedIndex) {
        return "blur(1px)";
    }
    else if (index === targetedIndex) {
        return "blur(0px)";
    }
    else if (index+1 === targetedIndex) {
        return "blur(1px)";
    }
    else{
        return "blur(3px)";
    }
};
function SliderScrollY() {
    const heroRef = useRef<HTMLDivElement|null>(null);
    const cardRefs = useRef<(HTMLDivElement|null)[]>([]);
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [isScrollerVisible, setIsScrollerVisible] = useState<number>(0);
    
    const {scrollYProgress} = useScroll({target:heroRef, offset:["start end", "end start"]});
    
    const translateX = useTransform(scrollYProgress, [0.3, 0.8], ["0%", "-100%"]);

    useMotionValueEvent(scrollYProgress, "change", (value) => {
        setIsScrollerVisible(value);
    });

    useEffect(() => {
        const updateActiveCard = () => {
            const viewportCenter = window.innerWidth / 2;

            let closestIndex = 0;
            let closestDistance = Infinity;

            cardRefs.current.forEach((card, index) => {
                if (!card) return;

                const rect = card.getBoundingClientRect();

                const cardCenter =
                    rect.left + rect.width / 2;

                const distance =
                    Math.abs(cardCenter - viewportCenter);

                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestIndex = index;
                }
            });

            setActiveIndex(closestIndex);
        };

        updateActiveCard();

        window.addEventListener("scroll", updateActiveCard);

        return () =>
            window.removeEventListener("scroll", updateActiveCard);
    }, []);
    
    
    return(
        <div ref={heroRef} className="h-[300vh] relative overflow-x-clip"

        >
            {/* targeted item label */}
            <div className="sticky top-10 left-[50%] -translate-x-[50%] min-w-100 w-min h-100 mx-auto overflow-hidden">
                {
                    labels.map((item, index) => (
                        <motion.div key={index} className="border border-gray-300 p-5 rounded-xl absolute top-0 left-0"
                            animate={{
                                opacity: (activeIndex === index && isScrollerVisible<0.75 && isScrollerVisible>0.25) ? 1 : 0
                            }}
                            transition={{
                                duration: 0.4
                            }}
                        >
                            <div className="text-center font-bold text-gray-700 text-3xl mb-4">{item.name}{activeIndex}</div>
                            <div className="text-gray-500 font-mono text-justify">{item.para}</div>
                        </motion.div>
                    ))
                }
            </div>

            <motion.div className="flex gap-52 w-max sticky top-[90%] left-0 -translate-y-[50%]"
                animate={{
                    opacity: (isScrollerVisible<0.75) ? 1 : 0
                }}
                style={{
                    translateX
                }}
            >
                {/* starting 2 empty items */}
                <div className="opacity-0 min-w-30 h-30 bg-green-400 grid place-items-center text-2xl text-gray-700">G</div>
                <div className="opacity-0 min-w-30 h-30 bg-green-400 grid place-items-center text-2xl text-gray-700">G</div>

                {
                    Array.from({length:10}).map((_, index) => {
                        
                        return (
                            <motion.div className="min-w-30 h-30 grid place-items-center text-2xl text-gray-700"
                                key={index}
                                ref={(el) => {
                                    cardRefs.current[index] = el;
                                }}
                                animate={{
                                    scale: activeIndex === index ? 1.4 : 0.9,
                                    y: yHandler(index, activeIndex),
                                    filter:blurHandler(index, activeIndex),
                                    opacity:opacityHandler(index, activeIndex)
                                }}
                                transition={{
                                    duration: 0.6
                                }}
                            >
                                <div className="w-full h-full rounded-md grid place-items-center"
                                    style={{...(activeIndex === index&&{
                                        //background:"red",
                                        background:"conic-gradient(from var(--gradient-angle),white,white,white,var(--primary-600),white,white,white)",
                                        animation:"rotate_angle 4s linear infinite"
                                    })}}
                                >
                                    <img src={index%2 === 0 ? "react.svg" : "vite.svg"} alt={index%2 === 0 ? "react.svg" : "vite.svg"}
                                        className="w-[99%] h-[99%] rounded-sm bg-white p-1"
                                    />
                                </div>

                                {/*<div className="w-full h-0.5 bg-primary-300 transition-transform ease-in-out duration-600 origin-left"
                                    style={{
                                        transform:activeIndex === index?"scale(1, 1)":"scale(0, 1)"
                                    }}
                                ></div>*/}
                            </motion.div>
                        )
                    })
                }
            </motion.div>
        </div>
    )
};

export default SliderScrollY;