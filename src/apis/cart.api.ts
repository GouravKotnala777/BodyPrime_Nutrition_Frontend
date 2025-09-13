import { apiHandler } from "../utils/functions";
import type { CartTypes } from "../utils/types";


export async function addToCart({productID, quantity}:{productID:string; quantity:number;}) {
    try {
        const data = await apiHandler<{productID:string; quantity:number;}, CartTypes>({
            endpoint:"/cart/add_to_cart",
            method:"POST",
            contentType:"application/json",
            body:{productID, quantity}
        });

        return data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};