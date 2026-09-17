import { apiHandler, toastHandler } from "../utils/functions";
import type { AddressTypes } from "../utils/types";

export async function getMyAddresses() {
    try {
        const data = await apiHandler<null, AddressTypes[]>({
            endpoint:"/address/get_my_addresses",
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
export async function deleteMyAddress({addressID}:{addressID:string;}) {
    try {
        const data = await apiHandler<null, AddressTypes[]>({
            endpoint:`/address/delete_my_address?addressID=${addressID}`,
            method:"DELETE",
            contentType:"application/json"
        });
        return data;
    } catch (error) {
        console.log(error);
        toastHandler({success:false, message:new Error(error as string).message});
        throw error;
    }
};