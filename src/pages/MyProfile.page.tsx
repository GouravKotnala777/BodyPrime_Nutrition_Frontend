import { useUser } from "../contexts/UserContext";
import { useState, type ChangeEvent, type MouseEvent } from "react";
import { type UpdateProfileFormType } from "../utils/types";
import { updateProfile } from "../apis/user.api";
import { NavLink } from "react-router-dom";
import { BsArrowRight } from "react-icons/bs";

function MyProfile() {
    const {userData, setUser, isUserAdmin} = useUser();
    const [updatingFields, setUpdatingFields] = useState<string[]>([]);
    const [updateForm, setUpdateForm] = useState<UpdateProfileFormType>({});

    function updatingFieldSetter(e:MouseEvent<HTMLButtonElement>) {
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
        <section className="border border-transparent"
            style={{
                //backgroundImage:"url(patterns/aztec.svg)",
                backgroundImage:"url(patterns/topography.svg)",
                backgroundBlendMode:"overlay",
                backgroundColor:"var(--primary-50)"
            }}
        >
            <div className="border border-gray-200 bg-white/80 max-w-xl mx-auto my-10 px-4 py-5 rounded-2xl">
                <div className="text-lg sm:text-xl text-gray-800 font-bold text-center py-2 sm:py-4">
                    <div>My Profile</div>
                </div>
                <div className="border border-gray-200 relative aspect-square w-[50%] min-w-60 mx-auto my-10 rounded-full overflow-hidden">
                    <img src="/logo3.png" alt="/logo3.png" className="w-full h-full rounded-full" />
                    {/*<ImageWithFallback src={"/asd"} alt={"/asd"} fallbackSrc="/aa.jpg" className="w-full h-full rounded-full" />*/}
                    <div className="absolute top-0 left-0 w-full h-full rounded-full [box-shadow:0px_0px_20px_6px_black_inset]"></div>
                    {/*<ImageWithFallback src={"/asd"} alt={"/asd"} fallbackSrc="/placeholders/no_user.png" />*/}
                </div>
                <div className="flex flex-col items-center gap-4">
                    <div className="flex justify-between items-center w-full gap-2">
                        {
                            updatingFields.includes("name") ?
                            <>
                                <div className="flex justify-between w-full text-[1.1rem]">
                                    <span className="font-semibold text-gray-700">Name</span>
                                    <input className="font-semibold text-gray-700" name="name" placeholder={userData?.name} onChange={onChangeFormHandler} />
                                </div>
                                <button id="name" className="size-6" onClick={updatingFieldSetter}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="text-primary-500 cursor-pointer hover:opacity-60">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </>
                            :
                            <>
                                <div className="flex justify-between w-full text-[1.1rem]">
                                    <span className="font-semibold text-gray-700">Name</span>
                                    <span className="text-gray-600">{userData?.name}</span>
                                </div>
                                <button id="name" className="size-6" onClick={updatingFieldSetter}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="text-secondary-400 cursor-pointer hover:opacity-60">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                    </svg>
                                </button>
                            </>
                        }
                    </div>
                    <div className="flex justify-between items-center w-full gap-2">
                        <div className="flex justify-between w-full text-[1.1rem]">
                            <span className="font-semibold text-gray-700">Email</span>
                            <span className="text-gray-500/50">{userData?.email}</span>
                        </div>
                        <div className="size-6">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="text-secondary-400/30">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                            </svg>
                        </div>
                    </div>
                    <div className="flex justify-between items-center w-full gap-2">
                        {
                            updatingFields.includes("mobile") ?
                            <>
                                <div className="flex justify-between w-full text-[1.1rem]">
                                    <span className="font-semibold text-gray-700">Mobile</span>
                                    <input className="font-semibold text-gray-700" name="mobile" placeholder={userData?.mobile} onChange={onChangeFormHandler} />
                                </div>
                                <button id="mobile" className="size-6" onClick={updatingFieldSetter}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="text-secondary-900 cursor-pointer hover:opacity-60">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </>
                            :
                            <>
                                <div className="flex justify-between w-full text-[1.1rem]">
                                    <span className="font-semibold text-gray-700">Mobile</span>
                                    <span className="text-gray-600">{userData?.mobile}</span>
                                </div>
                                <button id="mobile" className="size-6" onClick={updatingFieldSetter}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="text-secondary-400 cursor-pointer hover:opacity-60">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                    </svg>
                                </button>
                            </>
                        }
                    </div>
                    <div className="flex justify-between items-center w-full gap-2">
                        {
                            updatingFields.includes("gender") ?
                            <>
                                <div className="flex justify-between w-full text-[1.1rem]">
                                    <span className="font-semibold text-gray-700">Gender</span>
                                    <input className="font-semibold text-gray-700" name="gender" placeholder={userData?.gender} onChange={onChangeFormHandler} />
                                </div>
                                <button id="gender" className="size-6" onClick={updatingFieldSetter}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="text-secondary-900 cursor-pointer hover:opacity-60">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </>
                            :
                            <>
                                <div className="flex justify-between w-full text-[1.1rem]">
                                    <span className="font-semibold text-gray-700">Gender</span>
                                    <span className="text-gray-600">{userData?.gender}</span>
                                </div>
                                <button id="gender" className="size-6" onClick={updatingFieldSetter}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="text-secondary-400 cursor-pointer hover:opacity-60">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                    </svg>
                                </button>
                            </>
                        }
                    </div>
                    {
                        isUserAdmin() && 
                            <div className="flex justify-between items-center w-full gap-2">
                                <div className="flex justify-between w-full text-[1.1rem]">
                                    <span className="font-semibold text-gray-700">Role</span>
                                    <span className="text-gray-500/50">{userData?.role}</span>
                                </div>
                                <div id="role" className="size-6">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="text-secondary-400/30">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                    </svg>
                                </div>
                            </div>
                    }
                    <div className="flex justify-between items-center w-full gap-2">
                        <div className="flex justify-between w-full text-[1.1rem]">
                            <span className="font-semibold text-gray-700">Password</span>
                            <span className="text-gray-500/50"><input type="text" placeholder="Enter password to update" /></span>
                        </div>
                        <div className="size-6">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="text-secondary-400">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                            </svg>
                        </div>
                    </div>

                    {/* update button */}
                    <div className="w-full max-w-xl">
                        <button
                            className={`
                                border
                                border-secondary-300 bg-secondary-200 text-secondary-900 hover:bg-secondary-100
                                text-center content-center h-full w-full rounded-lg
                                transition-all ease-in-out duration-300
                            `}
                            onClick={updateProfileFormHandler}
                        >
                            {
                                //isProcessing ?
                                //    <div className="w-max mx-auto">
                                //        <Spinner color="var(--color-primary-800)" type="secondary" />
                                //    </div>
                                //    :
                                    <div className="py-3">Update Profile</div>
                            }
                        </button>
                    </div>

                    {/* logout navigation */}
                    <div className="w-full max-w-xl">
                        <NavLink to="/logout"
                            className={`
                                border
                                border-primary-500 bg-white text-primary-500 hover:bg-primary-50
                                flex justify-between items-center h-full w-full p-4 pr-6 rounded-lg
                                transition-all ease-in-out duration-300 group
                            `}
                            
                            //onClick={onClickHandler}
                        >
                            {
                                //isProcessing ?
                                //    <div className="w-max mx-auto">
                                //        <Spinner color="var(--color-primary-800)" type="secondary" />
                                //    </div>
                                //    :
                                    <div className="">Logout</div>
                            }

                            <BsArrowRight className="group-hover:translate-x-4 transition-transform ease-out duration-300" />
                        </NavLink>
                    </div>
                </div>
            </div>
        </section>
    )
};

export default MyProfile;