import RatingStars from "./RatingStars.component";
import type { ReviewTypesPopulated } from "../utils/types";
import ImageWithFallback from "./ImageWithFallback.component";
import { NavLink } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { RiCheckDoubleLine } from "react-icons/ri";



function ReviewCard({productID, userID, ...review}:ReviewTypesPopulated) {
    const reviewActionDate = review.updatedAt ? `Review updated on ${new Date(review.updatedAt).toLocaleString(undefined, {day:"2-digit", month:"short", year:"numeric"})}`:`Reviewed in India on ${new Date(review.createdAt).toLocaleString(undefined, {day:"numeric", month:"short", year:"numeric"})}`;

    return(
        <div className="border border-gray-200 w-80 flex flex-col gap-2 p-4 rounded-lg">
            <div className="flex gap-2">
                <div className="size-14">
                    <ImageWithFallback
                        src="/vite.sv"
                        alt="/vite.svg"
                        fallbackSrc="/placeholders/no_user.png"
                        className="rounded-full"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <div className="text-gray-800">{userID.name}</div>
                    <div className="relative flex items-center gap-1">
                        <RatingStars rating={review.rating} outOf={5} />
                        <span className="text-gray-500 text-sm">( {review.rating} )</span>
                        <div className="group">
                            {
                                review.isVerifiedPurchase &&
                                    <RiCheckDoubleLine className="text-primary-400 text-lg group-hover:text-sky-400 transition-colors ease-in-out duration-300" />
                            }
                            <div className={`bg-gray-700 text-gray-200 text-xs py-0.5 pb-1 px-1.75 rounded-sm absolute top-0 left-0 scale-80 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all ease-in-out duration-300 delay-100`}>
                                <span className="">verified buyer</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-1">
                <div className="text-gray-400 text-xs font-mono">{reviewActionDate}</div>
            </div>
            <div className="text-gray-700 text-md -tracking-tighter">{review.comment}</div>
            <NavLink to="####" target="_blank" className="text-primary-400 relative w-min ml-auto mt-auto flex items-center pr-2 group">
                <div className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="size-5 fill-none stroke-primary-400 translate-y-1 group-hover:scale-110 transition-all ease-out duration-300">
                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                    </svg>
                    <div className="relative">
                        <div>gouravkotnala777</div>
                        <div className="bg-gray-200 absolute left-0 -bottom-0.25 w-full h-[1.5px] rounded-full hidden sm:block"></div>
                        <div className="bg-primary-400 absolute left-0 -bottom-0.25 w-full h-[0.5px] sm:h-[1.5px] rounded-full scale-x-100 sm:scale-x-0 origin-left group-hover:scale-x-100 transition-all ease-out duration-300"></div>
                    </div>
                </div>
                <FiArrowRight className="translate-y-1 group-hover:translate-x-2 transition-all ease-out duration-300" />
            </NavLink>

        </div>



        //<div className="border border-gray-200 flex flex-col gap-2 w-80 text-center rounded-md p-4">
        //    <div className="flex flex-col items-center gap-2">
        //        <img src="/vite.svg" alt="/vite.svg" className="border border-gray-200 rounded-full size-14" />
        //        <span>{userID.name}</span>
        //    </div>
        //    <div className="flex justify-center">
        //        <RatingStars rating={review.rating} outOf={5} />
        //        &nbsp;&nbsp;&nbsp; <span className="text-orange-400 font-semibold">{review.isVerifiedPurchase&&"Verified Purchase"}</span>
        //    </div>
        //    <div className="flex flex-col text-gray-500">
        //        <span>{reviewActionDate}</span>
        //        <span>Flavour Name: {productID.flavor} {productID.weight}</span>
        //    </div>
        //    <div className="flex text-justify">
        //        <span>{review.comment}</span>
        //    </div>
        //    <div className="flex justify-between">
        //        <button className="border-[1px] px-4 py-2 rounded-3xl text-gray-900">Helpful</button>
        //        <NavLink to="/share" className="px-4 py-2 text-gray-900">Share</NavLink>
        //        <NavLink to="/report" className="px-4 py-2 text-gray-900">Report</NavLink>
        //    </div>
        //</div>
    )
};

export default ReviewCard;