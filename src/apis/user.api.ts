import { apiHandler, toastHandler } from "../utils/functions";
import type { LoginFormTypes, RegisterFormTypes, UserTypes } from "../utils/types";



export async function login(formData:LoginFormTypes) {
    try {
        const data = await apiHandler<LoginFormTypes, UserTypes>({
            endpoint:"/user/login",
            method:"POST",
            contentType:"application/json",
            body:formData
        });

        //toastHandler(data);
        return data;
    } catch (error) {
        console.log(error);
        //toastHandler({success:false, message:new Error(error as string).message});
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
        toastHandler(data);
        return data;
    } catch (error) {
        console.log(error);
        toastHandler({success:false, message:new Error(error as string).message});
        throw error;
    }
};
export async function myProfile(signal?:AbortSignal) {
    try {
        const data = await apiHandler<null, UserTypes|null>({
            endpoint:"/user/my_profile",
            method:"GET",
            contentType:"application/json",
            ...(signal&&{signal})
        });
        if (!data.success) {
            //toastHandler(data);
        }
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
export async function updateProfile(formData:{name?:string; mobile?:string; gender?:string}) {
    try {
        const data = await apiHandler<{name?:string; mobile?:string; gender?:string}, UserTypes>({
            endpoint:"/user/update_profile",
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
export async function logout() {
    try {
        const data = await apiHandler<null, string>({
            endpoint:"/user/logout",
            method:"POST",
            contentType:"application/json"
        });
        toastHandler(data);
        return data;
    } catch (error) {
        console.log(error);
        toastHandler({success:false, message:new Error(error as string).message});
        throw error;
    }
};
export async function verifyEmail({emailVerificationToken}:{emailVerificationToken:string;}) {
    try {
        const data = await apiHandler<null, UserTypes>({
            endpoint:`/user/verify_email?email_verification_token=${emailVerificationToken}`,
            method:"POST",
            contentType:"application/json"
        });
        toastHandler(data);
        return data;        
    } catch (error) {
        console.log(error);
        toastHandler({success:false, message:new Error(error as string).message});
        throw error;        
    }
}