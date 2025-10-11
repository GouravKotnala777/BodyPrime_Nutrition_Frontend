import { apiHandler, toastHandler } from "../utils/functions";
import type { CreateOrderFormType, OrderTypes, PaymentStatusType } from "../utils/types";



export async function myOrders() {
    try {
        const res = await apiHandler<null, OrderTypes[]>({
            endpoint:"/order/my_orders",
            method:"GET",
            contentType:"application/json"
        });
        return res;        
    } catch (error) {
        console.log(error);
        toastHandler({success:false, message:new Error(error as string).message});
        throw error;
    }
};

export async function createOrder(body:CreateOrderFormType) {
    try {
        const res = await apiHandler<CreateOrderFormType, {clientSecret:string; newOrder:OrderTypes;}>({
            endpoint:"/order/create",
            method:"POST",
            contentType:"application/json",
            body
        });
        toastHandler(res);
        return res;        
    } catch (error) {
        console.log(error);
        toastHandler({success:false, message:new Error(error as string).message});
        throw error;
    }
};

export async function updateOrder(orderID:string, body:{transactionID:string; status:PaymentStatusType; message:string|null; error?:string;}) {
    try {
        const res = await apiHandler<{transactionID:string; status:PaymentStatusType; message:string|null; error?:string;}, {}>({
            endpoint:`/order/update?orderID=${orderID}`,
            method:"PUT",
            contentType:"application/json",
            body
        });
        toastHandler(res);
        return res;        
    } catch (error) {
        console.log(error);
        toastHandler({success:false, message:new Error(error as string).message});
        throw error;
    }
};