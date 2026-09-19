import { useEffect, useState } from "react";
import { BiStar } from "react-icons/bi";
import RatingStars from "./RatingStars.component";

interface ReviewSummeryPropInterface{
    productID?:string;
    averageRating:number;
    totalRatings:number;
    numOfReviews:number;
    ratings:{oneStar:number; twoStar:number; threeStar:number; fourStar:number; fiveStar:number;};
};

function ReviewSummery({productID, averageRating, totalRatings, numOfReviews, ratings}:ReviewSummeryPropInterface) {
    const [ratingsPercentage, setRatingsPercentage] = useState<{oneStar:number; twoStar:number; threeStar:number; fourStar:number; fiveStar:number;}>({oneStar:0, twoStar:0, threeStar:0, fourStar:0, fiveStar:0});

    function emitRatingFormModelEvent() {
        console.log({isReviewCardOpen:true, productID});
        
        if (!productID) {
            console.log("productID not found in emitRatingFormModelEvent in SingleProduct page");
            return;
        }
        const event = new CustomEvent<{isReviewCardOpen:boolean; productID:string;}>("toggleReviewCard", {
            detail:{isReviewCardOpen:true, productID}
        });
        window.dispatchEvent(event);
    };

    function calculateRatingPercentage() {        
        const {oneStar, twoStar, threeStar,  fourStar, fiveStar} = ratings;

        const oneStarPercentage = Math.round((oneStar/numOfReviews)*100);
        const twoStarPercentage = Math.round((twoStar/numOfReviews)*100);
        const threeStarPercentage = Math.round((threeStar/numOfReviews)*100);
        const fourStarPercentage = Math.round((fourStar/numOfReviews)*100);
        const fiveStarPercentage = Math.round((fiveStar/numOfReviews)*100);

        setRatingsPercentage({
            oneStar:oneStarPercentage,
            twoStar:twoStarPercentage,
            threeStar:threeStarPercentage,
            fourStar:fourStarPercentage,
            fiveStar:fiveStarPercentage
        });
    };

    useEffect(() => {
        calculateRatingPercentage();
    }, []);

    return(
        <div className="flex flex-col gap-10">
            <div className="flex justify-between items-center mt-6">
                <div className="text-lg">Ratings & Reviews</div>
                <button className="bg-secondary-100 text-secondary-800 py-1 px-4 rounded-sm hover:bg-secondary-50 transition-colors ease-out duration-300" onClick={emitRatingFormModelEvent}>Rate Product</button>
            </div>
            <div className="flex justify-around items-center">
                <div className="flex flex-col gap-2 w-max">
                    {/*<pre className="text-sm">{JSON.stringify(ratingsPercentage, null, `\t`)}</pre>*/}
                    <div className="text-gray-700 text-2xl font-semibold flex gap-1 items-end w-max mx-auto"><span className="">{averageRating}</span>/<span className="text-lg">5</span></div>
                    <div className="flex gap-1 text-yellow-400 w-max mx-auto"><RatingStars rating={averageRating} outOf={5} /></div>
                    <div className="text-gray-500">{totalRatings} Ratings & {numOfReviews} Reviews</div>
                </div>
                <div className="flex flex-col gap-2">
                    {/* five star bar */}
                    <div className="flex items-center gap-2">
                        <span className="flex items-center text-green-500 text-xs">5 <BiStar className="size-2.5" /></span>
                        <div className="w-30 relative h-1.5 group">
                            <div className={`absolute top-0 left-0 h-full rounded-2xl group-hover:opacity-30 [animation:animate-px--400-to-400_4s_1s_ease-in_infinite]`}
                                style={{
                                    width:`${ratingsPercentage.fiveStar}%`,
                                    background:"linear-gradient(135deg, var(--color-green-500) 0% 12%, var(--color-green-50) 17% 18%, var(--color-green-500) 23% 100%)",
                                    backgroundPosition:"var(--px--400-to-400) 0px",
                                    backgroundSize:"800px"
                                }}
                            ></div>
                            <div className="bg-gray-200 h-full rounded-2xl group-hover:opacity-30"></div>
                            {/* tooltip for rating bar */}
                            <div className={`bg-gray-700 text-gray-200 text-xs py-0.5 pb-1 px-1.75 rounded-sm absolute top-[50%] -translate-y-[50%] -left-[50%] scale-80 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all ease-in-out duration-300 delay-100`}>
                                <span className="">{ratings.fiveStar} five stars</span>
                            </div>
                        </div>
                        <span className="text-gray-600 text-xs">{ratingsPercentage.fiveStar}%</span>
                    </div>
                    {/* four star bar */}
                    <div className="flex items-center gap-2">
                        <span className="flex items-center text-lime-500 text-xs">4 <BiStar className="size-2.5" /></span>
                        <div className="w-30 relative h-1.5 group">
                            <div className={`absolute top-0 left-0 h-full rounded-2xl group-hover:opacity-30 [animation:animate-px--400-to-400_4s_1.2s_ease-in_infinite]`}
                                style={{
                                    width:`${ratingsPercentage.fourStar}%`,
                                    background:"linear-gradient(135deg, var(--color-lime-500) 0% 12%, var(--color-lime-50) 17% 18%, var(--color-lime-500) 23% 100%)",
                                    backgroundPosition:"var(--px--400-to-400) 0px",
                                    backgroundSize:"800px"
                                }}
                            ></div>
                            <div className="bg-gray-200 h-full rounded-2xl group-hover:opacity-30"></div>
                            {/* tooltip for rating bar */}
                            <div className={`bg-gray-700 text-gray-200 text-xs py-0.5 pb-1 px-1.75 rounded-sm absolute top-[50%] -translate-y-[50%] -left-[50%] scale-80 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all ease-in-out duration-300 delay-100`}>
                                <span className="">{ratings.fourStar} four stars</span>
                            </div>
                        </div>
                        <span className="text-gray-600 text-xs">{ratingsPercentage.fourStar}%</span>
                    </div>
                    {/* three star bar */}
                    <div className="flex items-center gap-2">
                        <span className="flex items-center text-yellow-500 text-xs">3 <BiStar className="size-2.5" /></span>
                        <div className="w-30 relative h-1.5 group">
                            <div className={`absolute top-0 left-0 h-full rounded-2xl group-hover:opacity-30 [animation:animate-px--400-to-400_4s_1.4s_ease-in_infinite]`}
                                style={{
                                    width:`${ratingsPercentage.threeStar}%`,
                                    background:"linear-gradient(135deg, var(--color-yellow-500) 0% 12%, var(--color-yellow-50) 17% 18%, var(--color-yellow-500) 23% 100%)",
                                    backgroundPosition:"var(--px--400-to-400) 0px",
                                    backgroundSize:"800px"
                                }}
                            ></div>
                            <div className="bg-gray-200 h-full rounded-2xl group-hover:opacity-30"></div>
                            {/* tooltip for rating bar */}
                            <div className={`bg-gray-700 text-gray-200 text-xs py-0.5 pb-1 px-1.75 rounded-sm absolute top-[50%] -translate-y-[50%] -left-[50%] scale-80 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all ease-in-out duration-300 delay-100`}>
                                <span className="">{ratings.threeStar} three stars</span>
                            </div>
                        </div>
                        <span className="text-gray-600 text-xs">{ratingsPercentage.threeStar}%</span>
                    </div>
                    {/* two star bar */}
                    <div className="flex items-center gap-2">
                        <span className="flex items-center text-orange-400 text-xs">2 <BiStar className="size-2.5" /></span>
                        <div className="w-30 relative h-1.5 group">
                            <div className={`absolute top-0 left-0 h-full rounded-2xl group-hover:opacity-30 [animation:animate-px--400-to-400_4s_1.6s_ease-in_infinite]`}
                                style={{
                                    width:`${ratingsPercentage.threeStar}%`,
                                    background:"linear-gradient(135deg, var(--color-orange-500) 0% 12%, var(--color-orange-50) 17% 18%, var(--color-orange-500) 23% 100%)",
                                    backgroundPosition:"var(--px--400-to-400) 0px",
                                    backgroundSize:"800px"
                                }}
                            ></div>
                            <div className="bg-gray-200 h-full rounded-2xl group-hover:opacity-30"></div>
                            {/* tooltip for rating bar */}
                            <div className={`bg-gray-700 text-gray-200 text-xs py-0.5 pb-1 px-1.75 rounded-sm absolute top-[50%] -translate-y-[50%] -left-[50%] scale-80 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all ease-in-out duration-300 delay-100`}>
                                <span className="">{ratings.twoStar} two stars</span>
                            </div>
                        </div>
                        <span className="text-gray-600 text-xs">{ratingsPercentage.twoStar}%</span>
                    </div>
                    {/* one star bar */}
                    <div className="flex items-center gap-2">
                        <span className="flex items-center text-red-500 text-xs">1 <BiStar className="size-2.5" /></span>
                        <div className="w-30 relative h-1.5 group">
                            <div className={`absolute top-0 left-0 h-full rounded-2xl group-hover:opacity-30 [animation:animate-px--400-to-400_4s_1.8s_ease-in_infinite]`}
                                style={{
                                    width:`${ratingsPercentage.oneStar}%`,
                                    background:"linear-gradient(135deg, var(--color-red-500) 0% 12%, var(--color-red-50) 17% 18%, var(--color-red-500) 23% 100%)",
                                    backgroundPosition:"var(--px--400-to-400) 0px",
                                    backgroundSize:"800px"
                                }}
                            ></div>
                            <div className="bg-gray-200 h-full rounded-2xl group-hover:opacity-30"></div>
                            {/* tooltip for rating bar */}
                            <div className={`bg-gray-700 text-gray-200 text-xs py-0.5 pb-1 px-1.75 rounded-sm absolute top-[50%] -translate-y-[50%] -left-[50%] scale-80 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all ease-in-out duration-300 delay-100`}>
                                <span className="">{ratings.oneStar} one star</span>
                            </div>
                        </div>
                        <span className="text-gray-600 text-xs">{ratingsPercentage.oneStar}%</span>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default ReviewSummery;