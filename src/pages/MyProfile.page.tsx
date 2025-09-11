import { BiEdit } from "react-icons/bi";
import { useUser } from "../contexts/UserContext";
import img from "/public/vite.svg";
import { FcCancel } from "react-icons/fc";

function MyProfile() {
    const {userData, isUserAdmin} = useUser();
    
    return(
        <section className="border-2">
            <div className="border-2 border-violet-600 w-full">
                <img src={img} alt={img} className="border-2 border-indigo-600 w-full" />
            </div>
            <div className="border-2 border-blue-600 flex flex-col items-center">
                <div className="border-2 border-green-600 flex justify-between items-center w-full">
                    <div className="flex justify-between border-2 w-full text-[1.1rem]">
                        <span className="font-semibold text-[#fa3368]">Name</span>
                        <span className="font-semibold text-gray-700">{userData?.name}</span>
                    </div>
                    <BiEdit className="text-2xl" />
                    <FcCancel className="text-2xl" />
                </div>
                <div className="border-2 border-green-600 flex justify-between items-center w-full">
                    <div className="flex justify-between border-2 w-full text-[1.1rem]">
                        <span className="font-semibold text-[#c72953]">Email</span>
                        <span className="font-semibold text-[#8b6c6c]">{userData?.email}</span>
                    </div>
                    <BiEdit className="text-2xl" />
                    <FcCancel className="text-2xl" />
                </div>
                <div className="border-2 border-green-600 flex justify-between items-center w-full">
                    <div className="flex justify-between border-2 w-full text-[1.1rem]">
                        <span className="font-semibold text-[#fa3368]">Mobile</span>
                        <span className="font-semibold text-gray-700">{userData?.mobile}</span>
                    </div>
                    <BiEdit className="text-2xl" />
                    <FcCancel className="text-2xl" />
                </div>
                <div className="border-2 border-green-600 flex justify-between items-center w-full">
                    <div className="flex justify-between border-2 w-full text-[1.1rem]">
                        <span className="font-semibold text-[#fa3368]">Gender</span>
                        <span className="font-semibold text-gray-700">{userData?.gender}</span>
                    </div>
                    <BiEdit className="text-2xl" />
                    <FcCancel className="text-2xl" />
                </div>
                {
                    isUserAdmin() && 
                        <div className="border-2 border-green-600 flex justify-between items-center w-full">
                            <div className="flex justify-between border-2 w-full text-[1.1rem]">
                                <span className="font-semibold text-[#fa3368]">Role</span>
                                <span className="font-semibold text-gray-700">{userData?.role}</span>
                            </div>
                            <BiEdit className="text-2xl" />
                            <FcCancel className="text-2xl" />
                        </div>
                }
                <div className="border-2 border-green-600 flex justify-between items-center w-full">
                    <div className="flex justify-between border-2 w-full text-[1.1rem]">
                        <span className="font-semibold text-[#fa3368]">Password</span>
                        <span className="font-semibold text-gray-700"><input type="text" placeholder="Enter password to update" /></span>
                    </div>
                    <BiEdit className="text-2xl" />
                    <FcCancel className="text-2xl" />
                </div>
            </div>
        </section>
    )
};

export default MyProfile;