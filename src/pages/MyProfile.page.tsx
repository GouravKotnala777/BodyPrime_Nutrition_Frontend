import { BiEdit } from "react-icons/bi";
import { useUser } from "../contexts/UserContext";
import { FcCancel } from "react-icons/fc";
import { useState, type ChangeEvent, type MouseEvent } from "react";
import { type UpdateProfileFormType } from "../utils/types";
import { updateProfile } from "../apis/user.api";
import { NavLink } from "react-router-dom";
import { BsArrowRight } from "react-icons/bs";

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
        <section className="max-w-xl mx-auto px-4 py-5">
            <div className="text-lg sm:text-2xl text-gray-800 font-bold text-center py-2 sm:py-4">
                <div>My Profile</div>
            </div>
            <div className="w-full">
                <img src="/placeholders/no_user.png" alt="/placeholders/no_user.png" className="w-[50%] min-w-60 mx-auto" />
            </div>
            <div className="flex flex-col items-center gap-4">
                <div className="flex justify-between items-center w-full">
                    {
                        updatingFields.includes("name") ?
                        <>
                            <div className="flex justify-between w-full text-[1.1rem]">
                                <span className="font-semibold text-primary-500">Name</span>
                                <input className="font-semibold text-gray-700" name="name" placeholder={userData?.name} onChange={onChangeFormHandler} />
                            </div>
                            <FcCancel id="name" className="text-2xl text-primary-500 cursor-pointer hover:opacity-60" onClick={updatingFieldSetter} />
                        </>
                        :
                        <>
                            <div className="flex justify-between w-full text-[1.1rem]">
                                <span className="font-semibold text-primary-500">Name</span>
                                <span className="font-semibold text-gray-700">{userData?.name}</span>
                            </div>
                            <BiEdit id="name" className="text-2xl text-primary-500 cursor-pointer hover:opacity-60" onClick={updatingFieldSetter} />
                        </>
                    }
                </div>
                <div className="flex justify-between items-center w-full">
                    <div className="flex justify-between w-full text-[1.1rem]">
                        <span className="font-semibold text-primary-400/80">Email</span>
                        <span className="font-semibold text-[#8b6c6c]">{userData?.email}</span>
                    </div>
                    <BiEdit className="text-2xl text-primary-400/80" />
                </div>
                <div className="flex justify-between items-center w-full">
                    {
                        updatingFields.includes("mobile") ?
                        <>
                            <div className="flex justify-between w-full text-[1.1rem]">
                                <span className="font-semibold text-primary-500">Mobile</span>
                                <input className="font-semibold text-gray-700" name="mobile" placeholder={userData?.mobile} onChange={onChangeFormHandler} />
                            </div>
                            <FcCancel id="mobile" className="text-2xl text-primary-500 cursor-pointer hover:opacity-60" onClick={updatingFieldSetter} />
                        </>
                        :
                        <>
                            <div className="flex justify-between w-full text-[1.1rem]">
                                <span className="font-semibold text-primary-500">Mobile</span>
                                <span className="font-semibold text-gray-700">{userData?.mobile}</span>
                            </div>
                            <BiEdit id="mobile" className="text-2xl text-primary-500 cursor-pointer hover:opacity-60" onClick={updatingFieldSetter} />
                        </>
                    }
                </div>
                <div className="flex justify-between items-center w-full">
                    {
                        updatingFields.includes("gender") ?
                        <>
                            <div className="flex justify-between w-full text-[1.1rem]">
                                <span className="font-semibold text-primary-500">Gender</span>
                                <input className="font-semibold text-gray-700" name="gender" placeholder={userData?.gender} onChange={onChangeFormHandler} />
                            </div>
                            <FcCancel id="gender" className="text-2xl text-primary-500 cursor-pointer hover:opacity-60" onClick={updatingFieldSetter} />
                        </>
                        :
                        <>
                            <div className="flex justify-between w-full text-[1.1rem]">
                                <span className="font-semibold text-primary-500">Gender</span>
                                <span className="font-semibold text-gray-700">{userData?.gender}</span>
                            </div>
                            <BiEdit id="gender" className="text-2xl text-primary-500 cursor-pointer hover:opacity-60" onClick={updatingFieldSetter} />
                        </>
                    }
                </div>
                {
                    isUserAdmin() && 
                        <div className="flex justify-between items-center w-full">
                            <div className="flex justify-between w-full text-[1.1rem]">
                                <span className="font-semibold text-primary-400/80">Role</span>
                                <span className="font-semibold text-[#8b6c6c]">{userData?.role}</span>
                            </div>
                            <BiEdit id="role" className="text-2xl text-primary-400/80" />
                        </div>
                }
                <div className="flex justify-between items-center w-full">
                    <div className="flex justify-between w-full text-[1.1rem]">
                        <span className="font-semibold text-primary-400/80">Password</span>
                        <span className="font-semibold text-[#8b6c6c]"><input type="text" placeholder="Enter password to update" /></span>
                    </div>
                    <BiEdit className="text-2xl text-primary-400/80" />
                </div>
                <div className="flex justify-between items-center w-full mt-2">
                    <button className="w-full text-xl font-semibold py-2 bg-[#f44769] text-white rounded-2xl hover:opacity-80" onClick={updateProfileFormHandler}>Update Profile</button>
                </div>
                <NavLink to="/logout" className="border-2 border-red-500 bg-red-50 w-full p-4 rounded-md flex justify-between items-center text-red-500">
                    <div className="font-semibold">Logout</div>
                    <BsArrowRight />
                </NavLink>
            </div>
        </section>
    )
};

export default MyProfile;