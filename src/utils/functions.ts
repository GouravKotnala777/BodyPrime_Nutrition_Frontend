import type { CartTypesFlatted, CartTypesPopulated, WishlistTypesFlatted, WishlistTypesPopulated } from "./types";
import toast from "react-hot-toast";

interface APIHandlerTypes<BodyType> {
    endpoint:string;
    method:"GET"|"POST"|"PUT"|"DELETE";
    contentType?:"application/json";
    body?:BodyType|FormData;
    signal?:AbortSignal;
};

export async function apiHandler <BodyType, JsonResType>({endpoint, method, contentType, body, signal}:APIHandlerTypes<BodyType>) {
    try {
        const isFormData = body instanceof FormData;
        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/v1${endpoint}`, {
            method,
            ...(contentType&&{
                headers:{
                    "Content-Type":contentType
                }
            }),
            credentials:"include",
            ...(signal&&{signal}),
            body:isFormData?body:JSON.stringify(body)
        });

        const result = await res.json();
        return result as {success:boolean; message:string; jsonData:JsonResType};
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export function transformCartDataForRes(cartData:CartTypesPopulated) {
    const transformedCartData = cartData.products.reduce((acc, {productID, variant, quantity}) => {
        acc.products.push({
            _id:productID._id,
            name:productID.name,
            brand:productID.brand,
            category:productID.category,
            price:productID.price,
            weight:productID.weight,
            flavor:productID.flavor,
            images:productID.images,
            dietaryType:productID.dietaryType,
            quantity,
            variant
        });
        return acc;
    }, {userID:"", products:[], totalPrice:0} as CartTypesFlatted);
    return transformedCartData;
};
export function transformWishlistDataForRes(wishlistData:WishlistTypesPopulated) {
    const transformedCartData = wishlistData.products.reduce((acc, {productID, variant}) => {
        acc.products.push({
            _id:productID._id,
            name:productID.name,
            brand:productID.brand,
            category:productID.category,
            price:productID.price,
            weight:productID.weight,
            flavor:productID.flavor,
            images:productID.images,
            dietaryType:productID.dietaryType,
            variant
        });
        return acc;
    }, {userID:"", products:[]} as WishlistTypesFlatted);

    return transformedCartData;
};

export function toastHandler({success, message}:{success:boolean; message:string;}) {
    if (success) {
        toast.success(message, {
            duration:2400,
            position:"top-center"
        });
    }
    else{
        toast.error(message, {
            duration:2400,
            position:"top-center",
            style:{fontSize:"1.3rem"}
        });
    }
};

export const capitalizeString = (str?:string) => {
    if (!str) return "word is undefined";
    return str.charAt(0).toUpperCase()+str.slice(1);
};
export function converKgtolbs(weight:string) {
    // abhi conditions for weight input reh rahe hai
    const doesContainKG = weight.includes("kg");
    let value = 0;
    if (doesContainKG) {
        value = Number(weight.slice(0,-2));
    }
    else{
        value = Number(weight.slice(0,-1));            
    }
    return (value*2.20462).toFixed(1);
}