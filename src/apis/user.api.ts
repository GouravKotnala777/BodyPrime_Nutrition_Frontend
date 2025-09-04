import type { LoginFormTypes, RegisterFormTypes, UserTypes } from "../utils/types";

interface APIHandlerTypes<BodyType> {
    endpoint:string;
    method:"GET"|"POST"|"PUT"|"DELETE";
    contentType:"application/json"|"multipart/form-data";
    body:BodyType
};

async function apiHandler <BodyType, JsonResType>({endpoint, method, contentType, body}:APIHandlerTypes<BodyType>) {
    try {
        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}${endpoint}`, {
            method,
            headers:{
                "Content-Type":contentType
            },
            credentials:"include",
            body:JSON.stringify(body)
        });

        const result = await res.json();
        return result as {success:boolean; message:string; jsonData:JsonResType};
    } catch (error) {
        console.log(error);
        throw error;
    }
}


export async function login(formData:LoginFormTypes) {
    try {
        const data = await apiHandler<LoginFormTypes, UserTypes>({
            endpoint:"/user/login",
            method:"POST",
            contentType:"application/json",
            body:formData
        });
        return data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};
export async function register(formData:RegisterFormTypes) {
    try {
        const data = await apiHandler<RegisterFormTypes, UserTypes>({
            endpoint:"/user/register",
            method:"POST",
            contentType:"application/json",
            body:formData
        });
        return data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};