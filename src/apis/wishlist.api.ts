import { apiHandler, toastHandler } from "../utils/functions";
import type { WishlistTypes } from "../utils/types";

export async function getWishlist() {
    try {
        const data = await apiHandler<null, WishlistTypes[]>({
            endpoint:"/wishlist/get_wishlist",
            method:"GET",
            contentType:"application/json",
        });
        return data;
    } catch (error) {
        console.log(error);
        toastHandler({success:false, message:new Error(error as string).message});
        throw error;
    }
};

export async function addToWishlist({productID}:{productID:string;}) {
    try {
        const data = await apiHandler<{productID:string;}, {productID:string; operation:1|-1;}>({
            endpoint:"/wishlist/add_to_wishlist",
            method:"POST",
            contentType:"application/json",
            body:{productID}
        });
        toastHandler(data);
        return data;
    } catch (error) {
        console.log(error);
        toastHandler({success:false, message:new Error(error as string).message});
        throw error;
    }
};