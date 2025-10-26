//import viteLogo from '/vite.svg';
import { NavLink } from "react-router-dom";
import "../styles/components/header.component.css";
import type { SidebarPropTypes } from './Sidebar.component';
import { FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../contexts/CartContext';
import { useUser } from '../contexts/UserContext';
import ImageWithFallback from './ImageWithFallback.component';
import { BiSearch } from "react-icons/bi";

function Header({isHamActive, setIsHamActive, setIsSearchActive}:SidebarPropTypes) {
    const {calculateTotalCartItems} = useCart();
    const {loggedInUserName, isUserAuthenticated, isUserAdmin} = useUser();
    return(
        <header 
            className="border-2 border-green-400 header flex justify-between gap-10 items-center h-[10vh] px-3"
        >
            <section className="logo_section flex items-center gap-6">
                
                <ImageWithFallback src="/vite.svg" alt="/vite.svg" fallbackSrc={`${import.meta.env.VITE_SERVER_URL}/api/v1/public/no_user.png`} className="w-[40px] h-[40px]" />
                <NavLink to="/my_profile" className="text-xl font-semibold text-white">{isUserAuthenticated()?loggedInUserName():"Login"}</NavLink>
            </section>
            <section
                className="nav_section block"
            >
                <nav className="nav_nav flex w-[500px] justify-around text-white">
                <NavLink to="/home" className="nav_item">Home</NavLink>
                <NavLink to="/my_profile" className="nav_item">Profile</NavLink>
                {isUserAdmin() && <NavLink to="/inventory" className="nav_item">Inventory</NavLink>}
                <NavLink to="/wishlist" className="nav_item">Wishlist</NavLink>
                <NavLink to="/my_orders" className="nav_item">My Orders</NavLink>
                <NavLink to="/register" className="nav_item">Register</NavLink>
                <NavLink to="/login" className="nav_item">Login</NavLink>
                <NavLink to="/cart" className="nav_item">Cart</NavLink>
                </nav>
            </section>
            <section className="mobile_nav ml-auto items-center hidden relative w-[30px] h-[30px]">
                <BiSearch className="absolute text-3xl bottom-0 left-0" onClick={() => setIsSearchActive(true)} />
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