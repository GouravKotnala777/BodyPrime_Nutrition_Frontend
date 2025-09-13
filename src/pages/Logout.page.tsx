import { logout } from "../apis/user.api";



function Logout() {

    async function logoutHandler() {
        const res = await logout();

        console.log(res);
        
    };
    
    return(
        <section className="border-2 border-violet-600 flex flex-col items-center gap-10 my-10">
            <div className="text-2xl font-semibold">
                <h1>Logout Page</h1>
            </div>
            <div className="border-2 flex flex-col w-full gap-10">
                <div className="border-2 flex gap-2 text-xl mx-auto">
                    <input name="confirmation" type="checkbox" className="w-[1.2rem]" />
                    <p className="border-2">Do your really want to logout?</p>
                </div>
                <button className="text-xl bg-[#f44769] text-white py-2 rounded-2xl font-semibold" onClick={logoutHandler}>Logout</button>

            </div>
        </section>
    )
};

export default Logout;