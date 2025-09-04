import { useState, type ChangeEvent, type MouseEvent } from "react";
import { NavLink } from "react-router-dom";
import { type RegisterFormTypes } from "../utils/types";
import { register } from "../apis/user.api";


function Register() {
    const [formData, setFormData] = useState<RegisterFormTypes>({name:"", email:"", mobile:"", gender:"male", password:""});

    function onChangeHandler(e:ChangeEvent<HTMLInputElement|HTMLSelectElement>) {
        setFormData({...formData, [e.target.name]:e.target.name});        
    };
    async function onClickHandler(e:MouseEvent<HTMLButtonElement>) {
        const res = await register(formData);

        console.log(res);
    };

    return(
        <section className="Register_section flex flex-col items-center gap-10 p-10">
            <h1 className="text-4xl font-bold">Register Page</h1>
            <label>
                <input type="text" placeholder="Full Name" className="p-2 bg-amber-100" onChange={onChangeHandler} />
            </label>
            <label>
                <input type="text" placeholder="Email" className="p-2 bg-amber-100" onChange={onChangeHandler} />
            </label>
            <label>
                <input type="text" placeholder="Mobile" className="p-2 bg-amber-100" onChange={onChangeHandler} />
            </label>
            <label>
                <input type="text" placeholder="Password" className="p-2 bg-amber-100" onChange={onChangeHandler} />
            </label>

            <label className="p-2 bg-amber-100">
                <select name="gender" onChange={onChangeHandler}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </select>
            </label>

            <button className="p-2 bg-black text-white px-8 rounded-[8px]" onClick={onClickHandler}>Register</button>

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


export default Register;