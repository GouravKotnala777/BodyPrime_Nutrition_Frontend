import { BiEdit } from "react-icons/bi";
import { useUser } from "../contexts/UserContext";
import { FcCancel } from "react-icons/fc";
import { useState, type ChangeEvent, type MouseEvent } from "react";
import { type UpdateProfileFormType } from "../utils/types";
import { updateProfile } from "../apis/user.api";

function MyProfile() {
    const {userData, setUser, isUserAdmin} = useUser();
    const [updatingFields, setUpdatingFields] = useState<string[]>([]);
    const [updateForm, setUpdateForm] = useState<UpdateProfileFormType>({});

    function updatingFieldSetter(e:MouseEvent<SVGElement>) {
        const field = e.currentTarget.id;
        console.log(field);
        
        if (!field)throw Error("profile updating filed not found");

        if (updatingFields.includes(field)) {
            const filteredArray = updatingFields.filter((e) => e !== field);
            setUpdatingFields(filteredArray);
        }
        else{
            setUpdatingFields((prev) => [...prev, field]);
        }
    };
    function onChangeFormHandler(e:ChangeEvent<HTMLInputElement>) {
        setUpdateForm({...updateForm, [e.target.name]:e.target.value});
    };
    async function updateProfileFormHandler() {
        const res = await updateProfile(updateForm);
        
        setUser(res.jsonData);
        setUpdateForm({});
        setUpdatingFields([]);
        console.log(res);
    };
    
    return(
        <section className="px-4 py-5">
            <div className="w-full">
                <img src="/vite.svg" alt="/vite.svg" className="w-full" />
            </div>
            <div className="flex flex-col items-center gap-4">
                <div className="flex justify-between items-center w-full">
                    {
                        updatingFields.includes("name") ?
                        <>
                            <div className="flex justify-between w-full text-[1.1rem]">
                                <span className="font-semibold text-[#fa3368]">Name</span>
                                <input className="font-semibold text-gray-700" name="name" placeholder={userData?.name} onChange={onChangeFormHandler} />
                            </div>
                            <FcCancel id="name" className="text-2xl text-[#fa3368]" onClick={updatingFieldSetter} />
                        </>
                        :
                        <>
                            <div className="flex justify-between w-full text-[1.1rem]">
                                <span className="font-semibold text-[#fa3368]">Name</span>
                                <span className="font-semibold text-gray-700">{userData?.name}</span>
                            </div>
                            <BiEdit id="name" className="text-2xl text-[#fa3368]" onClick={updatingFieldSetter} />
                        </>
                    }
                </div>
                <div className="flex justify-between items-center w-full">
                    <div className="flex justify-between w-full text-[1.1rem]">
                        <span className="font-semibold text-[#c7295385]">Email</span>
                        <span className="font-semibold text-[#8b6c6c]">{userData?.email}</span>
                    </div>
                    <BiEdit className="text-2xl text-[#c7295385]" />
                </div>
                <div className="flex justify-between items-center w-full">
                    {
                        updatingFields.includes("mobile") ?
                        <>
                            <div className="flex justify-between w-full text-[1.1rem]">
                                <span className="font-semibold text-[#fa3368]">Mobile</span>
                                <input className="font-semibold text-gray-700" name="mobile" placeholder={userData?.mobile} onChange={onChangeFormHandler} />
                            </div>
                            <FcCancel id="mobile" className="text-2xl text-[#fa3368]" onClick={updatingFieldSetter} />
                        </>
                        :
                        <>
                            <div className="flex justify-between w-full text-[1.1rem]">
                                <span className="font-semibold text-[#fa3368]">Mobile</span>
                                <span className="font-semibold text-gray-700">{userData?.mobile}</span>
                            </div>
                            <BiEdit id="mobile" className="text-2xl text-[#fa3368]" onClick={updatingFieldSetter} />
                        </>
                    }
                </div>
                <div className="flex justify-between items-center w-full">
                    {
                        updatingFields.includes("gender") ?
                        <>
                            <div className="flex justify-between w-full text-[1.1rem]">
                                <span className="font-semibold text-[#fa3368]">Gender</span>
                                <input className="font-semibold text-gray-700" name="gender" placeholder={userData?.gender} onChange={onChangeFormHandler} />
                            </div>
                            <FcCancel id="gender" className="text-2xl text-[#fa3368]" onClick={updatingFieldSetter} />
                        </>
                        :
                        <>
                            <div className="flex justify-between w-full text-[1.1rem]">
                                <span className="font-semibold text-[#fa3368]">Gender</span>
                                <span className="font-semibold text-gray-700">{userData?.gender}</span>
                            </div>
                            <BiEdit id="gender" className="text-2xl text-[#fa3368]" onClick={updatingFieldSetter} />
                        </>
                    }
                </div>
                {
                    isUserAdmin() && 
                        <div className="flex justify-between items-center w-full">
                            <div className="flex justify-between w-full text-[1.1rem]">
                                <span className="font-semibold text-[#c7295385]">Role</span>
                                <span className="font-semibold text-[#8b6c6c]">{userData?.role}</span>
                            </div>
                            <BiEdit id="role" className="text-2xl text-[#c7295385]" />
                        </div>
                }
                <div className="flex justify-between items-center w-full">
                    <div className="flex justify-between w-full text-[1.1rem]">
                        <span className="font-semibold text-[#c7295385]">Password</span>
                        <span className="font-semibold text-[#8b6c6c]"><input type="text" placeholder="Enter password to update" /></span>
                    </div>
                    <BiEdit className="text-2xl text-[#c7295385]" />
                </div>
                <div className="flex justify-between items-center w-full mt-2">
                    <button className="w-full text-xl font-semibold py-2 bg-[#f44769] text-white rounded-2xl hover:opacity-[0.6]" onClick={updateProfileFormHandler}>Update Profile</button>
                </div>
            </div>
        </section>
    )
};

export default MyProfile;