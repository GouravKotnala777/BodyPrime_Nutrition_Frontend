import { NavLink } from "react-router-dom";
import RatingStars from "./RatingStars.component";
import type { ReviewTypesPopulated } from "../utils/types";



function ReviewCard({productID, userID, ...review}:ReviewTypesPopulated) {
    const reviewActionDate = review.updatedAt ? `Review updated on ${new Date(review.updatedAt).toLocaleString(undefined, {day:"2-digit", month:"short", year:"numeric"})}`:`Reviewed in India on ${new Date(review.createdAt).toLocaleString(undefined, {day:"numeric", month:"short", year:"numeric"})}`;

    return(
        <div className="flex flex-col gap-2 py-5 border-b-[1px] border-b-gray-200">
            <div className="flex">
                <img src="/vite.svg" alt="/vite.svg" />
                <span>{userID.name}</span>
            </div>
            <div className="flex">
                <RatingStars rating={review.rating} outOf={5} />
                &nbsp;&nbsp;&nbsp; <span className="text-orange-400 font-semibold">{review.isVerifiedPurchase&&"Verified Purchase"}</span>
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