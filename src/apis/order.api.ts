import { apiHandler, toastHandler } from "../utils/functions";
import type { CreateOrderFormType, OrderTypes, PaymentStatusType } from "../utils/types";



export async function allOrders() {
    try {
        const res = await apiHandler<null, {pending:OrderTypes[], processing:OrderTypes[], shipped:OrderTypes[], delivered:OrderTypes[], cancelled:OrderTypes[]}>({
            endpoint:"/order/all_orders",
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

export async function sendDeliveryConfirmation(body:{orderID:string;}) {
    try {
        const res = await apiHandler<{orderID:string}, null>({
            endpoint:"/order/send_delivery_confirmation",
            method:"POST",
            contentType:"application/json",
            body
        });
        return res;        
    } catch (error) {
        console.log(error);
        toastHandler({success:false, message:new Error(error as string).message});
        throw error;
    }
};

export async function verifyDeliveryConfirmation(body:{orderID:string; otp:string;}) {
    try {
        const res = await apiHandler<{orderID:string; otp:string;}, null>({
            endpoint:"/order/verify_delivery_confirmation",
            method:"PUT",
            contentType:"application/json",
            body
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