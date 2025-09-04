import { useState, type ChangeEvent, type MouseEvent } from "react";
import { NavLink } from "react-router-dom";
import type { LoginFormTypes } from "../utils/types";
import { login } from "../apis/user.api";


function Login() {
    const [formData, setFormData] = useState<LoginFormTypes>({email:"", password:""});

    function onChangeHandler(e:ChangeEvent<HTMLInputElement>) {
        setFormData({...formData, [e.target.name]:e.target.value})
    };

    async function onClickHandler(e:MouseEvent<HTMLButtonElement>) {
        const res = await login(formData);

        console.log(res);
    };

    return(
        <section className="login_section flex flex-col items-center gap-10 p-10">
            <h1 className="text-4xl font-bold">Login Page</h1>
            <label>
                <input type="text" name="email" placeholder="Email" className="p-2 bg-amber-100" onChange={onChangeHandler} />
            </label>
            <label>
                <input type="text" name="password" placeholder="Password" className="p-2 bg-amber-100" onChange={onChangeHandler} />
            </label>
            <button className="p-2 bg-black text-white px-8 rounded-[8px]" onClick={onClickHandler}>Login</button>

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