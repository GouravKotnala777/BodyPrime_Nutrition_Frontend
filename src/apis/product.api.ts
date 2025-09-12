import { apiHandler } from "../utils/functions";
import type { ProductTypes } from "../utils/types";



export async function getProducts(skip:number) {
    try {
        const data = await apiHandler<null, ProductTypes[]>({
            endpoint:`/product/get_products?skip=${skip}`,
            method:"GET",
            contentType:"application/json"
        });
        return data;        
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export async function getSingleProduct(productID:string) {
    try {
        const data = await apiHandler<null, ProductTypes>({
            endpoint:`/product/single_product/${productID}`,
            method:"GET",
            contentType:"application/json"
        });
        return data;        
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export async function addImages(formData:FormData) {
    try {
        const data = await apiHandler<FormData, {}>({
            endpoint:"/product/add_image",
            method:"POST",
            body:formData
        });
        return data;        
    } catch (error) {
        throw error;
    }
};