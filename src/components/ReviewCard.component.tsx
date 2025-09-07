import { NavLink } from "react-router-dom";
import RatingStars from "./RatingStars.component";
import vite from "/public/vite.svg";
import type { ReviewTypesPopulated } from "../utils/types";



function ReviewCard({productID, userID, ...review}:ReviewTypesPopulated) {
    const reviewActionDate = review.updatedAt ? `Review updated on ${review.updatedAt}`:`Reviewed in India on ${review.createdAt}`;

    return(
        <div className="flex flex-col gap-2 py-5 border-b-[1px] border-b-gray-200">
            <div className="flex">
                <img src={vite} alt={vite} />
                <span>{userID.name}</span>
            </div>
            <div className="flex">
                <RatingStars rating={review.rating} outOf={5} />
                <span className="text-orange-400 font-semibold">Verified Purchase</span>
            </div>
            <div className="flex flex-col text-gray-500">
                <span>{reviewActionDate}</span>
                <span>Flavour Name: {productID.flavor} {productID.size} {productID.weight}</span>
            </div>
            <div className="flex">
                <span>{review.comment}</span>
            </div>
            <div className="flex justify-between">
                <button className="border-[1px] px-4 py-2 rounded-3xl text-gray-900">Helpful</button>
                <NavLink to="/share" className="px-4 py-2 text-gray-900">Share</NavLink>
                <NavLink to="/report" className="px-4 py-2 text-gray-900">Report</NavLink>
            </div>
        </div>
    )
};

export default ReviewCard;