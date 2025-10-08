import { apiHandler, toastHandler } from "../utils/functions";
import type { CartTypesPopulated, ProductTypes } from "../utils/types";


export async function getCart() {
    try {
        const data = await apiHandler<null, CartTypesPopulated>({
            endpoint:"/cart/get_cart",
            method:"GET",
            contentType:"application/json"
        });
        return data;
    } catch (error) {
        console.log(error);
        toastHandler({success:false, message:new Error(error as string).message});
        throw error;
    }
};
export async function addToCart({productID, quantity}:{productID:string; quantity:number;}) {
    try {
        const data = await apiHandler<{productID:string; quantity:number;}, {products:ProductTypes; quantity:number;}>({
            endpoint:"/cart/add_to_cart",
            method:"POST",
            contentType:"application/json",
            body:{productID, quantity}
        });
        toastHandler(data);
        return data;
    } catch (error) {
        console.log(error);
        toastHandler({success:false, message:new Error(error as string).message});
        throw error;
    }
};
export async function removeFromCart({productID, quantity}:{productID:string; quantity:number;}) {
    try {
        const data = await apiHandler<{productID:string; quantity:number;}, {products:string; quantity:number;}>({
            endpoint:"/cart/remove_from_cart",
            method:"POST",
            contentType:"application/json",
            body:{productID, quantity}
        });
        toastHandler(data);
        return data;
    } catch (error) {
        console.log(error);
        toastHandler({success:false, message:new Error(error as string).message});
        throw error;
    }
};