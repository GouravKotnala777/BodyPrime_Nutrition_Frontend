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