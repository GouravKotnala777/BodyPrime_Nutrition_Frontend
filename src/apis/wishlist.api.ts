import { apiHandler, toastHandler } from "../utils/functions";
import type { WishlistTypesPopulated } from "../utils/types";

export async function getWishlist() {
    try {
        //const data = await apiHandler<null, WishlistTypes[]>({
        const data = await apiHandler<null, WishlistTypesPopulated>({
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

export async function addToWishlist({productID, variant}:{productID:string; variant:string;}) {
    try {
        const data = await apiHandler<{productID:string; variant:string;}, {productID:string; variant:string; operation:1|-1;}>({
            endpoint:"/wishlist/add_to_wishlist",
            method:"POST",
            contentType:"application/json",
            body:{productID, variant}
        });
        toastHandler(data);
        return data;
    } catch (error) {
        console.log(error);
        toastHandler({success:false, message:new Error(error as string).message});
        throw error;
    }
};