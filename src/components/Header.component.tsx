import viteLogo from '/vite.svg';
import { NavLink } from "react-router-dom";
import "../styles/components/header.component.css";
import { useState } from 'react';

function Header() {
    const [isHamActive, setIsHamActive] = useState<boolean>(false);
    
    return(
        <header 
            className="header border-2 border-violet-500 flex justify-between items-center"
        >
            <section className="logo_section border-2 border-indigo-500 ">
                <img className="w-[60px] h-[60px]" src={viteLogo} alt={viteLogo} />
            </section>
            <section
                className="nav_section border-2 border-blue-500 block"
            >
                <nav className="nav_nav border-2 border-green-500 flex w-[500px] justify-around">
                <NavLink to="/home" className="nav_item border-2">Home</NavLink>
                <NavLink to="/profile" className="nav_item border-2">Profile</NavLink>
                <NavLink to="/orders" className="nav_item border-2">Orders</NavLink>
                <NavLink to="/signup" className="nav_item border-2">Register</NavLink>
                <NavLink to="/signin" className="nav_item border-2">Login</NavLink>
                </nav>
            </section>
            <section className="ham_section hidden w-[50px] h-[50px] relative">
                <div className="w-full h-full flex flex-col justify-between">
                    <div className="border-4"></div>
                    <div className="border-4"></div>
                    <div className="border-4"></div>
                </div>
                <input type="checkbox" name="" id=""
                    className="absolute top-0 left-0 w-full h-full opacity-0"
                    onClick={() => setIsHamActive(!isHamActive)}
                />
            </section>
        </header>
    )
};

export default Header;