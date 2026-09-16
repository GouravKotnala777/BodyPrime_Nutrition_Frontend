import { useState, type ChangeEvent } from "react";
import { NavLink } from "react-router-dom";
import { type RegisterFormTypes } from "../utils/types";
import { register } from "../apis/user.api";
import Spinner from "../components/Spinner.component";
import toast from "react-hot-toast";


function Register() {
    const [formData, setFormData] = useState<RegisterFormTypes>({name:"", email:"", mobile:"", gender:"male", password:""});
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);


    function onChangeHandler(e:ChangeEvent<HTMLInputElement|HTMLSelectElement>) {
        setFormData({...formData, [e.target.name]:e.target.value});        
    };
    async function onClickHandler() {
        setIsProcessing(true);
        try {
            if (!formData.name || !formData.email || !formData.password || !formData.gender || !formData.mobile) {
                toast.error("all fields are required", {position:"top-center", duration:3000});
                throw new Error("all fields are required");
            }
            if (!formData.email.includes("@") || !formData.email.includes(".")) {
                toast.error("invalid email", {position:"top-center", duration:3000});
                throw new Error("invalid email");
            }
            setTimeout(async() => {
                const res = await register(formData);
                console.log(res);
                setIsProcessing(false);
            }, 1500);

        } catch (error) {
            console.log(error);
        }
    };

    return(
        <section className="border border-gray-200 max-w-2xl mx-auto flex flex-col items-center gap-10 mt-25 mb-10 p-10 rounded-md">
            <h1 className="text-xl font-bold">Register Page</h1>
            <div className="w-full max-w-xs">
                <input type="text" name="name" placeholder="Full Name"
                    className="border border-primary-200 bg-primary-50 text-gray-700 w-full px-3 py-2 rounded-md"
                    onChange={onChangeHandler}
                />
            </div>
            <div className="w-full max-w-xs">
                <input type="text" name="email"
                    placeholder="Email"
                    className="border border-primary-200 bg-primary-50 text-gray-700 w-full px-3 py-2 rounded-md"
                    onChange={onChangeHandler}
                />
            </div>
            <div className="w-full max-w-xs">
                <input type="text" name="mobile" placeholder="Mobile"
                    className="border border-primary-200 bg-primary-50 text-gray-700 w-full px-3 py-2 rounded-md"
                    onChange={onChangeHandler}
                />
            </div>
            <select name="gender" className="border border-primary-200 bg-primary-50 text-gray-700 w-full max-w-xs px-3 py-2 rounded-md" onChange={onChangeHandler}>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
            </select>
            <div className="border border-primary-200 w-full max-w-xs flex rounded-md overflow-hidden">
                <input type={isPasswordVisible?"text":"password"} name="password"
                    placeholder="Password"
                    className="bg-primary-50 text-gray-700 w-full px-3 py-2 rounded-l-md"
                    onChange={onChangeHandler}
                />
                <button className="w-10 h-full bg-primary-200 text-primary-800 px-3 py-2 relative hover:opacity-50 transition-all ease-in-out duration-300"
                    onClick={()=>setIsPasswordVisible(!isPasswordVisible)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={`size-6 -translate-x-1 ${isPasswordVisible?"blur-0 opacity-100 scale-100":"blur-sm opacity-0 scale-50"} transition-all ease-in-out duration-300`}>
                        <path strokeLinecap="round" pathLength="1" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                    
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={`absolute top-[50%] left-[50%] -translate-[50%] size-6 ${isPasswordVisible?"blur-sm opacity-0 scale-50":"blur-0 opacity-100 scale-100"} transition-all ease-in-out duration-300`}>
                        <path strokeLinecap="round" pathLength="1" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                        <path strokeLinecap="round" pathLength="1" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                </button>
            </div>
            <div className="w-full max-w-xs h-10">
                <button
                    className={`
                        border
                        border-primary-300 bg-primary-200 text-primary-800 pb-0.75 hover:opacity-50
                        text-center content-center h-full w-full rounded-lg
                        transition-all ease-in-out duration-300
                    `}
                    
                    onClick={onClickHandler}
                >
                    {
                        isProcessing ?
                            <div className="w-max mx-auto">
                                <Spinner color="var(--color-primary-800)" type="secondary" />
                            </div>
                            :
                            <span>Register</span>
                    }
                </button>
            </div>

            <div className="w-full">
                <div className="flex justify-between items-center">
                    <span className="border-[1px] border-gray-200 w-[40%]"></span>
                    <div>Or</div>
                    <span className="border-[1px] border-gray-200 w-[40%]"></span>
                </div>

                <div className="flex justify-between">
                    <NavLink to={"/user/forget_password"} className="underline underline-offset-3">Forget password</NavLink>
                    <div>
                        <span>already have acc </span>
                        <NavLink to={"/login"} className="underline underline-offset-3">Login</NavLink>
                    </div>
                </div>
            </div>
        </section>
    )
};


export default Register;