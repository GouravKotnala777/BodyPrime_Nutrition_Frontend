import { apiHandler } from "../utils/functions";
import type { LoginFormTypes, RegisterFormTypes, UserTypes } from "../utils/types";



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
export async function myProfile() {
    try {
        const data = await apiHandler<null, UserTypes>({
            endpoint:"/user/my_profile",
            method:"GET",
            contentType:"application/json"
        });
        return data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};
export async function updateProfile(formData:{name?:string; mobile?:string; gender?:string}) {
    try {
        const data = await apiHandler<{name?:string; mobile?:string; gender?:string}, UserTypes>({
            endpoint:"/user/update_profile",
            method:"PUT",
            contentType:"application/json",
            body:formData
        });
        return data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};