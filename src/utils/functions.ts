import type { CartTypesFlatted, CartTypesPopulated } from "./types";
import toast from "react-hot-toast";

interface APIHandlerTypes<BodyType> {
    endpoint:string;
    method:"GET"|"POST"|"PUT"|"DELETE";
    contentType?:"application/json";
    body?:BodyType|FormData;
};

export async function apiHandler <BodyType, JsonResType>({endpoint, method, contentType, body}:APIHandlerTypes<BodyType>) {
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
    const transformedCartData = cartData.products.reduce((acc, {productID, quantity}) => {
        acc.products.push({
            _id:productID._id,
            name:productID.name,
            brand:productID.brand,
            category:productID.category,
            price:productID.price,
            size:productID.size,
            weight:productID.weight,
            flavor:productID.flavor,
            images:productID.images,
            quantity
        });
        return acc;
    }, {userID:"", products:[], totalPrice:0} as CartTypesFlatted);

    console.log(transformedCartData);
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