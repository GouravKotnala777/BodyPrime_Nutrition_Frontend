import { useState, type ChangeEvent } from "react";
import { NavLink } from "react-router-dom";
import type { LoginFormTypes } from "../utils/types";
import { login } from "../apis/user.api";
import { useUser } from "../contexts/UserContext";
import Spinner from "../components/Spinner.component";


function Login() {
    const {setUser} = useUser();
    const [formData, setFormData] = useState<LoginFormTypes>({email:"", password:""});
    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    function onChangeHandler(e:ChangeEvent<HTMLInputElement>) {
        setFormData({...formData, [e.target.name]:e.target.value})
    };

    async function onClickHandler() {
        try {
            setIsProcessing(true);
            const res = await login(formData);
            if (res.success && res.message === "login successfull") {
                setUser(res.jsonData);
                window.location.href = "/home";
            }
            console.log(res);
            
        } catch (error) {
            console.log(error);
        }
        finally{
            setIsProcessing(false);
        }
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
            <button className="p-2 bg-black text-white px-8 rounded-[8px]" onClick={onClickHandler}>{isProcessing?<Spinner color="white" width="20px" />:"Login"}</button>

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