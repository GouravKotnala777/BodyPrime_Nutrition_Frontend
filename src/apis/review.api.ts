import { apiHandler } from "../utils/functions";
import type { CreateReviewBodyTypes, ReviewTypes, ReviewTypesPopulated } from "../utils/types";




export async function createReview({productID, rating, comment}:CreateReviewBodyTypes) {
    try {
        const data = await apiHandler<{rating:number; comment?:string;}, ReviewTypes>({
            endpoint:`/review/create/${productID}`,
            method:"POST",
            contentType:"application/json",
            body:{rating, comment}
        });
        return data;        
    } catch (error) {
        console.log(error);
        throw error;
    }
};
export async function getReviews({productID}:{productID:string;}) {
    try {
        const data = await apiHandler<null, ReviewTypesPopulated[]>({
            endpoint:`/review/get_reviews/${productID}`,
            method:"GET",
            contentType:"application/json"
        });
        return data;        
    } catch (error) {
        console.log(error);
        throw error;
    }
};