import { apiHandler } from "../utils/functions";
import type { CreateOrderFormType, OrderTypes } from "../utils/types";



export async function createOrder(body:CreateOrderFormType) {
    try {
        const res = await apiHandler<CreateOrderFormType, OrderTypes>({
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

export async function createPaymentIntent({totalPrice}:{totalPrice:number}) {
    try {
        const res = await apiHandler<{totalPrice:number}, {clientSecret:string;}>({
            endpoint:"/order/create-payment-intent",
            method:"POST",
            contentType:"application/json",
            body:{totalPrice}
        });
        return res;        
    } catch (error) {
        console.log(error);
        throw error;
    }
}