import { apiHandler, toastHandler } from "../utils/functions";
import type { CategoryTypes, DateRangeType, OrderSummaryDataType, ProductSummaryDataType, UserSummaryDataType } from "../utils/types";


export async function getUserSummaryData() {
    try {
        const data = await apiHandler<null, UserSummaryDataType[]>({
            endpoint:`/dashboard/get_user_summary`,
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
export async function getProductSummaryData() {
    try {
        const data = await apiHandler<null, ProductSummaryDataType[]>({
            endpoint:`/dashboard/get_product_summary`,
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
export async function getAllOutStockedProducts() {
    try {
        const data = await apiHandler<null, {_id:string; outOfStocked:string[];}[]>({
            endpoint:`/dashboard/get_outstocked_products`,
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
export async function getBrandToCategoryStockData({category}:{category:CategoryTypes;}) {
    try {
        const data = await apiHandler<null, {brand:string; stock:number;}[]>({
            endpoint:`/dashboard/get_brand_category_stock?category=${category}`,
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
export async function getOrderSummaryData({range, startDateParam, endDateParam}:{range:DateRangeType; startDateParam?:string; endDateParam?:string;}) {
    try {
        const data = await apiHandler<null, OrderSummaryDataType[]>({
            endpoint:`/dashboard/get_order_summary?range=${range}&startDateParam=${startDateParam}&endDateParam=${endDateParam}`,
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