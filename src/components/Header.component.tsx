import viteLogo from '/vite.svg';
import { NavLink } from "react-router-dom";
import "../styles/components/header.component.css";
import type { SidebarPropTypes } from './Sidebar.component';
import { FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../contexts/CartContext';
import { useUser } from '../contexts/UserContext';

function Header({isHamActive, setIsHamActive}:SidebarPropTypes) {
    const {calculateTotalCartItems} = useCart();
    const {loggedInUserName} = useUser();
    return(
        <header 
            className="header flex justify-between gap-10 items-center p-3"
        >
            <section className="logo_section flex items-center gap-4">
                <img className="w-[40px] h-[40px]" src={viteLogo} alt={viteLogo} />
                <span className="text-xl font-semibold text-white">{loggedInUserName()}</span>
            </section>
            <section
                className="nav_section block"
            >
                <nav className="nav_nav flex w-[500px] justify-around text-white">
                <NavLink to="/home" className="nav_item">Home</NavLink>
                <NavLink to="/profile" className="nav_item">Profile</NavLink>
                <NavLink to="/orders" className="nav_item">Orders</NavLink>
                <NavLink to="/register" className="nav_item">Register</NavLink>
                <NavLink to="/login" className="nav_item">Login</NavLink>
                <NavLink to="/cart" className="nav_item">Cart</NavLink>
                </nav>
            </section>
            <section className="mobile_nav ml-auto items-center hidden">
                <NavLink to="/cart" className="relative w-[50px] h-[30px]">
                    <FiShoppingCart className="absolute text-3xl bottom-0 left-0" />
                    <span className="text-[12px] font-semibold w-[23px] h-[23px] grid place-items-center rounded-2xl absolute right-[9px] top-[-8px] bg-white text-[#b11433]">{calculateTotalCartItems()}</span>
                </NavLink>
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