import { apiHandler } from "../utils/functions";
import type { CreateOrderFormType, OrderTypes } from "../utils/types";



export async function createOrder(body:CreateOrderFormType) {
    try {
        const res = await apiHandler<CreateOrderFormType, {clientSecret:string; newOrder:OrderTypes;}>({
            endpoint:"/order/create",
            method:"POST",
            contentType:"application/json",
            body
        });
        return res;        
    } catch (error) {
        console.log(error);
        throw error;
    }
};