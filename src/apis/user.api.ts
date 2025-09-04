import type { LoginFormTypes, RegisterFormTypes, UserTypes } from "../utils/types";




export async function login({email, password}:LoginFormTypes) {
    try {
        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/user/login`, {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            credentials:"include",
            body:JSON.stringify({email, password})
        });

        const result = await res.json();
        return result as {success:boolean; message:string; jsonData:UserTypes};
    } catch (error) {
        console.log(error);
        throw error;
    }
};
export async function register({name, email, mobile, gender, password}:RegisterFormTypes) {
    try {
        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/user/register`, {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            credentials:"include",
            body:JSON.stringify({name, email, mobile, gender, password})
        });

        const result = await res.json();
        return result as {success:boolean; message:string; jsonData:UserTypes};
    } catch (error) {
        console.log(error);
        throw error;
    }
};