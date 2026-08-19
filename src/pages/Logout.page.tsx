import { logout } from "../apis/user.api";



function Logout() {

    async function logoutHandler() {
        const res = await logout();

        console.log(res);
        
    };
    
    return(
        <section className="max-w-2xl mx-auto flex flex-col items-center gap-10 my-10">
            <div className="text-lg sm:text-2xl text-gray-800 font-bold text-center py-2 sm:py-4">
                <div>Logout Page</div>
            </div>
            <div className="flex flex-col w-full gap-10">
                <div className="flex gap-2 text-xl mx-auto">
                    <input name="confirmation" type="checkbox" className="w-[1.2rem]" />
                    <p className="">Do your really want to logout?</p>
                </div>
                <button className="text-xl bg-primary-400 text-white py-2 rounded-2xl font-semibold hover:opacity-80" onClick={logoutHandler}>Logout</button>

            </div>
        </section>
    )
};

export default Logout;