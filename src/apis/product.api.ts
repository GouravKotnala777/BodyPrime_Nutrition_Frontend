import { apiHandler, toastHandler } from "../utils/functions";
import type { CreateProductFormTypes, ProductTypes, UpdateProductFormTypes } from "../utils/types";



export async function getProducts(skip:number, searchField:"name"|"category"|"brand"|"soldCount"|"returnCount"|"createdAt"|""="", searchQuery:string|""="", signal?:AbortSignal) {
    try {
        console.log("GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG");
        console.log({signal});
        console.log("GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG");
        
        const data = await apiHandler<null, ProductTypes[]>({
            endpoint:`/product/get_products?skip=${skip}&searchField=${searchField}&searchQuery=${searchQuery}`,
            method:"GET",
            contentType:"application/json",
            ...(signal&&{signal})
        });
        return data;        
    } catch (error) {
        console.log(error);
        if (error instanceof DOMException && error.name === "AbortError") {
            console.log("request aborted...");
            throw error;
        }
        toastHandler({success:false, message:new Error(error as string).message});
        throw error;
    }
};

export async function searchProducts(searchQuery:string) {
    try {
        const data = await apiHandler<null, {names:ProductTypes[]; categories:ProductTypes[]; brands:ProductTypes[]; tags:ProductTypes[];}>({
            endpoint:`/product/search_products?searchQuery=${searchQuery}`,
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

export async function getSimilarProducts({excludeProductID, brand, category}:{excludeProductID?:string; brand?:string; category?:string;}) {
    try {
        const data = await apiHandler<null, ProductTypes[]>({
            endpoint:`/product/get_similar_products?excludeProductID=${excludeProductID}&brand=${brand}&category=${category}`,
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

export async function getSingleProduct(productID:string, signal?:AbortSignal) {
    try {
        const data = await apiHandler<null, ProductTypes>({
            endpoint:`/product/single_product/${productID}`,
            method:"GET",
            contentType:"application/json",
            ...(signal&&{signal})
        });
        return data;        
    } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
            console.log("request aborted...");
            throw error;
        }
        console.log(error);
        toastHandler({success:false, message:new Error(error as string).message});
        throw error;
    }
};

export async function addImages(formData:FormData) {
    try {
        const data = await apiHandler<FormData, {images:string[]}>({
            endpoint:"/product/add_image",
            method:"POST",
            body:formData
        });
        toastHandler(data);
        return data;        
    } catch (error) {
        console.log(error);
        toastHandler({success:false, message:new Error(error as string).message});
        throw error;
    }
};

export async function createProduct(formData:CreateProductFormTypes) {
    try {
        const data = await apiHandler<CreateProductFormTypes, ProductTypes>({
            endpoint:"/product/create_product",
            method:"POST",
            contentType:"application/json",
            body:formData
        });
        toastHandler(data);
        return data;
    } catch (error) {
        console.log(error);
        toastHandler({success:false, message:new Error(error as string).message});
        throw error;
    }
};

export async function updateProduct(formData:UpdateProductFormTypes, productID:string) {
    try {
        const data = await apiHandler<UpdateProductFormTypes, ProductTypes>({
            endpoint:`/product/update_product?productID=${productID}`,
            method:"PUT",
            contentType:"application/json",
            body:formData
        });
        toastHandler(data);
        return data;
    } catch (error) {
        console.log(error);
        toastHandler({success:false, message:new Error(error as string).message});
        throw error;
    }
};