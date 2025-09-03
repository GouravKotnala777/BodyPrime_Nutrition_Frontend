import { NavLink } from "react-router-dom";


function Login() {

    return(
        <section className="login_section flex flex-col items-center gap-10 p-10">
            <h1 className="text-4xl font-bold">Login Page</h1>
            <label>
                <input type="text" placeholder="Email" className="p-2 bg-amber-100" />
            </label>
            <label>
                <input type="text" placeholder="Password" className="p-2 bg-amber-100" />
            </label>
            <button className="p-2 bg-black text-white px-8 rounded-[8px]">Login</button>

            <section className="w-full">
            <div className="flex justify-between items-center">
                <span className="border-[1px] border-gray-600 w-[40%]"></span>
                <div>Or</div>
                <span className="border-[1px] border-gray-600 w-[40%]"></span>
            </div>

            <section className="flex justify-between">
                <NavLink to={"/user/forget_password"} className="underline underline-offset-3">Forget password</NavLink>
                <div>
                    <span>don't have acc </span>
                    <NavLink to={"/register"} className="underline underline-offset-3">Register</NavLink>
                </div>
            </section>
            </section>
        </section>
    )
};


export default Login;