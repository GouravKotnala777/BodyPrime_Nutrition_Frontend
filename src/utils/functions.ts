

interface APIHandlerTypes<BodyType> {
    endpoint:string;
    method:"GET"|"POST"|"PUT"|"DELETE";
    contentType?:"application/json";
    body?:BodyType|FormData;
};

export async function apiHandler <BodyType, JsonResType>({endpoint, method, contentType, body}:APIHandlerTypes<BodyType>) {
    try {
        const isFormData = body instanceof FormData;
        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/v1${endpoint}`, {
            method,
            ...(contentType&&{
                headers:{
                    "Content-Type":contentType
                }
            }),
            credentials:"include",
            body:isFormData?body:JSON.stringify(body)
        });

        const result = await res.json();
        return result as {success:boolean; message:string; jsonData:JsonResType};
    } catch (error) {
        console.log(error);
        throw error;
    }
};
