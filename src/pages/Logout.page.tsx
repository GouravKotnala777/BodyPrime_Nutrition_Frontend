import { useState } from "react";
import { logout } from "../apis/user.api";
import Spinner from "../components/Spinner.component";
import toast from "react-hot-toast";



function Logout() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isConfirmed, setIsConfirmed] = useState<boolean>(false);


    async function logoutHandler() {
        setIsLoading(true);
        
        setTimeout(async() => {
            if (!isConfirmed) {
                toast.error("Please check the confirmation field first", {position:"top-center", duration:3000});
                setIsLoading(false);
                return;
            }
            const res = await logout();
            
            if (res.success) {
                window.location.href = "/";
            }
            setIsLoading(false);
        }, 1000);
    };
    
    return(
        <section className="max-w-lg mx-auto flex flex-col items-center gap-10 my-10">
            <div className="text-lg sm:text-2xl text-gray-800 font-bold text-center mt-10 py-2 sm:py-4">
                <div>Logout Page</div>
            </div>
            <div className="flex flex-col w-full gap-15">
                <div className="flex gap-2 text-xl mx-auto">
                    <input name="confirmation" type="checkbox" className="w-[1.2rem]" checked={isConfirmed} onChange={(e) => setIsConfirmed(e.target.checked)} />
                    <p className="">Do your really want to logout?</p>
                </div>
                <div className="flex items-center gap-4 w-full sm:w-60 h-10 mx-auto">
                    <button
                        className={`
                            border
                            border-primary-300 bg-primary-200 text-primary-800 pb-0.75 hover:opacity-50
                            text-center content-center h-full w-full rounded-lg
                            transition-all ease-in-out duration-300
                        `}
                        
                        onClick={logoutHandler}
                    >
                        {
                            isLoading ?
                                <div className="w-max mx-auto">
                                    <Spinner color="var(--color-primary-800)" type="secondary" />
                                </div>
                                :
                                <span>Logout</span>
                        }
                    </button>
                </div>

            </div>
        </section>
    )
};

export default Logout;