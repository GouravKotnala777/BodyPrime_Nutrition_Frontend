import viteLogo from '/vite.svg';
import { NavLink } from "react-router-dom";
import "../styles/components/header.component.css";
import type { SidebarPropTypes } from './Sidebar.component';

function Header({isHamActive, setIsHamActive}:SidebarPropTypes) {
    return(
        <header 
            className="header flex justify-between items-center p-3"
        >
            <section className="logo_section ">
                <img className="w-[40px] h-[40px]" src={viteLogo} alt={viteLogo} />
            </section>
            <section
                className="nav_section block"
            >
                <nav className="nav_nav flex w-[500px] justify-around text-white">
                <NavLink to="/home" className="nav_item">Home</NavLink>
                <NavLink to="/profile" className="nav_item">Profile</NavLink>
                <NavLink to="/orders" className="nav_item">Orders</NavLink>
                <NavLink to="/signup" className="nav_item">Register</NavLink>
                <NavLink to="/signin" className="nav_item">Login</NavLink>
                </nav>
            </section>
            <section className="ham_section hidden w-[30px] h-[30px] relative">
                <div className="w-full h-full flex flex-col justify-between">
                    <div className="border-2"></div>
                    <div className="border-2"></div>
                    <div className="border-2"></div>
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