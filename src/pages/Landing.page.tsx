import { MeteorMash } from "kotnala_ui";
import { useEffect, useRef, useState } from "react";
import Statistics from "../components/Statistics.component";
import Why from "../components/Why.component";
import { BsArrowUpShort } from "react-icons/bs";
import { BiLeaf, BiPlay } from "react-icons/bi";
import { RiMoneyRupeeCircleLine, RiShieldFlashLine } from "react-icons/ri";
import { GrCertificate } from "react-icons/gr";
import { GiChemicalDrop } from "react-icons/gi";
import { TbTruckDelivery } from "react-icons/tb";
import Marquee from "../components/Marquee.component";
import Skeletan from "../components/Skeletan";
import Accordion from "../components/Accordion.component";
import PickerSlider from "../components/PickerSlider.component";
import Footer from "../components/Footer.component";
import { NavLink } from "react-router-dom";

const BRANDS = [
    {img:"brand_logo1.png"},
    {img:"brand_logo2.png"},
    {img:"brand_logo3.png"},
    {img:"brand_logo4.avif"},
    {img:"brand_logo5.avif"},
    {img:"brand_logo6.png"},
    {img:"brand_logo7.avif"},
    {img:"brand_logo8.png"},
    {img:"brand_logo9.png"},
    {img:"brand_logo10.png"},
    {img:"brand_logo11.png"},
    {img:"brand_logo12.png"},
    {img:"brand_logo13.avif"}
];
const ACCORDION_DATA:{tags:string[]; heading:string; para:string;}[] = [
    //{heading:"", para:""},
    {tags:["types"], heading:"What are the different types of protein?", para:"Common protein types include whey protein concentrate, whey protein isolate, hydrolyzed whey protein, casein protein, egg protein, soy protein, and plant-based protein blends."},
    {tags:["whey"], heading:"What is whey protein?", para:"Whey protein is a high-quality dairy protein obtained during the cheese-making process. It contains all nine essential amino acids and is commonly used to support muscle recovery and growth."},
    {tags:["concentrate"], heading:"What is whey protein concentrate?", para:"Whey protein concentrate (WPC) is whey protein that has been filtered to remove some of its fat, lactose, and other components. It generally contains around 70–80% protein, although the exact amount varies by product."},
    {tags:["isolate"], heading:"What is whey protein isolate?", para:"Whey protein isolate (WPI) undergoes additional filtration to remove more fat, lactose, and other components. It typically contains 90% or more protein by weight and is generally lower in lactose than whey concentrate."},
    {tags:["hydrolyzed"], heading:"What is hydrolyzed whey protein?", para:"Hydrolyzed whey protein has been partially broken down into smaller protein fragments called peptides. This can make it easier to digest for some people."},
    {tags:["difference", "concentrate", "isolate"], heading:"What is the difference between whey concentrate and isolate?", para:"The main difference is the level of filtration. Whey isolate generally contains more protein and less fat and lactose, while concentrate retains more of the naturally occurring components of whey and is often more economical."},
    {tags:["casein"], heading:"What is casein protein?", para:"Casein is a dairy protein that digests more slowly than whey. Because of its slower digestion, it is often consumed between meals or before bedtime."},
    {tags:["plant"], heading:"What is plant protein?", para:"Plant protein is protein obtained from plant sources such as peas, rice, soy, hemp, and other plants. It is a popular choice for people following vegetarian or vegan diets."},
    {tags:["pea"], heading:"What is pea protein?", para:"Pea protein is extracted primarily from yellow peas. It provides a good amount of protein and is commonly used in plant-based protein supplements."},
    {tags:["soy"], heading:"What is soy protein?", para:"Soy protein is derived from soybeans and is considered a complete protein because it provides all nine essential amino acids."},
    {tags:["blend"], heading:"What is a protein blend?", para:"A protein blend combines two or more types of protein in a single product. For example, a blend may contain whey concentrate, whey isolate, and casein to provide different digestion rates."},
    {tags:[""], heading:"Can I take protein every day?", para:"Protein supplements can generally be used as part of a balanced diet when consumed according to the product's serving recommendations. They should supplement your diet rather than replace a varied diet."},
    {tags:[""], heading:"How can I contact BodyPrime Nutrition?", para:"You can contact our customer support team through the contact information provided on our website. We will be happy to assist you with questions about products, orders, delivery, or other concerns."},
    {tags:[""], heading:"Do you offer discounts or special offers?", para:"Yes. We may offer promotional discounts, special deals, and limited-time offers from time to time. Keep an eye on our website for the latest offers."},
    {tags:[""], heading:"Can I return or exchange a product?", para:"Returns and exchanges are subject to our return policy. For hygiene and safety reasons, opened or used nutrition products may not be eligible for return. Please check our return policy before placing an order."},
    {tags:[""], heading:"Can I cancel my order after placing it?", para:"Orders can only be cancelled if they have not yet been processed or shipped. Contact our support team as soon as possible if you need to cancel an order."},
    {tags:[""], heading:"How long does delivery take?", para:"Delivery times depend on your location, shipping method, and order processing time. The estimated delivery information will be provided during the ordering process."},
    {tags:[""], heading:"How long does it take to see results", para:"Results vary from person to person depending on factors such as diet, training, sleep, consistency, and individual body composition. Supplements work best when combined with a balanced diet and regular exercise."},
    {tags:[""], heading:"Do I need to work out to use supplements?", para:"Not necessarily, but most fitness supplements are designed to complement an active lifestyle. Your overall diet, physical activity, and lifestyle habits play a major role in achieving your fitness goals."},
    {tags:[""], heading:"How do I choose the right supplement? ipsum dolor, sit amet consectetur", para:"The right supplement depends on your fitness goals, diet, training routine, and individual needs. Each product page provides information about its ingredients, benefits, and recommended usage to help you make an informed choice."},
    {tags:[""], heading:"Are your products safe to use?", para:"Our products are intended to be used according to their recommended serving instructions. Always check the product label and ingredients before use. If you have any medical condition, take medication, or have specific dietary concerns, consult a qualified healthcare professional before using supplements."},
    {tags:[""], heading:"How should I store my supplements?", para:"Store supplements in a cool, dry place away from direct sunlight and moisture. Keep containers tightly closed and out of reach of children."},
    {tags:[""], heading:"Can I take multiple supplements together?", para:"Some supplements can be combined, but combining products may result in overlapping ingredients or excessive intake. Check the nutritional information of each product and consult a healthcare professional if you are unsure."},
    {tags:[""], heading:"How do I place an order?", para:""},
    {tags:[""], heading:"How can I track my order?", para:""},
    {tags:[""], heading:"What payment methods do you accept?", para:""}
];

function Landing() {
    //const [restartStatisticAnimation, setRestartStatisticAnimation] = useState<boolean>(false);
    //const statisticRef = useRef<HTMLDivElement|null>(null);
    //const heroRef = useRef<HTMLDivElement|null>(null);
    //const isInViewStatisticRef = useInView(statisticRef, {amount:0.6});
    const [activeCords, setActiveCords] = useState<Record<string, boolean>>({});
    //const [activeShortVideo, setActiveShortVideo] = useState<HTMLVideoElement|null>(null);
    //const [cursor, setCursor] = useState<{left:number; x:number; width:number;}>({left:0, x:0, width:0});
    const videosRef = useRef<(HTMLVideoElement | null)[]>([]);
    //const previewsRef = useRef<(HTMLVideoElement | null)[]>([]);
    const [activeVideoIndex, setActiveVideoIndex] = useState<number | null>(null);
    //const [activePreviewIndex, setActivePreviewIndex] = useState<number | null>(null);
    const [searchFaqInput, setSearchFaqInput] = useState<string>("");
    //const [searchedResultFAQs, setSearchedResultFAQs] = useState<{matchedTag:string; tags:string[]; heading:string; para:string;}[]>([]);
    const [searchedResultFAQs, setSearchedResultFAQs] = useState<{isLoading:boolean; data:{matchedTag:string; tags:string[]; heading:string; para:string;}[];}>({isLoading:false, data:[]});


    //const activeShortVideo = useRef<HTMLVideoElement|null>(null);


    // for preview play/pause handler
    //useEffect(() => {
    //    if (activePreviewIndex === null) {
    //        previewsRef.current.forEach((video, index) => {
    //            if (video && index !== activePreviewIndex) {
    //                video.pause();
    //                video.currentTime = 0;
    //            }
    //        });
    //        return;
    //    }

    //    const selectedPreview = previewsRef.current[activePreviewIndex];

    //    if (!selectedPreview) return;

    //    // Pause every other video
    //    previewsRef.current.forEach((video, index) => {
    //        if (video && index !== activePreviewIndex) {
    //            video.pause();
    //            video.currentTime = 0;
    //        }
    //    });

    //    // Play the selected video
    //    selectedPreview.play().catch((error) => {
    //        if (error.name !== "AbortError") {
    //            console.error(error);
    //        }
    //    });
    //}, [activePreviewIndex]);


    // for video play/pause handler
    useEffect(() => {
        if (activeVideoIndex === null) {
            videosRef.current.forEach((video, index) => {
            if (video && index !== activeVideoIndex) {
                    video.pause();
                }
            });
            return;
        }
        
        const selectedVideo = videosRef.current[activeVideoIndex];
        
        if (!selectedVideo) return;
        
        // Pause every other video
        videosRef.current.forEach((video, index) => {
            if (video && index !== activeVideoIndex) {
                video.pause();
                video.currentTime = 0;
            }
        });

        // Play the selected video
        selectedVideo.play().catch((error) => {
            if (error.name !== "AbortError") {
                console.error(error);
            }
        });
    }, [activeVideoIndex]);


    function searchFAQHandler(question:string) {
        const words = question.split(" ");
        
        const resultFAQsIndexs:string[] = [];
        const matchedFAQs:{matchedTag:string; tags:string[]; heading:string; para:string;}[] = [];
        
        for (let i = 0; i < words.length; i++) {
            const tag = words[i];
            
            const reducedIndexs = ACCORDION_DATA.reduce((acc, iter, index) => {
                if (iter.tags.includes(tag)) {
                    if (!acc.includes(`${index}*${words[i]}`)) {
                        acc.push(`${index}*${words[i]}`);
                    }
                }
                return acc;
            }, [] as string[]);

            resultFAQsIndexs.push(...reducedIndexs);
        }

        for (let i = 0; i < resultFAQsIndexs.length; i++) {
            const matchedFAQ = {...ACCORDION_DATA[Number(resultFAQsIndexs[i].split("*")[0])], matchedTag:resultFAQsIndexs[i].split("*")[1]};
            matchedFAQs.push(matchedFAQ);
        }
        setSearchedResultFAQs({isLoading:false, data:matchedFAQs});
    };
    function playPauseVideoHandler(index:number) {
        if (activeVideoIndex === index) {
            setActiveVideoIndex(null);
        }
        else{
            setActiveVideoIndex(index);
        }
    }


    useEffect(() => {
        let setTimeoutID = 0;
        
        if (searchFaqInput.trim() === "") {
            setSearchedResultFAQs({isLoading:false, data:[]});
            return;
        }

        setSearchedResultFAQs({isLoading:true, data:[]});
        setTimeoutID = setTimeout(() => {
            searchFAQHandler(searchFaqInput);
            console.log(activeCords);
        }, 2000);
        
        return() => clearTimeout(setTimeoutID);
    }, [searchFaqInput]);

    return (
        <section className="selection:bg-primary-300 mt-20">
            {/* hero section */}
            <div className="w-full h-[80vh] flex flex-col justify-center items-center relative">
                <MeteorMash
                    animateUntill={true}
                    meteorCoreColor={{light:"255, 100, 103", dark:"255, 100, 103"}}
                    collisionDebriColor={{light:"255, 100, 103", dark:"255, 100, 103"}}
                    trailColor={{light:"255, 100, 103", dark:"255, 100, 103"}}
                    meteorCoreSize={2}
                    collisionDebriSize={2}
                    trailLength="xs"
                    trailLengthShrinkable="sm"
                    trailThickness={2}
                />
                <h1 className="text-[clamp(26px,5vw,60px)] text-primary-400 font-bold text-center mt-5">
                    <div className="leading-11 sm:leading-[clamp(12px,6.2vw,100px)]">Fuel Your<span className="bg-linear-90 from-primary-700 to-primary-200 text-transparent bg-clip-text"> Strength</span></div>
                    <div className="leading-11 sm:leading-[clamp(12px,6.2vw,100px)]"><span className="bg-linear-90 from-primary-200 to-primary-700 text-transparent bg-clip-text">Power</span> Every Workout</div>
                </h1>
                <div className="w-[60%] h-0.25 min-w-10 bg-red-500 mt-2 mb-3"
                    style={{
                        background:"linear-gradient(to right, white, white, white, var(--primary-400), white, white, white)"
                    }}
                ></div>
                <p className="text-gray-500 text-[clamp(12px,2.7vw,17px)] w-[60%] min-w-10 my-2 text-justify tracking-wide">Fuel your fitness journey with premium-quality supplements designed to support strength, endurance, recovery, and overall performance. At BodyPrime Nutrition, we believe every workout deserves the right nutrition, helping you unlock your full potential with products you can trust.</p>
                <div className="relative inline-block my-5">

                    {/* Button */}
                    <NavLink to="/home" className="block gradient-angle-selectable relative text-sm font-semibold sm:text-lg rounded-[10px] bg-white px-4 py-2 text-primary-400 cursor-pointer">
                        Shop Now
                    </NavLink>


                    {/* Border */}
                    <div className="
                            absolute -inset-0.5 rounded-xl gradient-angle-target -z-1
                        "
                        style={{
                            background:"conic-gradient(from var(--gradient-angle), white, var(--primary-500), white)",
                        }}
                    ></div>
                    
                </div>
            </div>



            {/*<div className="border border-amber-400 flex justify-center">
                <div className="border border-violet-500 w-[30%]">
                    <img src="vite.svg" alt="vite.svg"
                        className="w-full"
                    />
                </div>
                <div className="border border-indigo-500">
                    <p className="max-w-100 text-gray-500 text-lg">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Possimus temporibus at voluptas inventore quidem nisi suscipit nesciunt neque magni repudiandae? Sed asperiores pariatur mollitia minima vitae, corporis quia maxime non perspiciatis deserunt quos reiciendis suscipit sapiente repellendus neque iusto inventore.</p>
                </div>
            </div>*/}



            <Marquee
                marqueeElements={[
                    <div className="text-lg flex items-center gap-3 p-4 cursor-default">
                        <span className="text-gray-600 [text-shadow:0px_0px_4px_var(--color-gray-300)] font-mono font-semibold text-nowrap">Pure Ingredients</span><span className="text-primary-500"><BiLeaf /></span>
                    </div>,
                    <div className="text-lg flex items-center gap-3 p-4 cursor-default">
                        <span className="text-gray-600 [text-shadow:0px_0px_4px_var(--color-gray-300)] font-mono font-semibold text-nowrap">Third-Party Verified</span><span className="text-primary-500"><RiShieldFlashLine /></span>
                    </div>,
                    <div className="text-lg flex items-center gap-3 p-4 cursor-default">
                        <span className="text-gray-600 [text-shadow:0px_0px_4px_var(--color-gray-300)] font-mono font-semibold text-nowrap">Certified</span><span className="text-primary-500"><GrCertificate /></span>
                    </div>,
                    <div className="text-lg flex items-center gap-3 p-4 cursor-default">
                        <span className="text-gray-600 [text-shadow:0px_0px_4px_var(--color-gray-300)] font-mono font-semibold text-nowrap">Lab Tested</span><span className="text-primary-500"><GiChemicalDrop /></span>
                    </div>,
                    <div className="text-lg flex items-center gap-3 p-4 cursor-default">
                        <span className="text-gray-600 [text-shadow:0px_0px_4px_var(--color-gray-300)] font-mono font-semibold text-nowrap">Best Prices</span><span className="text-primary-500"><RiMoneyRupeeCircleLine /></span>
                    </div>,
                    <div className="text-lg flex items-center gap-3 p-4 cursor-default">
                        <span className="text-gray-600 [text-shadow:0px_0px_4px_var(--color-gray-300)] font-mono font-semibold text-nowrap">Free Delivery</span><span className="text-primary-500"><TbTruckDelivery /></span>
                    </div>
                ]}
                gap="40px"
            />


            <div className="text-lg sm:text-2xl text-gray-800 font-bold text-center py-2 sm:py-4 mt-10">
                <div>Our Trusted Brands</div>
            </div>
            <Marquee
                marqueeElements={
                    BRANDS.map((logo, index) => (
                        <div key={index} className="w-30 h-30 flex items-center gap-3 p-4">
                            <img src={logo.img} alt={logo.img} className="w-full h-full grayscale-100 hover:grayscale-0" />
                        </div>
                    ))
                }
                gap="40px"
            />


            {/* why we */}
            <Why />



            {/* statistics */}
            <Statistics />


            <PickerSlider
                items={
                    Array.from({length:7}).map((_, index) => (
                        <div className="border w-full aspect-[9/16] group">
                            {/*<video ref={(elem) => {videosRef.current[index] = elem}}
                                src="short_videos.mp4"
                                className=""
                            />*/}
                            <video ref={(elem) => {videosRef.current[index] = elem}}
                                src="/shorts/short1.mp4"
                                className="h-full w-full object-cover"
                            />
                            <div className={`absolute top-[50%] left-[50%] -translate-[50%] bg-primary-400/30 rounded-full transition-opacity ${activeVideoIndex !== index ? "opacity-80 group-hover:opacity-100":"opacity-0"} ease-in-out duration-300 `}>
                                <BiPlay className="text-primary-600 size-25 pl-3" />
                            </div>
                        </div>
                    ))
                }
                onSelect={playPauseVideoHandler}
            />


            {/* horizontal scrollbar */}
            {/*<SliderScrollY />*/}






            {/* patoni */}
            {/*<motion.div ref={heroRef} className="border-2 border-primary-400 w-full h-[200vh] relative"

            >
                <div className="w-50 h-50 bg-green-400 sticky top-[10%] left-[10%] -translate-x-[50%]"></div>
                <div className="w-50 h-50 bg-green-400 sticky top-[30%] left-[30%] -translate-x-[55%]"></div>
                <div className="w-50 h-50 bg-green-400 sticky top-[50%] left-[50%] -translate-x-[50%]"></div>
                <div className="w-50 h-50 bg-green-400 sticky top-[30%] left-[70%] -translate-x-[45%]"></div>
                <div className="w-50 h-50 bg-green-400 sticky top-[10%] left-[90%] -translate-x-[20%]"></div>
            </motion.div>*/}


            {/* FAQ */}
            <div className="">
                <div className="max-w-5xl mx-auto">
                    <div className="text-lg sm:text-2xl text-gray-800 font-bold text-center py-2 sm:py-4">
                        <div>Frequenty Asked Questions</div>
                    </div>
                    <div className="px-3">
                        <div className="border border-gray-200 w-full font-mono text-gray-700 text-lg rounded-lg flex items-center">
                            <input name="faqInput" placeholder="Search Your Question"
                                className="px-4 py-2 flex-1 outline-none"
                                value={searchFaqInput}
                                onChange={(e) => setSearchFaqInput(e.target.value)}
                            />
                            <button className="px-4 py-2 hover:bg-primary-200 cursor-pointer" onClick={() => {setSearchFaqInput(""); setSearchedResultFAQs({isLoading:false, data:[]});}}>X</button>
                        </div>

                        {/* skeletans & searched faq result */}
                        {
                            searchedResultFAQs.isLoading?
                                <div className="flex flex-col gap-2 my-2">
                                    <div className="h-8 rounded-lg overflow-hidden">
                                        <Skeletan />
                                    </div>
                                    <div className="h-8 rounded-lg overflow-hidden">
                                        <Skeletan />
                                    </div>
                                    <div className="h-8 rounded-lg overflow-hidden">
                                        <Skeletan />
                                    </div>
                                    <div className="h-8 rounded-lg overflow-hidden">
                                        <Skeletan />
                                    </div>
                                </div>
                                :
                                <div className="">
                                    {
                                        searchedResultFAQs.data.map(({matchedTag, heading, para}, index) => (
                                            <div key={index} className={`transition-all ease-in-out duration-300`}>
                                                <div className="text-gray-700 font-semibold p-4 flex justify-between items-center cursor-pointer transition-all ease-in-out duration-300" onClick={()=>setActiveCords((prev)=>({...prev, [`${index-searchedResultFAQs.data.length}`]:!prev[`${index-searchedResultFAQs.data.length}`]}))}>
                                                    <div className="text-md sm:text-xl">
                                                        <span>{heading.split(matchedTag)[0]}</span>
                                                        <span className="bg-primary-200">{matchedTag}</span>
                                                        <span>{heading.split(matchedTag)[1]}</span>
                                                    </div>
                                                    <div className={`text-xl ${activeCords[`${index-searchedResultFAQs.data.length}`]?"rotate-0":"rotate-180"} transition-transform ease-in-out duration-300`}><BsArrowUpShort /></div>
                                                </div>
                                                <div className={`text-gray-600 bg-primary-50 text-sm sm:text-lg px-4 [text-shadow:0px_0px_2px_var(--color-gray-300)] tracking-wide text-left overflow-hidden rounded-lg origin-top [box-shadow:0px_0px_4px_0px_var(--primary-300)_inset] ${activeCords[`${index-searchedResultFAQs.data.length}`]?"h-60 py-2":"h-0 py-0"} transition-all ease-in-out duration-300`}>{para}</div>
                                            </div>
                                        ))
                                    }
                                </div>
                        }


                    </div>
                    
                    <Accordion
                        data={ACCORDION_DATA}
                    />
                </div>
            </div>



            {/* footer */}
            <Footer />






            {/*<div className="border border-neutral-200 text-center px-5 py-10 rounded-xl">
                <h1 className="text-neutral-800 text-3xl font-semibold">Sorry For The Inconvenience</h1>
                <p className="text-neutral-600 text-lg my-2">
                    Landing page has not been created yet!
                </p>
                <NavLink to="/home" className="my-2 inline-block p-2 border border-[#f44669] text-[#f44669] rounded-lg text-lg">Go to Home Page</NavLink>
            </div>            */}
        </section>
         
    )
};


export default Landing;