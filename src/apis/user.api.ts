

export interface UserTypes{
    name:string;
    email:string;
    password?:string;
    mobile:string;
    gender:"male"|"female"|"other";
    role:"user"|"admin"|"developer";
    isVerified:boolean;
    emailVerificationToken?:string|null;
    emailVerificationTokenExpire?:number|null;
};
export interface LoginFormTypes {
    email:string;
    password:string;
};

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
}